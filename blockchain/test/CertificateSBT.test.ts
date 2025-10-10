import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

describe("🧱 CertificateSBT (Upgradeable, SoulBound)", function () {
  let CertificateSBT: any;
  let ProxyFactory: any;
  let sbt: Contract;
  let admin: any, ong: any, otherONG: any, beneficiary: any, stranger: any;

  beforeEach(async function () {
    [admin, ong, otherONG, beneficiary, stranger] = await ethers.getSigners();

    CertificateSBT = await ethers.getContractFactory("CertificateSBT");
    const logic = await CertificateSBT.deploy();
    await logic.waitForDeployment();

    ProxyFactory = await ethers.getContractFactory("OZERC1967Proxy");
    const initData = CertificateSBT.interface.encodeFunctionData("initialize", [
      admin.address,
    ]);

    const proxyInstance = await ProxyFactory.deploy(
      await logic.getAddress(),
      initData
    );
    await proxyInstance.waitForDeployment();

    sbt = CertificateSBT.attach(await proxyInstance.getAddress());

    // ✅ Setup roles
    await sbt.connect(admin).grantRole(await sbt.ONG_ROLE(), ong.address);
    await sbt.connect(admin).grantRole(await sbt.ONG_ROLE(), otherONG.address);
  });

  // ----------------------------------------------------------
  // ✅ HAPPY PATH
  // ----------------------------------------------------------

  it("✅ mintSBT: ONG válida emite certificado único", async function () {
    const packageHash = ethers.keccak256(ethers.toUtf8Bytes("pkg1"));
    const tx = await sbt
      .connect(ong)
      .mintSBT(beneficiary.address, packageHash, "ipfs://meta1");

    const receipt = await tx.wait();
    const event = receipt.logs.find(
      (log: any) => log.fragment?.name === "CertificateMinted"
    );

    const tokenId = await sbt.packageHashToTokenId(packageHash);
    expect(tokenId).to.equal(1n);
    expect(event).to.not.be.undefined;

    const owner = await sbt.ownerOf(tokenId);
    expect(owner).to.equal(beneficiary.address);
  });

  it("✅ getCertificate: devuelve datos correctos", async function () {
    const packageHash = ethers.keccak256(ethers.toUtf8Bytes("pkg2"));
    await sbt
      .connect(ong)
      .mintSBT(beneficiary.address, packageHash, "ipfs://meta2");

    const tokenId = await sbt.packageHashToTokenId(packageHash);
    const cert = await sbt.getCertificate(tokenId);

    expect(cert.owner).to.equal(beneficiary.address);
    expect(cert.issuer).to.equal(ong.address);
    expect(cert.metadata).to.equal("ipfs://meta2");
    expect(cert.isRevoked).to.be.false;
  });

  it("✅ revokeCertificate: ONG emisora revoca correctamente", async function () {
    const packageHash = ethers.keccak256(ethers.toUtf8Bytes("pkg3"));
    await sbt
      .connect(ong)
      .mintSBT(beneficiary.address, packageHash, "ipfs://meta3");

    const tokenId = await sbt.packageHashToTokenId(packageHash);

    await expect(sbt.connect(ong).revokeCertificate(tokenId, "error datos"))
      .to.emit(sbt, "CertificateRevoked");
  });

  it("✅ getCertificatesByOwner: lista tokens del beneficiario", async function () {
    const pkgA = ethers.keccak256(ethers.toUtf8Bytes("pkgA"));
    const pkgB = ethers.keccak256(ethers.toUtf8Bytes("pkgB"));

    await sbt.connect(ong).mintSBT(beneficiary.address, pkgA, "ipfs://metaA");
    await sbt.connect(ong).mintSBT(beneficiary.address, pkgB, "ipfs://metaB");

    const list = await sbt.getCertificatesByOwner(beneficiary.address);
    expect(list.length).to.equal(2);
  });

  it("✅ Transferencia bloqueada: mint/burn permitidos, transferencias no", async function () {
    const pkg = ethers.keccak256(ethers.toUtf8Bytes("pkgX"));
    await sbt.connect(ong).mintSBT(beneficiary.address, pkg, "ipfs://metaX");

    const tokenId = await sbt.packageHashToTokenId(pkg);
    await expect(
      sbt
        .connect(beneficiary)
        .transferFrom(beneficiary.address, stranger.address, tokenId)
    ).to.be.revertedWith("SBT: non-transferable");
  });

  it("✅ Upgrade autorizado por ADMIN_ROLE (manual)", async function () {
    const SBTv2 = await ethers.getContractFactory("CertificateSBT");
    const newImpl = await SBTv2.deploy();
    await newImpl.waitForDeployment();

    await expect(
      sbt.connect(admin).upgradeTo(await newImpl.getAddress())
    ).to.not.be.reverted;

    const upgraded = SBTv2.attach(await sbt.getAddress());
    expect(await upgraded.hasRole(await upgraded.ADMIN_ROLE(), admin.address)).to.be.true;
  });

  // ----------------------------------------------------------
  // 🚫 BAD PATH
  // ----------------------------------------------------------

  it("🚫 mintSBT: falla si packageHash ya existe", async function () {
    const pkg = ethers.keccak256(ethers.toUtf8Bytes("dup"));
    await sbt.connect(ong).mintSBT(beneficiary.address, pkg, "ipfs://meta");
    await expect(
      sbt.connect(ong).mintSBT(beneficiary.address, pkg, "ipfs://meta")
    ).to.be.revertedWith("SBT: already issued");
  });

  it("🚫 revokeCertificate: falla si ONG no es emisora", async function () {
    const pkg = ethers.keccak256(ethers.toUtf8Bytes("pkgX"));
    await sbt.connect(ong).mintSBT(beneficiary.address, pkg, "ipfs://meta");
    const tokenId = await sbt.packageHashToTokenId(pkg);

    await expect(
      sbt.connect(otherONG).revokeCertificate(tokenId, "no autorizado")
    ).to.be.revertedWith("SBT: not issuer");
  });

  it("🚫 revokeCertificate: falla si ya está revocado", async function () {
    const pkg = ethers.keccak256(ethers.toUtf8Bytes("pkgY"));
    await sbt.connect(ong).mintSBT(beneficiary.address, pkg, "ipfs://meta");
    const tokenId = await sbt.packageHashToTokenId(pkg);
    await sbt.connect(ong).revokeCertificate(tokenId, "rev1");

    await expect(
      sbt.connect(ong).revokeCertificate(tokenId, "rev2")
    ).to.be.revertedWith("SBT: already revoked");
  });

  it("🚫 getCertificate: falla si tokenId no existe", async function () {
    await expect(sbt.getCertificate(9999)).to.be.revertedWith(
      "SBT: invalid token"
    );
  });

  it("🚫 Transferencia: falla si se intenta transferir entre cuentas", async function () {
    const pkg = ethers.keccak256(ethers.toUtf8Bytes("pkgZ"));
    await sbt.connect(ong).mintSBT(beneficiary.address, pkg, "ipfs://meta");
    const tokenId = await sbt.packageHashToTokenId(pkg);

    await expect(
      sbt
        .connect(beneficiary)
        .transferFrom(beneficiary.address, stranger.address, tokenId)
    ).to.be.revertedWith("SBT: non-transferable");
  });

  it("🚫 Upgrade: falla si no tiene ADMIN_ROLE", async function () {
    const SBTv2 = await ethers.getContractFactory("CertificateSBT");
    const newImpl = await SBTv2.deploy();
    await newImpl.waitForDeployment();

    await expect(
      sbt.connect(stranger).upgradeTo(await newImpl.getAddress())
    ).to.be.revertedWith(/AccessControl: account .* is missing role/);
  });
});
