// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "./LibraryStructs.sol";
import "./IdentityRegistry.sol";
import "./ProjectRegistry.sol";

/// @title KEYRegistry (UUPSUpgradeable)
/// @notice Registro on-chain de evidencias MRV (Monitoreo, Reporte y Verificación)
/// @dev Compatible con ERC1967Proxy, diseñado igual que IdentityRegistry.
contract KEYRegistry is
    Initializable,
    AccessControlUpgradeable,
    UUPSUpgradeable,
    ReentrancyGuardUpgradeable
{
    using LibraryStructs for *;

    // --- Roles ---
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant ONG_ROLE = keccak256("ONG_ROLE");
    bytes32 public constant PROFESSOR_ROLE = keccak256("PROFESSOR_ROLE");

    // --- Dependencias ---
    IdentityRegistry public identityRegistry;
    ProjectRegistry public projectRegistry;
    address public certificateSBT;
    address public phalaTEE;

    // --- Almacenamiento ---
    mapping(bytes32 => LibraryStructs.EvidencePackage) public evidences;
    mapping(bytes32 => LibraryStructs.AuditRecord[]) public audits;

    // --- Eventos ---
    event EvidenceRegistered(bytes32 indexed packageHash, address indexed technician, uint256 timestamp);
    event EvidenceVerified(bytes32 indexed packageHash, bool isValid, address indexed verifier);
    event AuditEmitted(bytes32 indexed packageHash, bytes32 auditHash, uint256 timestamp);
    event CertificateIssued(address indexed beneficiary, bytes32 indexed packageHash);

    // --- Inicializador ---
    function initialize(
        address _admin,
        address payable _identityRegistry,
        address _projectRegistry
    ) public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);

        identityRegistry = IdentityRegistry(_identityRegistry);
        projectRegistry = ProjectRegistry(_projectRegistry);
    }

    // --- Autorización de upgrade (UUPS) ---
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(ADMIN_ROLE)
    {}

    // --- Configuración ---
    function setCertificateSBT(address _sbt) external onlyRole(ADMIN_ROLE) {
        certificateSBT = _sbt;
    }

    function setPhalaTEE(address _phalaTEE) external onlyRole(ADMIN_ROLE) {
        phalaTEE = _phalaTEE;
    }

    // --- Registro de evidencia ---
    function registerEvidence(
        uint256 activityId,
        LibraryStructs.EvidencePackage calldata data
    ) external nonReentrant {
        require(identityRegistry.hasRole(PROFESSOR_ROLE, msg.sender), "!Prof");
        require(evidences[data.packageHash].timestamp == 0, "Dup");
        require(projectRegistry.getActivityId(activityId) != 0, "InvalidActivity");

        evidences[data.packageHash] = LibraryStructs.EvidencePackage({
            sessionId: data.sessionId,
            technician: msg.sender,
            timestamp: block.timestamp,
            geo: data.geo,
            photoURIs: data.photoURIs,
            audioURIs: data.audioURIs,
            biometricHash: data.biometricHash,
            beneficiaries: data.beneficiaries,
            deviceInfo: data.deviceInfo,
            packageHash: data.packageHash,
            status: LibraryStructs.EvidenceStatus.PENDING
        });

        emit EvidenceRegistered(data.packageHash, msg.sender, block.timestamp);
        projectRegistry.linkEvidence(activityId, data.packageHash);
    }

    // --- Verificación de ONG ---
    function verifyEvidence(bytes32 packageHash, bool isValid)
        external
        onlyRole(ONG_ROLE)
    {
        LibraryStructs.EvidencePackage storage pkg = evidences[packageHash];
        require(pkg.timestamp != 0, "NoPkg");

        pkg.status = isValid
            ? LibraryStructs.EvidenceStatus.VERIFIED
            : LibraryStructs.EvidenceStatus.REJECTED;

        emit EvidenceVerified(packageHash, isValid, msg.sender);
    }

    // --- Emisión de auditoría desde PhalaTEE ---
    function emitAudit(bytes32 packageHash, bytes32 auditHash) external {
        require(msg.sender == phalaTEE, "!TEE");
        require(evidences[packageHash].timestamp != 0, "NoPkg");

        audits[packageHash].push(
            LibraryStructs.AuditRecord({
                packageHash: packageHash,
                auditHash: auditHash,
                status: LibraryStructs.AuditStatus.COMPLETED,
                timestamp: block.timestamp,
                comments: "Validated by PhalaTEE"
            })
        );

        emit AuditEmitted(packageHash, auditHash, block.timestamp);
    }

    // --- Emisión de certificado ---
    function emitCertificate(address beneficiary, bytes32 packageHash)
        external
        onlyRole(ONG_ROLE)
    {
        require(
            evidences[packageHash].status ==
                LibraryStructs.EvidenceStatus.VERIFIED,
            "Not verified"
        );
        require(certificateSBT != address(0), "SBT not set");

        emit CertificateIssued(beneficiary, packageHash);
    }
}
