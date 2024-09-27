// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

import {TaxiUser, Ride, Payment} from "./taxi.sol"; // Adjust the import path as necessary
import {ERC20} from "./taxiInterfaces.sol"; // Adjust the import path as necessary

contract CashlessTaxiSystem {
    TaxiUser[] private allTaxiUsers;
    Ride[] private allRides;
    Payment[] private allPayments;

    uint256 private currentUserId;
    uint256 private currentRideId;
    uint256 private currentPaymentId;

    ERC20 public cUSD = ERC20(0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1);

    constructor() {}

    modifier onlyDriver(uint256 _rideId) {
        require(
            allRides[_rideId].driverWalletAddress == msg.sender,
            "Only the driver of this ride can perform this action."
        );
        _;
    }

    modifier onlyPassenger(uint256 _rideId) {
        require(
            allPayments[_rideId].passengerWalletAddress == msg.sender,
            "Only the passenger of this ride can perform this action."
        );
        _;
    }

    modifier onlyExistingUser() {
        require(checkIfUserExists(msg.sender), "User does not exist.");
        _;
    }

    // Create User (Driver or Passenger)
    function createUser(string memory _username, string memory _emailAddress, bool _isDriver)
        public
        returns (TaxiUser memory)
    {
        require(!checkIfUserExists(msg.sender), "User already exists.");
        
        uint256 newUserId = currentUserId++;
        allTaxiUsers.push(
            TaxiUser(newUserId, msg.sender, _username, _emailAddress, _isDriver, false)
        );

        return allTaxiUsers[newUserId];
    }

    function checkIfUserExists(address _walletAddress) public view returns (bool) {
        for (uint256 i = 0; i < allTaxiUsers.length; i++) {
            if (allTaxiUsers[i].walletAddress == _walletAddress && !allTaxiUsers[i].isBlank) {
                return true;
            }
        }
        return false;
    }

    function createRide(
    string memory _destination,
    uint256 _fareInEthers,
    uint256 _numPassengers,
    uint256 _totalFare
) public onlyExistingUser returns (Ride memory) {
    TaxiUser memory user = getUserByWalletAddress(msg.sender);
    require(user.isDriver, "Only a driver can create a ride.");

    uint256 newRideId = currentRideId++;
    uint256 createdAt = block.timestamp;

    // Create the ride
    allRides.push(
        Ride(
            newRideId,
            msg.sender, // Driver's address
            _destination,
            _fareInEthers,
            createdAt,
            createdAt,
            false,
            false,
            false,
            _numPassengers,
            _totalFare
        )
    );

    // Initialize the Payment object for this ride
    allPayments.push(
        Payment({
            id: currentPaymentId++,
            rideId: newRideId,
            passengerWalletAddress: address(0), // Will be set later when the passenger pays
            amountPaidInEthers: _fareInEthers, // Assume fare in ethers maps to token units
            paidAt: 0,        
            isBlank: false,
            isPaid: false // Not paid yet
        })
    );

    return allRides[newRideId];
}

       // Passenger Pays for Ride
    function payForRide(uint256 _rideId) public onlyExistingUser {
        Ride storage ride = allRides[_rideId];
        require(!ride.isCompleted, "Ride is already completed.");
        require(ride.numPassengers > 0, "No passengers left to pay.");

        // Update the payment record for the ride
        Payment storage payment = allPayments[_rideId];
        require(!payment.isPaid, "This ride has already been paid for.");
        require(
            cUSD.transferFrom(msg.sender, ride.driverWalletAddress, payment.amountPaidInEthers),
            "Payment failed."
        );

        // Assign the passenger's address to the payment
        payment.passengerWalletAddress = msg.sender;
        payment.isPaid = true;  // Mark the payment as paid
        payment.paidAt = block.timestamp; // Set the timestamp of when the payment was made

        // Decrease the number of passengers who need to pay
        ride.numPassengers -= 1;

        // If all passengers have paid, mark the ride as paid
        if (ride.numPassengers == 0) {
            ride.isPaid = true;
        }
    }



    // Driver Marks Ride as Complete
    function completeRide(uint256 _rideId) public onlyDriver(_rideId) {
    Ride storage ride = allRides[_rideId];
    require(ride.isPaid, "Ride has not been fully paid for.");
    require(!ride.isCompleted, "Ride is already completed.");

    // Mark the ride as completed
    ride.isCompleted = true;
}


    // Helper Functions
    function getUserByWalletAddress(address _walletAddress)
        public
        view
        returns (TaxiUser memory)
    {
        for (uint256 i = 0; i < allTaxiUsers.length; i++) {
            if (allTaxiUsers[i].walletAddress == _walletAddress) {
                return allTaxiUsers[i];
            }
        }

        TaxiUser memory blankUser;
        blankUser.isBlank = true;
        return blankUser;
    }

    function getRideById(uint256 _rideId) public view returns (Ride memory) {
        return allRides[_rideId];
    }

    function getAllRides() public view returns (Ride[] memory) {
        return allRides;
    }

    function getPaymentByRideId(uint256 _rideId) public view returns (Payment memory) {
        return allPayments[_rideId];
    }

    function getAllPayments() public view returns (Payment[] memory) {
        return allPayments;
    }
// Get rides created by a specific driver
function getDriverRides(address _driverAddress) public view returns (Ride[] memory) {
    uint256 count = 0;

    // Count the number of rides created by the driver
    for (uint256 i = 0; i < allRides.length; i++) {
        if (allRides[i].driverWalletAddress == _driverAddress) {
            count++;
        }
    }

    // Create an array to store the rides created by the driver
    Ride[] memory driverRides = new Ride[](count);
    uint256 index = 0;

    // Add the rides created by the driver to the array
    for (uint256 i = 0; i < allRides.length; i++) {
        if (allRides[i].driverWalletAddress == _driverAddress) {
            driverRides[index] = allRides[i];
            index++;
        }
    }

    return driverRides;
}


}