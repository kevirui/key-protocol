// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IUpgradeableProxy {
    function upgradeTo(address newImplementation) external;
}

