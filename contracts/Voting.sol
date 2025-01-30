// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    struct Election {
        string title;
        Candidate[] candidates;
        address[] voters;
        bool active;
    }

    address public admin;
    Election[] public elections;

    event ElectionCreated(uint256 electionId, string title);
    event Voted(uint256 electionId, address indexed voter, uint256 candidateId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createElection(
        string memory title,
        string[] memory candidateNames
    ) public onlyAdmin {
        Election storage newElection = elections.push();
        newElection.title = title;
        newElection.active = true;

        for (uint256 i = 0; i < candidateNames.length; i++) {
            newElection.candidates.push(Candidate(candidateNames[i], 0));
        }
        emit ElectionCreated(elections.length - 1, title);
    }

    function vote(uint256 electionId, uint256 candidateId) public {
        require(electionId < elections.length, "Invalid election ID");
        require(elections[electionId].active, "Election is not active");
        require(!hasVoted(electionId, msg.sender), "You have already voted");
        require(
            candidateId < elections[electionId].candidates.length,
            "Invalid candidate ID"
        );

        elections[electionId].voters.push(msg.sender); // Track the voter address
        elections[electionId].candidates[candidateId].voteCount += 1;

        emit Voted(electionId, msg.sender, candidateId);
    }

    function hasVoted(
        uint256 electionId,
        address voter
    ) public view returns (bool) {
        address[] memory voters = elections[electionId].voters;
        for (uint256 i = 0; i < voters.length; i++) {
            if (voters[i] == voter) {
                return true;
            }
        }
        return false;
    }

    function getCandidates(
        uint256 electionId
    ) public view returns (Candidate[] memory) {
        require(electionId < elections.length, "Invalid election ID");
        return elections[electionId].candidates;
    }

    function closeElection(uint256 electionId) public onlyAdmin {
        require(electionId < elections.length, "Invalid election ID");
        elections[electionId].active = false;
    }

    function getElections() public view returns (Election[] memory) {
        return elections;
    }
}
