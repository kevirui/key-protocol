// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "./LibraryStructs.sol";
import "./IdentityRegistry.sol";

/// @title ProjectRegistry (UUPS)
/// @notice Gestiona proyectos, profesores y actividades on-chain
/// @dev Optimizado para Astar/Paseo EVM — LatinHack 2025
contract ProjectRegistry is AccessControlUpgradeable, UUPSUpgradeable, ReentrancyGuardUpgradeable {
    using LibraryStructs for *;

    // --- Roles ---
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant ONG_ROLE = keccak256("ONG_ROLE");
    bytes32 public constant PROFESSOR_ROLE = keccak256("PROFESSOR_ROLE");

    // --- Referencias externas ---
    IdentityRegistry public identityRegistry;
    address public keyRegistry;

    // --- Almacenamiento ---
    mapping(uint256 => LibraryStructs.Proyecto) public projects;
    mapping(uint256 => LibraryStructs.Actividad) public activities;
    mapping(uint256 => uint256[]) public projectActivities;
    mapping(uint256 => address[]) public projectProfessors;
    mapping(uint256 => mapping(address => bool)) public isProfessorAssignedToProject;

    uint128 public projectCounter;
    uint128 public activityCounter;

    // --- Eventos ---
    event ProjectCreated(uint256 indexed projectId, address indexed ong, address indexed investor, string name);
    event ProjectStatusChanged(uint256 indexed projectId, bool active);
    event ProfessorAssigned(uint256 indexed projectId, address indexed professor);
    event ActivityRegistered(uint256 indexed activityId, uint256 indexed projectId, address indexed professor);
    event ActivityCompleted(uint256 indexed activityId, uint256 time);
    event EvidenceLinked(uint256 indexed projectId, uint256 indexed activityId, bytes32 packageHash);
    event FundsUpdated(uint256 indexed projectId, uint256 totalUsed);

    /// @notice Inicializa el contrato con administrador e IdentityRegistry
    function initialize(address _admin, address payable _identityRegistry) public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        identityRegistry = IdentityRegistry(_identityRegistry);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(ADMIN_ROLE)
    {}

    // --- Configuración ---
    function setKeyRegistry(address _keyRegistry) external onlyRole(ADMIN_ROLE) {
        keyRegistry = _keyRegistry;
    }

    // --- Crear proyecto ---
    function createProject(
        string calldata name,
        string calldata description,
        address investor,
        uint256 startDate,
        uint256 endDate,
        uint256 totalBudget,
        string calldata metadataURI
    ) external onlyRole(ONG_ROLE) nonReentrant {
        require(startDate < endDate, "Dates");
        unchecked { ++projectCounter; }
        uint256 projectId = projectCounter;
        require(projects[projectId].id == 0, "Exists");

        projects[projectId] = LibraryStructs.Proyecto({
            id: projectId,
            ongAddress: msg.sender,
            name: name,
            description: description,
            startDate: startDate,
            endDate: endDate,
            totalBudget: totalBudget,
            fundsUsed: 0,
            metadataURI: metadataURI,
            active: true
        });

        emit ProjectCreated(projectId, msg.sender, investor, name);
    }

    // --- Asignar profesor ---
    function assignProfessor(uint256 projectId, address professor)
        external
        onlyRole(ONG_ROLE)
    {
        validateProject(projectId);
        require(identityRegistry.hasRole(PROFESSOR_ROLE, professor), "!Prof");
        require(!isProfessorAssignedToProject[projectId][professor], "Dup");

        isProfessorAssignedToProject[projectId][professor] = true;
        projectProfessors[projectId].push(professor);

        emit ProfessorAssigned(projectId, professor);
    }

    // --- Registrar actividad ---
    function registerActivity(
        uint256 projectId,
        LibraryStructs.ActivityType activityType,
        string calldata title,
        string calldata description,
        uint256 scheduledDate,
        string calldata metadataURI
    ) external nonReentrant {
        require(identityRegistry.hasRole(PROFESSOR_ROLE, msg.sender), "!Prof");
        validateProject(projectId);
        require(projects[projectId].active, "Inactive");
        require(isProfessorAssignedToProject[projectId][msg.sender], "Unassigned");
        require(scheduledDate >= block.timestamp, "Past");

        unchecked { ++activityCounter; }
        uint256 activityId = activityCounter;

        activities[activityId] = LibraryStructs.Actividad({
            id: activityId,
            projectId: projectId,
            activityType: activityType,
            title: title,
            description: description,
            scheduledDate: scheduledDate,
            completedDate: 0,
            assignedProfessor: msg.sender,
            metadataURI: metadataURI,
            completed: false
        });

        projectActivities[projectId].push(activityId);
        emit ActivityRegistered(activityId, projectId, msg.sender);
    }

    // --- Completar actividad ---
    function completeActivity(uint256 activityId) external {
        LibraryStructs.Actividad storage act = activities[activityId];
        require(act.id != 0, "NoAct");
        require(msg.sender == act.assignedProfessor, "!Owner");
        require(!act.completed, "Done");

        act.completed = true;
        act.completedDate = block.timestamp;

        emit ActivityCompleted(activityId, block.timestamp);
    }

    // --- Vincular evidencia ---
    function linkEvidence(uint256 activityId, bytes32 packageHash) external {
        require(msg.sender == keyRegistry, "!Auth");
        LibraryStructs.Actividad storage act = activities[activityId];
        require(act.id != 0, "NoAct");
        validateProject(act.projectId);

        emit EvidenceLinked(act.projectId, activityId, packageHash);
    }

    // --- Actualizar fondos ---
    function updateFunds(uint256 projectId, uint256 amount) external onlyRole(ONG_ROLE) {
        validateProject(projectId);
        LibraryStructs.Proyecto storage proj = projects[projectId];
        require(proj.active, "Inactive");
        require(proj.fundsUsed + amount <= proj.totalBudget, "Over");

        proj.fundsUsed += amount;
        emit FundsUpdated(projectId, proj.fundsUsed);
    }

    // --- Cambiar estado del proyecto ---
    function toggleProjectStatus(uint256 projectId) external onlyRole(ONG_ROLE) {
        validateProject(projectId);
        projects[projectId].active = !projects[projectId].active;
        emit ProjectStatusChanged(projectId, projects[projectId].active);
    }

    // --- Utilidades internas ---
    function validateProject(uint256 projectId) internal view {
        require(projects[projectId].id != 0, "Invalid");
    }
}
