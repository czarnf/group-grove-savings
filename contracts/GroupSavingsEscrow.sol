// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract GroupSavingsEscrow is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    
    struct Group {
        address creator;
        string name;
        uint256 targetAmount;
        uint256 currentAmount;
        uint256 deadline;
        bool isActive;
        mapping(address => uint256) contributions;
        address[] members;
    }

    Counters.Counter private _groupIdCounter;
    mapping(uint256 => Group) private _groups;
    mapping(address => uint256[]) private _userGroups;

    event GroupCreated(uint256 groupId, address creator, string name, uint256 targetAmount, uint256 deadline);
    event ContributionMade(uint256 groupId, address contributor, uint256 amount);
    event WithdrawalMade(uint256 groupId, address member, uint256 amount);
    event GroupCompleted(uint256 groupId, uint256 totalAmount);

    constructor() Ownable(msg.sender) {}

    function createGroup(
        string memory name,
        uint256 targetAmount,
        uint256 deadline
    ) external returns (uint256) {
        require(targetAmount > 0, "Target amount must be greater than 0");
        require(deadline > block.timestamp, "Deadline must be in the future");

        uint256 groupId = _groupIdCounter.current();
        _groupIdCounter.increment();

        Group storage newGroup = _groups[groupId];
        newGroup.creator = msg.sender;
        newGroup.name = name;
        newGroup.targetAmount = targetAmount;
        newGroup.deadline = deadline;
        newGroup.isActive = true;
        newGroup.members.push(msg.sender);

        _userGroups[msg.sender].push(groupId);

        emit GroupCreated(groupId, msg.sender, name, targetAmount, deadline);
        return groupId;
    }

    function contribute(uint256 groupId) external payable nonReentrant {
        Group storage group = _groups[groupId];
        require(group.isActive, "Group is not active");
        require(block.timestamp < group.deadline, "Group deadline has passed");
        require(msg.value > 0, "Contribution amount must be greater than 0");

        if (group.contributions[msg.sender] == 0) {
            group.members.push(msg.sender);
            _userGroups[msg.sender].push(groupId);
        }

        group.contributions[msg.sender] += msg.value;
        group.currentAmount += msg.value;

        emit ContributionMade(groupId, msg.sender, msg.value);

        if (group.currentAmount >= group.targetAmount) {
            _completeGroup(groupId);
        }
    }

    function withdraw(uint256 groupId) external nonReentrant {
        Group storage group = _groups[groupId];
        require(!group.isActive, "Group is still active");
        require(group.contributions[msg.sender] > 0, "No contributions to withdraw");

        uint256 contribution = group.contributions[msg.sender];
        group.contributions[msg.sender] = 0;

        (bool success, ) = msg.sender.call{value: contribution}("");
        require(success, "Withdrawal failed");

        emit WithdrawalMade(groupId, msg.sender, contribution);
    }

    function _completeGroup(uint256 groupId) internal {
        Group storage group = _groups[groupId];
        group.isActive = false;
        emit GroupCompleted(groupId, group.currentAmount);
    }

    function getGroupInfo(uint256 groupId) external view returns (
        address creator,
        string memory name,
        uint256 targetAmount,
        uint256 currentAmount,
        uint256 deadline,
        bool isActive,
        address[] memory members
    ) {
        Group storage group = _groups[groupId];
        return (
            group.creator,
            group.name,
            group.targetAmount,
            group.currentAmount,
            group.deadline,
            group.isActive,
            group.members
        );
    }

    function getUserContribution(uint256 groupId, address user) external view returns (uint256) {
        return _groups[groupId].contributions[user];
    }

    function getUserGroups(address user) external view returns (uint256[] memory) {
        return _userGroups[user];
    }
} 