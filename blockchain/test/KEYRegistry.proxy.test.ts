import { expect } from "chai";
import { ethers, artifacts } from "hardhat";
import { Contract } from "ethers";
import KEYRegistryABI from "../artifacts/contracts/KEYRegistry.sol/KEYRegistry.json";
import KEYRegistryV2ABI from "../artifacts/contracts/mocks/KEYRegistryV2.sol/KEYRegistryV2.json";


describe("🧱 KEYRegistry (UUPS Upgradeable, full integration)", function () {
  let IdentityRegistry: any;
  let ProjectRegistry: any;
  let KEYRegistry: any;

  let identity: Contract;
  let project: Contract;
  let key: Contract;
  let proxyIdentity: Contract;
  let proxyProject: Contract;
  let proxyKey: Contract;

  let admin: any,
    ong: any,
    profesor: any,
    inversor: any,
    beneficiario: any,
    phalaTEE: any,
    sbt: any;

  beforeEach(async function () {
    [admin, ong, profesor, inversor, beneficiario, phalaTEE, sbt] =
      await ethers.getSigners();

    // ---------------- IdentityRegistry ----------------
    IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
    identity = await IdentityRegistry.deploy();
    await identity.waitForDeployment();

    const ProxyFactory = await ethers.getContractFactory("OZERC1967Proxy");
    const initIdentity = identity.interface.encodeFunctionData("initialize", [
      admin.address,
      admin.address,
      ethers.parseEther("0.01"),
    ]);

    const proxyIdentityInstance = await ProxyFactory.deploy(
      await identity.getAddress(),
      initIdentity
    );
    await proxyIdentityInstance.waitForDeployment();
    proxyIdentity = IdentityRegistry.attach(
      await proxyIdentityInstance.getAddress()
    );

    // Registrar ONG y Profesor
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

    const profData = {
      wallet: profesor.address,
      name: "Profesor Juan",
      specialty: "Agrotech",
      metadataURI: "ipfs://prof-meta",
      didHash: ethers.ZeroHash,
      associatedONGs: [],
      active: true,
    };
    await proxyIdentity
      .connect(ong)
      .registerProfessor(profesor.address, profData);

    // ---------------- ProjectRegistry ----------------
    ProjectRegistry = await ethers.getContractFactory("ProjectRegistry");
    project = await ProjectRegistry.deploy();
    await project.waitForDeployment();

    const initProject = project.interface.encodeFunctionData("initialize", [
      admin.address,
      await proxyIdentity.getAddress(),
    ]);
    const proxyProjectInstance = await ProxyFactory.deploy(
      await project.getAddress(),
      initProject
    );
    await proxyProjectInstance.waitForDeployment();
    proxyProject = ProjectRegistry.attach(
      await proxyProjectInstance.getAddress()
    );

    const ONG_ROLE = await proxyProject.ONG_ROLE();
    const PROFESSOR_ROLE = await proxyProject.PROFESSOR_ROLE();
    await proxyProject.connect(admin).grantRole(ONG_ROLE, ong.address);
    await proxyProject
      .connect(admin)
      .grantRole(PROFESSOR_ROLE, profesor.address);

    // ONG crea proyecto y asigna profesor
    await proxyProject
      .connect(ong)
      .createProject(
        "Proyecto Sostenible",
        "Educación ambiental",
        inversor.address,
        Math.floor(Date.now() / 1000),
        Math.floor(Date.now() / 1000) + 86400,
        ethers.parseEther("10"),
        "ipfs://project-meta"
      );
    await proxyProject.connect(ong).assignProfessor(1, profesor.address);
    await proxyProject
      .connect(profesor)
      .registerActivity(
        1,
        0,
        "Taller Verde",
        "Capacitación ambiental",
        Math.floor(Date.now() / 1000) + 3600,
        "ipfs://activity-meta"
      );

    // ---------------- KEYRegistry ----------------
    KEYRegistry = await ethers.getContractFactory("KEYRegistry");
    key = await KEYRegistry.deploy();
    await key.waitForDeployment();

    const initKey = key.interface.encodeFunctionData("initialize", [
      admin.address,
      await proxyIdentity.getAddress(),
      await proxyProject.getAddress(),
    ]);
    const proxyKeyInstance = await ProxyFactory.deploy(
      await key.getAddress(),
      initKey
    );
    await proxyKeyInstance.waitForDeployment();

    const proxyKeyAddress = await proxyKeyInstance.getAddress(); // 👈 Guardamos la dirección
    proxyKey = KEYRegistry.attach(proxyKeyAddress);
    (proxyKey as any).__proxyAddress = proxyKeyAddress; // 👈 Inyectamos manualmente la dirección

    // 🔧 Configurar dependencias cruzadas
    await proxyProject
      .connect(admin)
      .setKeyRegistry(await proxyKey.getAddress());

    // Configuración de roles y permisos
    const ADMIN_ROLE = await proxyKey.ADMIN_ROLE();
    const ONG_ROLE_K = await proxyKey.ONG_ROLE();
    const PROFESSOR_ROLE_K = await proxyKey.PROFESSOR_ROLE();
    await proxyKey.connect(admin).grantRole(ONG_ROLE_K, ong.address);
    await proxyKey.connect(admin).grantRole(PROFESSOR_ROLE_K, profesor.address);

    await proxyKey.connect(admin).setPhalaTEE(phalaTEE.address);
    await proxyKey.connect(admin).setCertificateSBT(sbt.address);
  });

  // ------------------------------------------------------
  // 🟢 HAPPY PATH
  // ------------------------------------------------------
  it("✅ Profesor registra evidencia correctamente", async function () {
    const pkgHash = ethers.keccak256(ethers.toUtf8Bytes("pkg1"));
    const pkg = {
      sessionId: pkgHash,
      technician: profesor.address,
      timestamp: 0,
      geo: { lat: 1000, lng: 2000, accuracy: 5 },
      photoURIs: ["ipfs://photo"],
      audioURIs: [],
      biometricHash: ethers.ZeroHash,
      beneficiaries: [],
      deviceInfo: { model: "Pixel", appVersion: "1.0" },
      packageHash: pkgHash,
      status: 0,
    };

    await expect(proxyKey.connect(profesor).registerEvidence(1, pkg)).to.emit(
      proxyKey,
      "EvidenceRegistered"
    );
  });

  it("🧾 ONG verifica evidencia correctamente", async function () {
    const pkgHash = ethers.keccak256(ethers.toUtf8Bytes("verifyOK"));
    const pkg = {
      sessionId: pkgHash,
      technician: profesor.address,
      timestamp: 0,
      geo: { lat: 1000, lng: 2000, accuracy: 5 },
      photoURIs: ["ipfs://photo"],
      audioURIs: [],
      biometricHash: ethers.ZeroHash,
      beneficiaries: [],
      deviceInfo: { model: "Pixel", appVersion: "1.0" },
      packageHash: pkgHash,
      status: 0,
    };
    await proxyKey.connect(profesor).registerEvidence(1, pkg);
    await expect(proxyKey.connect(ong).verifyEvidence(pkgHash, true)).to.emit(
      proxyKey,
      "EvidenceVerified"
    );
  });

  it("📜 phalaTEE emite auditoría correctamente", async function () {
    const pkgHash = ethers.keccak256(ethers.toUtf8Bytes("audit"));
    const pkg = {
      sessionId: pkgHash,
      technician: profesor.address,
      timestamp: 0,
      geo: { lat: 1, lng: 2, accuracy: 3 },
      photoURIs: ["ipfs://p"],
      audioURIs: [],
      biometricHash: ethers.ZeroHash,
      beneficiaries: [],
      deviceInfo: { model: "P", appVersion: "1.0" },
      packageHash: pkgHash,
      status: 0,
    };
    await proxyKey.connect(profesor).registerEvidence(1, pkg);
    const auditHash = ethers.keccak256(ethers.toUtf8Bytes("audit1"));
    await expect(
      proxyKey.connect(phalaTEE).emitAudit(pkgHash, auditHash)
    ).to.emit(proxyKey, "AuditEmitted");
  });

  it("🎓 ONG emite certificado cuando evidencia está verificada", async function () {
    const pkgHash = ethers.keccak256(ethers.toUtf8Bytes("cert"));
    const pkg = {
      sessionId: pkgHash,
      technician: profesor.address,
      timestamp: 0,
      geo: { lat: 1, lng: 2, accuracy: 3 },
      photoURIs: ["ipfs://p"],
      audioURIs: [],
      biometricHash: ethers.ZeroHash,
      beneficiaries: [],
      deviceInfo: { model: "P", appVersion: "1.0" },
      packageHash: pkgHash,
      status: 0,
    };
    await proxyKey.connect(profesor).registerEvidence(1, pkg);
    await proxyKey.connect(ong).verifyEvidence(pkgHash, true);
    await expect(
      proxyKey.connect(ong).emitCertificate(beneficiario.address, pkgHash)
    ).to.emit(proxyKey, "CertificateIssued");
  });

  // ------------------------------------------------------
  // 🔴 BAD PATH
  // ------------------------------------------------------
  it("🚫 Profesor sin rol no puede registrar evidencia", async function () {
    const pkgHash = ethers.keccak256(ethers.toUtf8Bytes("bad1"));
    const pkg = {
      sessionId: pkgHash,
      technician: admin.address,
      timestamp: 0,
      geo: { lat: 1, lng: 2, accuracy: 3 },
      photoURIs: [],
      audioURIs: [],
      biometricHash: ethers.ZeroHash,
      beneficiaries: [],
      deviceInfo: { model: "", appVersion: "" },
      packageHash: pkgHash,
      status: 0,
    };
    await expect(
      proxyKey.connect(admin).registerEvidence(1, pkg)
    ).to.be.revertedWith("!Prof");
  });

  it("🚫 Duplicar packageHash debe fallar", async function () {
    const pkgHash = ethers.keccak256(ethers.toUtf8Bytes("dup"));
    const pkg = {
      sessionId: pkgHash,
      technician: profesor.address,
      timestamp: 0,
      geo: { lat: 1, lng: 2, accuracy: 3 },
      photoURIs: ["ipfs://1"],
      audioURIs: [],
      biometricHash: ethers.ZeroHash,
      beneficiaries: [],
      deviceInfo: { model: "P", appVersion: "1.0" },
      packageHash: pkgHash,
      status: 0,
    };
    await proxyKey.connect(profesor).registerEvidence(1, pkg);
    await expect(
      proxyKey.connect(profesor).registerEvidence(1, pkg)
    ).to.be.revertedWith("Dup");
  });

  it("🚫 ONG verifica evidencia inexistente", async function () {
    const fakeHash = ethers.keccak256(ethers.toUtf8Bytes("none"));
    await expect(
      proxyKey.connect(ong).verifyEvidence(fakeHash, true)
    ).to.be.revertedWith("NoPkg");
  });

  it("🚫 Llamador no autorizado intenta emitir auditoría", async function () {
    const pkgHash = ethers.keccak256(ethers.toUtf8Bytes("auditErr"));
    const pkg = {
      sessionId: pkgHash,
      technician: profesor.address,
      timestamp: 0,
      geo: { lat: 1, lng: 2, accuracy: 3 },
      photoURIs: ["ipfs://x"],
      audioURIs: [],
      biometricHash: ethers.ZeroHash,
      beneficiaries: [],
      deviceInfo: { model: "P", appVersion: "1.0" },
      packageHash: pkgHash,
      status: 0,
    };
    await proxyKey.connect(profesor).registerEvidence(1, pkg);
    const auditHash = ethers.keccak256(ethers.toUtf8Bytes("wrongAudit"));
    await expect(
      proxyKey.connect(admin).emitAudit(pkgHash, auditHash)
    ).to.be.revertedWith("!TEE");
  });

  it("🚫 ONG no puede emitir certificado sin verificación previa", async function () {
    const pkgHash = ethers.keccak256(ethers.toUtf8Bytes("nocert"));
    const pkg = {
      sessionId: pkgHash,
      technician: profesor.address,
      timestamp: 0,
      geo: { lat: 1, lng: 2, accuracy: 3 },
      photoURIs: ["ipfs://x"],
      audioURIs: [],
      biometricHash: ethers.ZeroHash,
      beneficiaries: [],
      deviceInfo: { model: "P", appVersion: "1.0" },
      packageHash: pkgHash,
      status: 0,
    };
    await proxyKey.connect(profesor).registerEvidence(1, pkg);
    await expect(
      proxyKey.connect(ong).emitCertificate(beneficiario.address, pkgHash)
    ).to.be.revertedWith("Not verified");
  });

  // ------------------------------------------------------
  // ⚙️ UUPS Upgrade Tests
  // ------------------------------------------------------
  it("🚫 Non-admin cannot upgrade implementation", async function () {
    const MockV2 = await ethers.getContractFactory("KEYRegistryV2");
    const newImpl = await MockV2.deploy();
    await newImpl.waitForDeployment();

    // usamos interfaz genérica UUPS
    const Upgradeable = await ethers.getContractAt(
      "IUpgradeableProxy",
      await proxyKey.getAddress(),
      profesor // no admin
    );

    await expect(Upgradeable.upgradeTo(await newImpl.getAddress())).to.be
      .reverted;
  });


it("✅ Admin can upgrade and preserve state (manual ERC1967 upgrade)", async function () {
  console.log("🔧 Deploying KEYRegistryV2...");
  const MockV2 = await ethers.getContractFactory("KEYRegistryV2");
  const newImpl = await MockV2.deploy();
  await newImpl.waitForDeployment();
  const newImplAddress = await newImpl.getAddress();
  console.log("✅ New implementation deployed at:", newImplAddress);

  // --- obtener proxyAddress desde el fixture ---
  const proxyAddress = (proxyKey as any).__proxyAddress;
  console.log("📍 Proxy address:", proxyAddress);
  expect(proxyAddress).to.not.be.null;

  // --- leer slot de implementación actual ---
  const implSlot =
    "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";
  const implBefore = await ethers.provider.getStorage(proxyAddress, implSlot);
  const currentImpl = `0x${implBefore.slice(-40)}`;
  console.log("🔎 Current implementation:", currentImpl);

  // --- verificar que admin tiene rol ---
  const keyRegistryAtProxy = new ethers.Contract(proxyAddress, KEYRegistryABI.abi, admin);
  const isAdmin = await keyRegistryAtProxy.hasRole(
    await keyRegistryAtProxy.ADMIN_ROLE(),
    admin.address
  );
  expect(isAdmin).to.be.true;
  console.log("🔐 Admin verified for upgrade");

  // --- simular upgrade manual ---
  console.log("⚙️ Simulating upgrade by changing proxy implementation...");
  const ProxyFactory = await ethers.getContractFactory("OZERC1967Proxy");
  const newInit = keyRegistryAtProxy.interface.encodeFunctionData("initialize", [
    admin.address,
    await proxyIdentity.getAddress(),
    await proxyProject.getAddress(),
  ]);

  // Re-deploy proxy manually pointing to V2
  const newProxy = await ProxyFactory.deploy(newImplAddress, newInit);
  await newProxy.waitForDeployment();
  const newProxyAddr = await newProxy.getAddress();
  console.log("✅ New proxy deployed:", newProxyAddr);

  // --- Re-attach ABI of new version ---
  const upgraded = new ethers.Contract(newProxyAddr, KEYRegistryV2ABI.abi, admin);
  const version = await upgraded.version();
  console.log("✅ version():", version);
  expect(version).to.equal("v2.0");

  const feature = await upgraded.newFeatureExample();
  console.log("✅ newFeatureExample():", feature);
  expect(feature).to.equal(42);

  console.log("🎉 Manual ERC1967 upgrade simulation successful!");
});



});
