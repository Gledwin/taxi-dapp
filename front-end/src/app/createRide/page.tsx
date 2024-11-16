"use client";

import { useState } from "react";
import { createNewRide } from "@/services/createNewRide";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer";
import FunSpinner from "@/components/spinner"; // Replace this with your actual spinner component
import {
  FaCalendarAlt,
  FaUser,
  FaCar,
  FaMoneyBillWave,
  FaUsers,
  FaRoad,
} from "react-icons/fa";

// Helper function to get today's date in YYYY-MM-DD format
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function CreateRide() {
  const [rideName, setRideName] = useState("");
  const [rideDate, setRideDate] = useState(getCurrentDate()); // Default to today's date
  const [fareInEthers, setFareInEthers] = useState(0);
  const [numPassengers, setNumPassengers] = useState(1);
  const [totalFare, setTotalFare] = useState(0);
  const [licensePlate, setLicensePlate] = useState("");
  const [driverName, setDriverName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleCreateRide = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !rideName ||
      !rideDate ||
      fareInEthers <= 0 ||
      numPassengers <= 0 ||
      !licensePlate ||
      !driverName
    ) {
      setMessage("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const newRide = await createNewRide({
        _destination: rideName,
        _fareInEthers: fareInEthers,
        _numPassengers: numPassengers,
        _totalFare: totalFare,
        _licensePlate: licensePlate,
        _driverName: driverName,
      });

      if (newRide) {
        setMessage("Ride successfully created!");
        setTimeout(() => {
          router.push("/"); // Navigate to homepage after 5 seconds
        }, 5000);
      }
    } catch (err) {
      setMessage("Failed to create ride. Please try again.");
      setTimeout(() => {
        setMessage(null); // Clear the message after 5 seconds
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFareChange = (value: number) => {
    setFareInEthers(value);
    setTotalFare(value * numPassengers);
  };

  const handlePassengerChange = (value: number) => {
    setNumPassengers(value);
    setTotalFare(fareInEthers * value);
  };

  return (
    <>
      {message && (
        <div className="fixed top-0 left-0 right-0 p-4 text-center z-50 text-white bg-green-500 shadow-lg">
          {message}
        </div>
      )}

      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-3xl font-extrabold text-green-800 mb-8">
          Create a Ride!
        </h2>

        <form
          className="flex flex-col gap-6 w-full max-w-lg p-6 bg-white rounded-3xl shadow-lg border border-green-800"
          onSubmit={handleCreateRide}
        >
          <div className="flex flex-col gap-2">
            <label className="text-green-800 font-medium" htmlFor="rideName">
              <FaRoad /> Ride Name
            </label>
            <input
              id="rideName"
              type="text"
              placeholder="Enter ride name"
              value={rideName}
              onChange={(e) => setRideName(e.target.value)}
              className="border border-green-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-green-800 font-medium" htmlFor="rideDate">
              <FaCalendarAlt /> Ride Date
            </label>
            <input
              id="rideDate"
              type="date"
              value={rideDate}
              onChange={(e) => setRideDate(e.target.value)}
              className="border border-green-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-green-800 font-medium" htmlFor="fareInEthers">
                <FaMoneyBillWave/> Fare
              </label>
              <input
                id="fareInEthers"
                type="number"
                placeholder="Fare in ethers"
                value={fareInEthers}
                onChange={(e) => handleFareChange(Number(e.target.value))}
                className="border border-green-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-green-800 font-medium" htmlFor="numPassengers">
                <FaUsers /> Passengers
              </label>
              <input
                id="numPassengers"
                type="number"
                placeholder="Number of passengers"
                value={numPassengers}
                onChange={(e) => handlePassengerChange(Number(e.target.value))}
                min="1"
                className="border border-green-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-green-800 font-medium" htmlFor="licensePlate">
                <FaCar /> License Plate
              </label>
              <input
                id="licensePlate"
                type="text"
                placeholder="Enter license plate"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                className="border border-green-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-green-800 font-medium" htmlFor="driverName">
                <FaUser /> Driver's Name
              </label>
              <input
                id="driverName"
                type="text"
                placeholder="Driver's name"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="border border-green-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <p className="text-green-800 font-bold text-center">
            Total Fare: {totalFare} celo
          </p>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-600 transition duration-200 transform hover:scale-105"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Ride"}
          </button>
        </form>

        <Footer />
      </div>
    </>
  );
}
