// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BadgeRegistry {
    struct BadgeRecord {
        bytes32 dataHash;
        address issuer;
        uint256 timestamp;
        bool exists;
    }

    address public owner;
    mapping(string => BadgeRecord) private badges;
    uint256 public totalBadges;

    event BadgeRegistered(
        string indexed badgeId,
        bytes32 dataHash,
        address issuer,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can register badges");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerBadge(
        string calldata badgeId,
        bytes32 dataHash
    ) external onlyOwner {
        require(!badges[badgeId].exists, "Badge already registered");

        badges[badgeId] = BadgeRecord({
            dataHash: dataHash,
            issuer: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        totalBadges++;

        emit BadgeRegistered(badgeId, dataHash, msg.sender, block.timestamp);
    }

    function getBadge(
        string calldata badgeId
    ) external view returns (bytes32 dataHash, address issuer, uint256 timestamp, bool exists) {
        BadgeRecord memory record = badges[badgeId];
        return (record.dataHash, record.issuer, record.timestamp, record.exists);
    }

    function verifyBadge(
        string calldata badgeId,
        bytes32 expectedHash
    ) external view returns (bool) {
        BadgeRecord memory record = badges[badgeId];
        if (!record.exists) return false;
        return record.dataHash == expectedHash;
    }
}
