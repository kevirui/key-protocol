// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../KEYRegistry.sol";

/// @title KEYRegistryV2 (Mock Upgrade)
/// @notice Versión mock para probar upgrades del contrato KEYRegistry
contract KEYRegistryV2 is KEYRegistry {
    /// @notice Nueva función para verificar que la actualización funcionó
    function version() external pure returns (string memory) {
        return "v2.0";
    }

    /// @notice Nueva funcionalidad simulada
    function newFeatureExample() external pure returns (uint256) {
        return 42;
    }
}

