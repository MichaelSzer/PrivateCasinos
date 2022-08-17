// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {

    event NewWave(address indexed from, uint256 timestamp, string message);
     
    struct Wave {
        address waver; // The address of the user who waved.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user waved.
    }
    
    uint256 public totalWaves;
    Wave[] public waves;

    constructor() {
        console.log("Class WavePortal");
    }

    function wave(string calldata _message) external {
        totalWaves += 1;
        console.log("%s has waved!", msg.sender);
        waves.push(Wave(msg.sender, _message, block.timestamp));
        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }
}