import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

describe("🧱 ProjectRegistry (UUPS Upgradeable)", function () {
  let IdentityRegistry: any;
  let ProjectRegistry: any;
  let identity: Contract;
  let project: Contract;
  let proxyIdentity: Contract;
  let proxyProject: Contract;
  let admin: any,
    ong: any,
    profesor: any,
    inversor: any,
    beneficiario: any,
    keyRegistry: any;

  beforeEach(async function () {
    [admin, ong, profesor, inversor, beneficiario, keyRegistry] =
      await ethers.getSigners();

    // ---------- Deploy IdentityRegistry ----------
    IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
    identity = await IdentityRegistry.deploy();
    await identity.waitForDeployment();

    const ProxyFactory = await ethers.getContractFactory("OZERC1967Proxy");
    const initDataIdentity = identity.interface.encodeFunctionData(
      "initialize",
      [admin.address, admin.address, ethers.parseEther("0.01")]
    );

    const proxyIdentityInstance = await ProxyFactory.deploy(
      await identity.getAddress(),
      initDataIdentity
    );
    await proxyIdentityInstance.waitForDeployment();

    proxyIdentity = IdentityRegistry.attach(
      await proxyIdentityInstance.getAddress()
    );

    // Registrar y aprobar ONG
    const ongData = {
      wallet: ong.address,
      name: "ONG Verde",
      country: "CO",
      description: "ONG dedicada al ambiente",
      metadataURI: "ipfs://ong-meta",
      didHash: ethers.ZeroHash,
      verified: false,
    };
    await proxyIdentity
      .connect(ong)
      .requestRegistrationONG(ongData, { value: ethers.parseEther("0.01") });
    await proxyIdentity.connect(admin).approveONG(ong.address);

    // Registrar profesor
    const profData = {
      wallet: profesor.address,
      name: "Juan Profesor",
      specialty: "Agrotech",
      metadataURI: "ipfs://prof-meta",
      didHash: ethers.ZeroHash,
      associatedONGs: [],
      active: true,
    };
    await proxyIdentity
      .connect(ong)
      .registerProfessor(profesor.address, profData);

    // ---------- Deploy ProjectRegistry ----------
    ProjectRegistry = await ethers.getContractFactory("ProjectRegistry");
    project = await ProjectRegistry.deploy();
    await project.waitForDeployment();

    const identityAddress = await proxyIdentity.getAddress(); // ✅ cast implícito como address payable
    const initDataProject = project.interface.encodeFunctionData("initialize", [
      admin.address,
      identityAddress,
    ]);

    const proxyProjectInstance = await ProxyFactory.deploy(
      await project.getAddress(),
      initDataProject
    );
    await proxyProjectInstance.waitForDeployment();

    proxyProject = ProjectRegistry.attach(
      await proxyProjectInstance.getAddress()
    );

    // ✅ Verificar que el rol ADMIN_ROLE fue asignado correctamente
    const ADMIN_ROLE = await proxyProject.ADMIN_ROLE();
    expect(await proxyProject.hasRole(ADMIN_ROLE, admin.address)).to.be.true;

    await proxyProject.connect(admin).setKeyRegistry(keyRegistry.address);

    // Vincular roles
    const ONG_ROLE = await proxyProject.ONG_ROLE();
    const PROFESSOR_ROLE = await proxyProject.PROFESSOR_ROLE();
    await proxyProject.connect(admin).grantRole(ONG_ROLE, ong.address);
    await proxyProject
      .connect(admin)
      .grantRole(PROFESSOR_ROLE, profesor.address);
  });

  // --------------------------------------------------------
  // 🟢 HAPPY PATH
  // --------------------------------------------------------
  it("✅ ONG puede crear un proyecto y emitir evento ProjectCreated", async function () {
    const tx = await proxyProject
      .connect(ong)
      .createProject(
        "Capacitación Rural",
        "Formación en prácticas sostenibles",
        inversor.address,
        Math.floor(Date.now() / 1000),
        Math.floor(Date.now() / 1000) + 86400 * 30,
        ethers.parseEther("100"),
        "ipfs://project-meta"
      );
    await expect(tx)
      .to.emit(proxyProject, "ProjectCreated")
      .withArgs(1, ong.address, inversor.address, "Capacitación Rural");
  });

  it("🧑‍🏫 ONG puede asignar profesor a proyecto", async function () {
    await proxyProject
      .connect(ong)
      .createProject(
        "Proyecto AgroTech",
        "Formación digital",
        inversor.address,
        Math.floor(Date.now() / 1000),
        Math.floor(Date.now() / 1000) + 86400,
        ethers.parseEther("50"),
        "ipfs://project-meta"
      );

    await expect(proxyProject.connect(ong).assignProfessor(1, profesor.address))
      .to.emit(proxyProject, "ProfessorAssigned")
      .withArgs(1, profesor.address);
  });

  it("🧾 Profesor asignado puede registrar actividad", async function () {
    await proxyProject
      .connect(ong)
      .createProject(
        "Proyecto Educación",
        "Educación ambiental",
        inversor.address,
        Math.floor(Date.now() / 1000),
        Math.floor(Date.now() / 1000) + 86400,
        ethers.parseEther("10"),
        "ipfs://project-meta"
      );
    await proxyProject.connect(ong).assignProfessor(1, profesor.address);

    const tx = await proxyProject.connect(profesor).registerActivity(
      1,
      0, // TRAINING
      "Taller 1",
      "Capacitación inicial",
      Math.floor(Date.now() / 1000) + 3600,
      "ipfs://activity-meta"
    );
    await expect(tx)
      .to.emit(proxyProject, "ActivityRegistered")
      .withArgs(1, 1, profesor.address);
  });

  it("📦 KEYRegistry puede vincular evidencia", async function () {
    await proxyProject
      .connect(ong)
      .createProject(
        "Proyecto Evidencia",
        "Registro de pruebas",
        inversor.address,
        Math.floor(Date.now() / 1000),
        Math.floor(Date.now() / 1000) + 86400,
        ethers.parseEther("20"),
        "ipfs://project-meta"
      );
    await proxyProject.connect(ong).assignProfessor(1, profesor.address);
    await proxyProject
      .connect(profesor)
      .registerActivity(
        1,
        0,
        "Actividad con evidencia",
        "Sesión práctica",
        Math.floor(Date.now() / 1000) + 3600,
        "ipfs://activity-meta"
      );

    const hash = ethers.keccak256(ethers.toUtf8Bytes("test-evidence"));
    await expect(proxyProject.connect(keyRegistry).linkEvidence(1, hash))
      .to.emit(proxyProject, "EvidenceLinked")
      .withArgs(1, 1, hash);
  });

  // --------------------------------------------------------
  // 🔴 BAD PATH
  // --------------------------------------------------------
  it("🚫 ONG no puede crear proyecto con fechas inválidas", async function () {
    await expect(
      proxyProject
        .connect(ong)
        .createProject(
          "Error Project",
          "Fechas incorrectas",
          inversor.address,
          Math.floor(Date.now() / 1000) + 5000,
          Math.floor(Date.now() / 1000),
          ethers.parseEther("5"),
          "ipfs://meta"
        )
    ).to.be.revertedWith("Dates");
  });

  it("🚫 Profesor no asignado no puede registrar actividad", async function () {
    await proxyProject
      .connect(ong)
      .createProject(
        "Proyecto Libre",
        "Sin profesor",
        inversor.address,
        Math.floor(Date.now() / 1000),
        Math.floor(Date.now() / 1000) + 86400,
        ethers.parseEther("5"),
        "ipfs://meta"
      );

    await expect(
      proxyProject
        .connect(profesor)
        .registerActivity(
          1,
          0,
          "Actividad sin permiso",
          "Test",
          Math.floor(Date.now() / 1000) + 3600,
          "ipfs://meta"
        )
    ).to.be.revertedWith("Unassigned");
  });

  it("🚫 KEYRegistry no autorizado no puede vincular evidencia", async function () {
    await proxyProject
      .connect(ong)
      .createProject(
        "Proyecto Seguridad",
        "Evidencia segura",
        inversor.address,
        Math.floor(Date.now() / 1000),
        Math.floor(Date.now() / 1000) + 86400,
        ethers.parseEther("5"),
        "ipfs://meta"
      );
    await proxyProject.connect(ong).assignProfessor(1, profesor.address);
    await proxyProject
      .connect(profesor)
      .registerActivity(
        1,
        0,
        "Actividad",
        "Test",
        Math.floor(Date.now() / 1000) + 3600,
        "ipfs://meta"
      );

    const hash = ethers.keccak256(ethers.toUtf8Bytes("unauthorized"));
    await expect(
      proxyProject.connect(admin).linkEvidence(1, hash)
    ).to.be.revertedWith("!Auth");
  });
});
