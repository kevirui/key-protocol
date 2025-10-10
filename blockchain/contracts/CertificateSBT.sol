// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

/**
 * @title CertificateSBT
 * @notice SBT (SoulBound Token) emitido por ONG tras verificación de evidencias.
 * @dev No transferible, upgradeable y compatible con KEYRegistry (OZ 4.9.6)
 */
contract CertificateSBT is
    ERC721URIStorageUpgradeable,
    AccessControlUpgradeable,
    UUPSUpgradeable,
    ReentrancyGuardUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;

    // --- Roles ---
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant ONG_ROLE = keccak256("ONG_ROLE");

    // --- Estado ---
    CountersUpgradeable.Counter private _tokenIdCounter;
    mapping(bytes32 => uint256) public packageHashToTokenId;
    mapping(uint256 => bool) public revoked;
    mapping(uint256 => string) public revokeReason;
    mapping(uint256 => address) public issuerONG; // ONG que emitió el certificado

    // --- Eventos ---
    event CertificateMinted(
        uint256 indexed tokenId,
        address indexed beneficiary,
        bytes32 indexed packageHash,
        address issuer,
        uint256 timestamp
    );

    event CertificateRevoked(
        uint256 indexed tokenId,
        string reason,
        uint256 timestamp
    );

    // --- Inicializador ---
    function initialize(address admin) public initializer {
        __ERC721_init("KEY Certificate", "KEYSBT");
        __ERC721URIStorage_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }

    // --- Autorización de upgrade ---
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(ADMIN_ROLE)
    {}

    // --- Hook: impedir transferencias (SBT no transferible) ---
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        // Solo permitir mint (from == 0) o burn (to == 0)
        if (from != address(0) && to != address(0)) {
            revert("SBT: non-transferable");
        }
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    // --- Emisión de certificado ---
    function mintSBT(
        address beneficiary,
        bytes32 packageHash,
        string memory metadataURI
    ) external onlyRole(ONG_ROLE) nonReentrant returns (uint256) {
        require(packageHashToTokenId[packageHash] == 0, "SBT: already issued");

        _tokenIdCounter.increment();
        uint256 newTokenId = _tokenIdCounter.current();

        _safeMint(beneficiary, newTokenId);
        _setTokenURI(newTokenId, metadataURI);

        packageHashToTokenId[packageHash] = newTokenId;
        issuerONG[newTokenId] = msg.sender;

        emit CertificateMinted(
            newTokenId,
            beneficiary,
            packageHash,
            msg.sender,
            block.timestamp
        );

        return newTokenId;
    }

    // --- Revocación de certificado ---
    function revokeCertificate(uint256 tokenId, string memory reason)
        external
        onlyRole(ONG_ROLE)
    {
        require(_exists(tokenId), "SBT: invalid token");
        require(!revoked[tokenId], "SBT: already revoked");
        require(issuerONG[tokenId] == msg.sender, "SBT: not issuer");

        revoked[tokenId] = true;
        revokeReason[tokenId] = reason;

        emit CertificateRevoked(tokenId, reason, block.timestamp);
    }

    // --- Consulta pública de certificado ---
    function getCertificate(uint256 tokenId)
        external
        view
        returns (
            address owner,
            address issuer,
            string memory metadata,
            bool isRevoked,
            string memory reason,
            uint256 timestamp
        )
    {
        require(_exists(tokenId), "SBT: invalid token");
        owner = ownerOf(tokenId);
        issuer = issuerONG[tokenId];
        metadata = tokenURI(tokenId);
        isRevoked = revoked[tokenId];
        reason = revokeReason[tokenId];
        timestamp = block.timestamp; // útil para logs o auditoría off-chain
    }

    // --- Consulta pública: certificados por beneficiario ---
    function getCertificatesByOwner(address owner)
        external
        view
        returns (uint256[] memory tokenIds)
    {
        uint256 total = _tokenIdCounter.current();
        uint256 count;
        uint256 idx;

        for (uint256 i = 1; i <= total; i++) {
            if (_exists(i) && ownerOf(i) == owner) {
                count++;
            }
        }

        tokenIds = new uint256[](count);
        for (uint256 i = 1; i <= total; i++) {
            if (_exists(i) && ownerOf(i) == owner) {
                tokenIds[idx++] = i;
            }
        }
    }

    // --- Overrides requeridos por herencia múltiple ---
    function _burn(uint256 tokenId)
        internal
        override(ERC721URIStorageUpgradeable)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorageUpgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
