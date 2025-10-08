// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title LibraryStructs
 * @notice Define enums, structs y tipos base compartidos por todos los contratos KEY Protocol.
 * @dev Diseñado para Astar / Paseo EVM (testnet). Versión 1.0 — LatinHack 2025.
 */
library LibraryStructs {

    // ------------------------------------------------------------
    // ENUMS
    // ------------------------------------------------------------

    enum RoleType {
        ADMIN,
        ONG,
        PROFESSOR,
        INVESTOR,
        BENEFICIARY,
        AUDITOR
    }

    enum ActivityType {
        TRAINING,
        DELIVERY,
        WORKSHOP,
        FIELD_VISIT
    }

    enum EvidenceStatus {
        PENDING,
        VERIFIED,
        REJECTED
    }

    enum AuditStatus {
        NOT_STARTED,
        IN_PROGRESS,
        COMPLETED,
        FLAGGED
    }

    // ------------------------------------------------------------
    // CORE STRUCTS
    // ------------------------------------------------------------

    struct GeoLocation {
        int256 lat;         // usar 1e6 para precisión de 6 decimales
        int256 lng;
        uint256 accuracy;   // en metros
    }

    struct DeviceInfo {
        string model;
        string appVersion;
    }

    // ------------------------------------------------------------
    // IDENTITY STRUCTS
    // ------------------------------------------------------------

    struct ONG {
        address wallet;
        string name;
        string country;
        string description;
        string metadataURI;
        bytes32 didHash;     // reservado (por ahora siempre 0x0)
        bool verified;
    }

    struct Profesor {
        address wallet;
        string name;
        string specialty;
        string metadataURI;
        bytes32 didHash;     // reservado (por ahora siempre 0x0)
        address[] associatedONGs;
        bool active;
    }

    struct Inversor {
        address wallet;
        string name;
        string organization;
        uint256 totalInvested;
        string metadataURI;
        bytes32 didHash;     // opcional, reservado (por ahora 0x0)
    }

    struct Beneficiario {
        bytes32 didHash;     // reservado (por ahora siempre 0x0)
        string community;
        string metadataURI;
        bool active;
    }

    // ------------------------------------------------------------
    // PROJECT STRUCTS
    // ------------------------------------------------------------

    struct Proyecto {
        uint256 id;
        address ongAddress;
        string name;
        string description;
        uint256 startDate;
        uint256 endDate;
        uint256 totalBudget;
        uint256 fundsUsed;
        string metadataURI;
        bool active;
    }

    struct Actividad {
        uint256 id;
        uint256 projectId;
        ActivityType activityType;
        string title;
        string description;
        uint256 scheduledDate;
        uint256 completedDate;
        address assignedProfessor;
        string metadataURI;
        bool completed;
    }

    // ------------------------------------------------------------
    // MRV STRUCTS
    // ------------------------------------------------------------

    struct EvidencePackage {
        bytes32 sessionId;        // UUID o hash
        address technician;       // dirección firmante
        uint256 timestamp;        // block.timestamp
        GeoLocation geo;
        string[] photoURIs;       // IPFS / Arweave links
        string[] audioURIs;
        bytes32 biometricHash;    // hash seguro
        bytes32[] beneficiaries;  // hashed IDs
        DeviceInfo deviceInfo;
        bytes32 packageHash;      // Merkle root del paquete completo
        EvidenceStatus status;
    }

    struct AuditRecord {
        bytes32 packageHash;
        bytes32 auditHash;
        AuditStatus status;
        uint256 timestamp;
        string comments;
    }

    // ------------------------------------------------------------
    // CERTIFICATE STRUCTS
    // ------------------------------------------------------------

    struct Certificate {
        uint256 id;
        address issuedTo;
        uint256 activityId;
        uint256 projectId;
        uint256 issuedAt;
        string metadataURI;       // enlace a la metadata o evidencia
        bool valid;
    }

    struct RevocationRecord {
        uint256 certificateId;
        uint256 revokedAt;
        string reason;
    }
}

