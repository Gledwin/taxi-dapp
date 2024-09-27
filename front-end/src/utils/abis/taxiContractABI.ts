export const taxiContractABI =
[
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_rideId",
				"type": "uint256"
			}
		],
		"name": "completeRide",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_destination",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_fareInEthers",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_numPassengers",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_totalFare",
				"type": "uint256"
			}
		],
		"name": "createRide",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "driverWalletAddress",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "destination",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "fareInEthers",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "createdAt",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "updatedAt",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isCompleted",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "isPaid",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "isBlank",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "numPassengers",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalFare",
						"type": "uint256"
					}
				],
				"internalType": "struct Ride",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_username",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_emailAddress",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "_isDriver",
				"type": "bool"
			}
		],
		"name": "createUser",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "walletAddress",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "username",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "emailAddress",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "isDriver",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "isBlank",
						"type": "bool"
					}
				],
				"internalType": "struct TaxiUser",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_rideId",
				"type": "uint256"
			}
		],
		"name": "payForRide",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_walletAddress",
				"type": "address"
			}
		],
		"name": "checkIfUserExists",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "cUSD",
		"outputs": [
			{
				"internalType": "contract ERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllPayments",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "rideId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "passengerWalletAddress",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "amountPaidInEthers",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "paidAt",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isPaid",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "isBlank",
						"type": "bool"
					}
				],
				"internalType": "struct Payment[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllRides",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "driverWalletAddress",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "destination",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "fareInEthers",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "createdAt",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "updatedAt",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isCompleted",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "isPaid",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "isBlank",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "numPassengers",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalFare",
						"type": "uint256"
					}
				],
				"internalType": "struct Ride[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_driverAddress",
				"type": "address"
			}
		],
		"name": "getDriverRides",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "driverWalletAddress",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "destination",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "fareInEthers",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "createdAt",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "updatedAt",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isCompleted",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "isPaid",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "isBlank",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "numPassengers",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalFare",
						"type": "uint256"
					}
				],
				"internalType": "struct Ride[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_rideId",
				"type": "uint256"
			}
		],
		"name": "getPaymentByRideId",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "rideId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "passengerWalletAddress",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "amountPaidInEthers",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "paidAt",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isPaid",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "isBlank",
						"type": "bool"
					}
				],
				"internalType": "struct Payment",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_rideId",
				"type": "uint256"
			}
		],
		"name": "getRideById",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "driverWalletAddress",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "destination",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "fareInEthers",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "createdAt",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "updatedAt",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isCompleted",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "isPaid",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "isBlank",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "numPassengers",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalFare",
						"type": "uint256"
					}
				],
				"internalType": "struct Ride",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_walletAddress",
				"type": "address"
			}
		],
		"name": "getUserByWalletAddress",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "walletAddress",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "username",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "emailAddress",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "isDriver",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "isBlank",
						"type": "bool"
					}
				],
				"internalType": "struct TaxiUser",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]