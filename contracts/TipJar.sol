// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TipJar
 * @dev A simple contract to receive tips in Bitcoin (via Midl's EVM layer).
 */
contract TipJar {
    address public owner;
    uint256 public totalTips;
    uint256 public tipCount;

    event TipReceived(address indexed sender, uint256 amount, string message);
    event Withdrawn(address indexed owner, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Allows users to send a tip with an optional message.
     * @param message A message from the tipper.
     */
    function payTip(string memory message) public payable {
        require(msg.value > 0, "Tip amount must be greater than 0");
        
        totalTips += msg.value;
        tipCount++;
        
        emit TipReceived(msg.sender, msg.value, message);
    }

    /**
     * @dev Allows the owner to withdraw the funds.
     */
    function withdraw() public {
        require(msg.sender == owner, "Only the owner can withdraw");
        uint256 amount = address(this).balance;
        
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Withdrawal failed");
        
        emit Withdrawn(owner, amount);
    }

    /**
     * @dev Returns the contract's balance.
     */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
