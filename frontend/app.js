const contractAddress = '0xF5d4152c86802ED380c7611b0AdE03fBEc486f7D';
const contractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "electionId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "title",
                "type": "string"
            }
        ],
        "name": "ElectionCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "electionId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "voter",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "candidateId",
                "type": "uint256"
            }
        ],
        "name": "Voted",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "admin",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "elections",
        "outputs": [
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "active",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "string[]",
                "name": "candidateNames",
                "type": "string[]"
            }
        ],
        "name": "createElection",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "electionId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "candidateId",
                "type": "uint256"
            }
        ],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "electionId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "voter",
                "type": "address"
            }
        ],
        "name": "hasVoted",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "electionId",
                "type": "uint256"
            }
        ],
        "name": "getCandidates",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "voteCount",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Voting.Candidate[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "electionId",
                "type": "uint256"
            }
        ],
        "name": "closeElection",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getElections",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "title",
                        "type": "string"
                    },
                    {
                        "components": [
                            {
                                "internalType": "string",
                                "name": "name",
                                "type": "string"
                            },
                            {
                                "internalType": "uint256",
                                "name": "voteCount",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct Voting.Candidate[]",
                        "name": "candidates",
                        "type": "tuple[]"
                    },
                    {
                        "internalType": "address[]",
                        "name": "voters",
                        "type": "address[]"
                    },
                    {
                        "internalType": "bool",
                        "name": "active",
                        "type": "bool"
                    }
                ],
                "internalType": "struct Voting.Election[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    }
];

let web3;
let votingContract;
let accounts;

async function init() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        accounts = await web3.eth.getAccounts();
        votingContract = new web3.eth.Contract(contractABI, contractAddress);
        loadElections();
        document.getElementById("connectButton").innerText = "Wallet Connected";
        checkAdmin();
    } else {
        alert("Please install MetaMask to use this app.");
    }
}

async function loadElections() {
    const elections = await votingContract.methods.getElections().call();
    const electionsDiv = document.getElementById("electionsSection");
    electionsDiv.innerHTML = ''; // Clear previous elections

    elections.forEach((election, index) => {
        const electionElement = document.createElement("div");
        electionElement.classList.add("election");
        electionElement.innerHTML = `
            <h3>${election.title}</h3>
            <button onclick="viewElection(${index})">View Candidates</button>
        `;
        electionsDiv.appendChild(electionElement);
    });
}

async function viewElection(electionId) {
    const candidates = await votingContract.methods.getCandidates(electionId).call();
    const candidatesDiv = document.getElementById("candidates");
    candidatesDiv.innerHTML = ''; // Clear previous candidates

    candidates.forEach((candidate, index) => {
        const candidateElement = document.createElement("div");
        candidateElement.classList.add("candidate");
        candidateElement.innerHTML = `
            <h3>${candidate.name}</h3>
            <p>Votes: ${candidate.voteCount}</p>
            <button onclick="vote(${electionId}, ${index})">Vote</button>
        `;
        candidatesDiv.appendChild(candidateElement);
    });

    document.getElementById("electionsSection").style.display = 'none';
    document.getElementById("candidatesSection").style.display = 'block';
}

function backToElections() {
    document.getElementById("electionsSection").style.display = 'block';
    document.getElementById("candidatesSection").style.display = 'none';
}

async function vote(electionId, candidateId) {
    try {
        await votingContract.methods.vote(electionId, candidateId).send({ from: accounts[0] });
        alert("Vote successful!");
        loadElections();
    } catch (error) {
        alert("Error voting: " + error.message);
    }
}

async function checkAdmin() {
    const adminAddress = await votingContract.methods.admin().call();
    if (accounts[0].toLowerCase() === adminAddress.toLowerCase()) {
        document.getElementById("adminButton").style.display = 'inline-block';
    }
}

document.getElementById("connectButton").addEventListener("click", init);
document.getElementById("backButton").addEventListener("click", backToElections);

