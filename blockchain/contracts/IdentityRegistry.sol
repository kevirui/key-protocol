// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title IdentityRegistry (UUPSUpgradeable)
 * @notice Gestiona registro, aprobación y roles de identidades en KEY Protocol.
 * @dev Diseñado para Astar/Paseo EVM. Usa patrón UUPSUpgradeable (delegatecall).
 */

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "./LibraryStructs.sol";

contract IdentityRegistry is
    Initializable,
    AccessControlUpgradeable,
    UUPSUpgradeable,
    ReentrancyGuardUpgradeable
{
    using LibraryStructs for *;

    // ------------------------------------------------------------
    // ROLES
    // ------------------------------------------------------------
    bytes32 public constant ONG_ROLE = keccak256("ONG_ROLE");
    bytes32 public constant PROFESSOR_ROLE = keccak256("PROFESSOR_ROLE");
    bytes32 public constant INVESTOR_ROLE = keccak256("INVESTOR_ROLE");
    bytes32 public constant BENEFICIARY_ROLE = keccak256("BENEFICIARY_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");

    // ------------------------------------------------------------
    // STATE
    // ------------------------------------------------------------
    mapping(address => LibraryStructs.ONG) public ongs;
    mapping(address => LibraryStructs.Profesor) public profesores;
    mapping(address => LibraryStructs.Inversor) public inversores;
    mapping(address => LibraryStructs.Beneficiario) public beneficiarios;

    address public feeCollector;
    uint256 public registrationFee;

    // ------------------------------------------------------------
    // EVENTS
    // ------------------------------------------------------------
    event ONGRegistrationRequested(address indexed wallet, string name);
    event IdentityRegistered(address indexed wallet, string role, string name);
    event ONGAssociated(address indexed profesor, address indexed ong);
    event FeeUpdated(uint256 newFee);
    event FeeCollected(address indexed from, uint256 amount);

    // ------------------------------------------------------------
    // INITIALIZER
    // ------------------------------------------------------------
    /// @notice Inicializa el contrato (solo una vez)
    /// @param admin Dirección con rol DEFAULT_ADMIN_ROLE
    /// @param _feeCollector Dirección donde se envían las comisiones
    /// @param _registrationFee Monto de comisión por registro
    function initialize(
        address admin,
        address _feeCollector,
        uint256 _registrationFee
    ) public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        feeCollector = _feeCollector;
        registrationFee = _registrationFee;
    }

    // ------------------------------------------------------------
    // ONG REGISTRATION
    // ------------------------------------------------------------
    function requestRegistrationONG(
        LibraryStructs.ONG memory data
    ) external payable nonReentrant {
        require(msg.value >= registrationFee, "Insufficient fee");
        emit FeeCollected(msg.sender, msg.value);
        payable(feeCollector).transfer(msg.value);

        require(!ongs[msg.sender].verified, "ONG already registered");

        ongs[msg.sender] = LibraryStructs.ONG({
            wallet: msg.sender,
            name: data.name,
            country: data.country,
            description: data.description,
            metadataURI: data.metadataURI,
            didHash: bytes32(0),
            verified: false
        });

        emit ONGRegistrationRequested(msg.sender, data.name);
    }

    function approveONG(address ongWallet) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(!ongs[ongWallet].verified, "Already verified");
        ongs[ongWallet].verified = true;
        _grantRole(ONG_ROLE, ongWallet);
        emit IdentityRegistered(ongWallet, "ONG", ongs[ongWallet].name);
    }

    // ------------------------------------------------------------
    // PROFESSOR / INVESTOR / BENEFICIARY REGISTRATION
    // ------------------------------------------------------------
    function registerProfessor(
        address wallet,
        LibraryStructs.Profesor memory data
    ) external onlyRole(ONG_ROLE) {
        require(wallet != address(0), "Invalid wallet");
        profesores[wallet] = data;
        _grantRole(PROFESSOR_ROLE, wallet);
        emit IdentityRegistered(wallet, "PROFESSOR", data.name);
    }

    function joinONG(address ongAddress) external onlyRole(PROFESSOR_ROLE) {
        require(ongs[ongAddress].verified, "ONG not verified");
        profesores[msg.sender].associatedONGs.push(ongAddress);
        emit ONGAssociated(msg.sender, ongAddress);
    }

    function registerInvestor(
        address wallet,
        LibraryStructs.Inversor memory data
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        inversores[wallet] = data;
        _grantRole(INVESTOR_ROLE, wallet);
        emit IdentityRegistered(wallet, "INVESTOR", data.name);
    }

    function registerBeneficiary(
        address wallet,
        LibraryStructs.Beneficiario memory data
    ) external onlyRole(ONG_ROLE) {
        beneficiarios[wallet] = data;
        _grantRole(BENEFICIARY_ROLE, wallet);
        emit IdentityRegistered(wallet, "BENEFICIARY", data.community);
    }

    // ------------------------------------------------------------
    // ADMIN CONFIG
    // ------------------------------------------------------------
    function setRegistrationFee(uint256 newFee) external onlyRole(DEFAULT_ADMIN_ROLE) {
        registrationFee = newFee;
        emit FeeUpdated(newFee);
    }

    function setFeeCollector(address newCollector) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newCollector != address(0), "Invalid address");
        feeCollector = newCollector;
    }

    // ------------------------------------------------------------
    // VIEW HELPERS
    // ------------------------------------------------------------
    function getONG(address wallet) external view returns (LibraryStructs.ONG memory) {
        return ongs[wallet];
    }

    function getProfessor(address wallet) external view returns (LibraryStructs.Profesor memory) {
        return profesores[wallet];
    }

    function getInvestor(address wallet) external view returns (LibraryStructs.Inversor memory) {
        return inversores[wallet];
    }

    function getBeneficiary(address wallet) external view returns (LibraryStructs.Beneficiario memory) {
        return beneficiarios[wallet];
    }

    // ------------------------------------------------------------
    // UUPS AUTHORIZATION
    // ------------------------------------------------------------
    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}

    // ------------------------------------------------------------
    // RECEIVE / FALLBACK
    // ------------------------------------------------------------
    receive() external payable {}
    fallback() external payable {}
}

