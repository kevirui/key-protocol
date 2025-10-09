import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

describe("🧱 IdentityRegistry (ERC1967Proxy manual)", function () {
  let IdentityRegistry: any;
  let ProxyFactory: any;
  let proxy: Contract;
  let logic: Contract;
  let admin: any, ong: any, profesor: any, inversor: any, beneficiario: any;

  beforeEach(async function () {
    [admin, ong, profesor, inversor, beneficiario] = await ethers.getSigners();

    IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
    logic = await IdentityRegistry.deploy();
    await logic.waitForDeployment();

    ProxyFactory = await ethers.getContractFactory("OZERC1967Proxy");
    const feeCollector = admin.address;
    const registrationFee = ethers.parseEther("0.01");

    const initData = logic.interface.encodeFunctionData("initialize", [
      admin.address,
      feeCollector,
      registrationFee,
    ]);

    const proxyInstance = await ProxyFactory.deploy(
      await logic.getAddress(),
      initData
    );
    await proxyInstance.waitForDeployment();

    proxy = IdentityRegistry.attach(await proxyInstance.getAddress());
  });

  // ✅ TESTS POSITIVOS

  it("✅ inicializa correctamente con rol de admin", async function () {
    const hasAdmin = await proxy.hasRole(
      await proxy.DEFAULT_ADMIN_ROLE(),
      admin.address
    );
    expect(hasAdmin).to.be.true;

    const fee = await proxy.registrationFee();
    expect(fee).to.equal(ethers.parseEther("0.01"));
  });

  it("🟢 ONG puede solicitar registro", async function () {
    const ongData = {
      wallet: ong.address,
      name: "ONG Verde",
      country: "CO",
      description: "ONG dedicada al ambiente",
      metadataURI: "ipfs://ong-metadata",
      didHash: ethers.ZeroHash,
      verified: false,
    };

    await expect(
      proxy.connect(ong).requestRegistrationONG(ongData, {
        value: ethers.parseEther("0.01"),
      })
    )
      .to.emit(proxy, "ONGRegistrationRequested")
      .withArgs(ong.address, "ONG Verde");
  });

  it("🟢 Admin aprueba ONG y se le asigna el rol", async function () {
    const ongData = {
      wallet: ong.address,
      name: "ONG Verde",
      country: "CO",
      description: "ONG dedicada al ambiente",
      metadataURI: "ipfs://ong-metadata",
      didHash: ethers.ZeroHash,
      verified: false,
    };

    await proxy
      .connect(ong)
      .requestRegistrationONG(ongData, { value: ethers.parseEther("0.01") });

    await expect(proxy.connect(admin).approveONG(ong.address))
      .to.emit(proxy, "IdentityRegistered")
      .withArgs(ong.address, "ONG", "ONG Verde");

    const hasRole = await proxy.hasRole(await proxy.ONG_ROLE(), ong.address);
    expect(hasRole).to.be.true;
  });

  it("🧑‍🏫 ONG puede registrar un profesor tras ser aprobada", async function () {
    const ongData = {
      wallet: ong.address,
      name: "ONG Verde",
      country: "CO",
      description: "ONG dedicada al ambiente",
      metadataURI: "ipfs://ong-metadata",
      didHash: ethers.ZeroHash,
      verified: false,
    };
    await proxy
      .connect(ong)
      .requestRegistrationONG(ongData, { value: ethers.parseEther("0.01") });
    await proxy.connect(admin).approveONG(ong.address);

    const profData = {
      wallet: profesor.address,
      name: "Juan Profesor",
      specialty: "Agrotech",
      metadataURI: "ipfs://profesor-metadata",
      didHash: ethers.ZeroHash,
      associatedONGs: [],
      active: true,
    };

    await expect(
      proxy.connect(ong).registerProfessor(profesor.address, profData)
    )
      .to.emit(proxy, "IdentityRegistered")
      .withArgs(profesor.address, "PROFESSOR", "Juan Profesor");
  });

  it("💰 Admin puede registrar inversor", async function () {
    const invData = {
      wallet: inversor.address,
      name: "ImpactX",
      organization: "ImpactFund",
      totalInvested: ethers.parseEther("1000"),
      metadataURI: "ipfs://investor-meta",
      didHash: ethers.ZeroHash,
    };

    await expect(
      proxy.connect(admin).registerInvestor(inversor.address, invData)
    )
      .to.emit(proxy, "IdentityRegistered")
      .withArgs(inversor.address, "INVESTOR", "ImpactX");
  });

  it("🧍 ONG puede registrar beneficiario", async function () {
    const ongData = {
      wallet: ong.address,
      name: "ONG Verde",
      country: "CO",
      description: "ONG dedicada al ambiente",
      metadataURI: "ipfs://ong-metadata",
      didHash: ethers.ZeroHash,
      verified: false,
    };
    await proxy
      .connect(ong)
      .requestRegistrationONG(ongData, { value: ethers.parseEther("0.01") });
    await proxy.connect(admin).approveONG(ong.address);

    const benData = {
      didHash: ethers.ZeroHash,
      community: "Comunidad Andina",
      metadataURI: "ipfs://beneficiario-meta",
      active: true,
    };

    await expect(
      proxy.connect(ong).registerBeneficiary(beneficiario.address, benData)
    )
      .to.emit(proxy, "IdentityRegistered")
      .withArgs(beneficiario.address, "BENEFICIARY", "Comunidad Andina");
  });

  it("🧩 Profesor puede unirse a ONG", async function () {
    const ongData = {
      wallet: ong.address,
      name: "ONG Verde",
      country: "CO",
      description: "ONG dedicada al ambiente",
      metadataURI: "ipfs://ong-metadata",
      didHash: ethers.ZeroHash,
      verified: false,
    };
    await proxy
      .connect(ong)
      .requestRegistrationONG(ongData, { value: ethers.parseEther("0.01") });
    await proxy.connect(admin).approveONG(ong.address);

    const profData = {
      wallet: profesor.address,
      name: "Juan Profesor",
      specialty: "Agrotech",
      metadataURI: "ipfs://profesor-metadata",
      didHash: ethers.ZeroHash,
      associatedONGs: [],
      active: true,
    };
    await proxy.connect(ong).registerProfessor(profesor.address, profData);

    await expect(proxy.connect(profesor).joinONG(ong.address))
      .to.emit(proxy, "ONGAssociated")
      .withArgs(profesor.address, ong.address);
  });

  // 🚫 TESTS NEGATIVOS

  it("🚫 Rechaza aprobación de ONG por cuenta sin rol admin", async function () {
    const ongData = {
      wallet: ong.address,
      name: "ONG Test",
      country: "PE",
      description: "ONG de prueba",
      metadataURI: "ipfs://ong-meta",
      didHash: ethers.ZeroHash,
      verified: false,
    };
    await proxy
      .connect(ong)
      .requestRegistrationONG(ongData, { value: ethers.parseEther("0.01") });

    await expect(
      proxy.connect(inversor).approveONG(ong.address)
    ).to.be.revertedWithCustomError(proxy, "AccessControlUnauthorizedAccount");
  });

  it("🚫 ONG no aprobada no puede registrar profesor", async function () {
    const profData = {
      wallet: profesor.address,
      name: "Juan Profesor",
      specialty: "Agrotech",
      metadataURI: "ipfs://profesor-metadata",
      didHash: ethers.ZeroHash,
      associatedONGs: [],
      active: true,
    };

    await expect(
      proxy.connect(ong).registerProfessor(profesor.address, profData)
    ).to.be.revertedWithCustomError(proxy, "AccessControlUnauthorizedAccount");
  });

  it("🚫 ONG no aprobada no puede registrar beneficiario", async function () {
    const benData = {
      didHash: ethers.ZeroHash,
      community: "Comunidad Andina",
      metadataURI: "ipfs://beneficiario-meta",
      active: true,
    };

    await expect(
      proxy.connect(ong).registerBeneficiary(beneficiario.address, benData)
    ).to.be.revertedWithCustomError(proxy, "AccessControlUnauthorizedAccount");
  });

  it("🚫 Profesor no puede unirse a ONG no verificada", async function () {
    const ongData = {
      wallet: ong.address,
      name: "ONG Verde",
      country: "CO",
      description: "ONG dedicada al ambiente",
      metadataURI: "ipfs://ong-metadata",
      didHash: ethers.ZeroHash,
      verified: false,
    };
    await proxy
      .connect(ong)
      .requestRegistrationONG(ongData, { value: ethers.parseEther("0.01") });
    // ❌ No se aprueba la ONG → sigue sin estar verificada

    const profData = {
      wallet: profesor.address,
      name: "Juan Profesor",
      specialty: "Agrotech",
      metadataURI: "ipfs://profesor-metadata",
      didHash: ethers.ZeroHash,
      associatedONGs: [],
      active: true,
    };
    await proxy.connect(admin).grantRole(await proxy.ONG_ROLE(), ong.address); // ONG necesita rol para registrar
    await proxy.connect(ong).registerProfessor(profesor.address, profData); // ✅ profesor registrado

    await expect(
      proxy.connect(profesor).joinONG(ong.address)
    ).to.be.revertedWith("ONG not verified");
  });
});

