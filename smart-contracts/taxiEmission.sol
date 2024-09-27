// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;


contract taxiEmissions {
struct TaxiUser {
    uint256 id;
    address walletAddress;
    string username;
    string emailAddress;
    bool isDriver; // True if the user is a driver, false if a passenger
}

struct TaxiRide {
    uint256 id;
    address driverWalletAddress; // Driver offering the ride
    string pickupLocation;
    string destination;
    uint256 fareInEthers; // Cost of the ride in Ether
    uint256 createdAt;
    uint256 updatedAt;
    uint256 rideDateTime; // When the ride is scheduled to happen
    bool isBlank; // True if this ride doesn't exist
    bool isAvailable; // True if ride is available for booking
    bool isCompleted; // True if the ride has been completed
    bool isPaidOut; // True if the driver has been paid
}

struct TaxiBooking {
    uint256 id;
    uint256 rideId; // Reference to the TaxiRide being booked
    address passengerWalletAddress; // Passenger who booked the ride
    uint256 amountPaidInEthers; // Amount paid for the ride
    bool isBlank; // True if the booking does not exist
}

struct TaxiPayout {
    uint256 id;
    uint256 rideId; // Reference to the TaxiRide
    address driverWalletAddress; // Driver receiving the payout
    uint256 amountPaidOutInEthers; // Amount paid out to the driver
    uint256 payoutDateTime; // When the payout was made
    bool isBlank; // True if the payout does not exist
}

}
