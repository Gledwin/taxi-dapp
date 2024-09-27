// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

struct TaxiUser {
    uint256 id;
    address walletAddress;
    string username;
    string emailAddress;
    bool isDriver;
    bool isBlank;
}

struct Ride {
    uint256 id;
    address driverWalletAddress;
    string destination;
    uint256 fareInEthers;
    uint256 createdAt;
    uint256 updatedAt;
    bool isCompleted;
    bool isPaid;
    bool isBlank;
    uint256 numPassengers; // Number of passengers
    uint256 totalFare;     // Total fare for the ride
}

struct Payment {
    uint256 id;
    uint256 rideId;
    address passengerWalletAddress;
    uint256 amountPaidInEthers;
    uint256 paidAt;
    bool isPaid;
    bool isBlank;
}
