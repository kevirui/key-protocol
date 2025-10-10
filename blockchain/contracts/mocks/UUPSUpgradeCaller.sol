// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title UUPSUpgradeCaller
/// @notice Mock que invoca upgradeTo(address) de un proxy UUPS mediante delegatecall
contract UUPSUpgradeCaller {
    function callUpgrade(address proxy, address newImpl) external {
        (bool ok, bytes memory data) = proxy.call(
            abi.encodeWithSignature("upgradeTo(address)", newImpl)
        );
        require(ok, string(abi.encodePacked("Upgrade failed: ", _getRevertMsg(data))));
    }

    function _getRevertMsg(bytes memory revertData) internal pure returns (string memory) {
        if (revertData.length < 68) return "Transaction reverted silently";
        assembly {
            revertData := add(revertData, 0x04)
        }
        return abi.decode(revertData, (string));
    }
}

