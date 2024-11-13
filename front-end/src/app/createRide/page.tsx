"use client";

import { useState } from "react";
import { createNewRide } from "@/services/createNewRide";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer";
import FunSpinner from "@/components/spinner";  // Replace this with your actual spinner component

// Helper function to get today's date in YYYY-MM-DD format
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function CreateRide() {
  const [rideName, setRideName] = useState("");
  const [rideDate, setRideDate] = useState(getCurrentDate());  // Default to today's date
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

    if (!rideName || !rideDate || fareInEthers <= 0 || numPassengers <= 0 || !licensePlate || !driverName) {
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
        _driverName: driverName
      });

      if (newRide) {
        setMessage("Ride successfully created!");
        router.push("/");
      }
    } catch (err) {
      setMessage("Failed to create ride. Please try again.");
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h2 className="text-2xl py-4 text-center font-bold pb-4 text-green-800 font-medium drop-shadow-lg">
        Create a Ride!
      </h2>

      <form
        className="flex flex-col gap-6 w-full max-w-md p-6 bg-gradient-to-r from-green-400 to-yellow-300 rounded-lg shadow-lg border border-blue-500"
        onSubmit={handleCreateRide}
      >
        {message && <p className="text-red-500 font-semibold">{message}</p>}
        
        {/* Loading Spinner */}
        {isSubmitting }

        <div className="flex flex-col">
          <label className="text-green-800 font-medium" htmlFor="rideName">
            🎈 Ride Name
          </label>
          <input
            id="rideName"
            type="text"
            placeholder="Enter ride name"
            value={rideName}
            onChange={(e) => setRideName(e.target.value)}
            className="border border-blue-500 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-green-800 font-medium" htmlFor="rideDate">
            📅 Ride Date
          </label>
          <input
            id="rideDate"
            type="date"
            value={rideDate}
            onChange={(e) => setRideDate(e.target.value)}
            className="border border-blue-500 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-green-800 font-medium" htmlFor="fareInEthers">
            💰 Fare
          </label>
          <input
            id="fareInEthers"
            type="number"
            placeholder="Enter fare in ethers"
            value={fareInEthers}
            onChange={(e) => handleFareChange(Number(e.target.value))}
            className="border border-blue-500 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-green-800 font-medium" htmlFor="numPassengers">
            👥 Number of Passengers
          </label>
          <input
            id="numPassengers"
            type="number"
            placeholder="Enter number of passengers"
            value={numPassengers}
            onChange={(e) => handlePassengerChange(Number(e.target.value))}
            min="1"
            className="border border-blue-500 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-green-800 font-medium" htmlFor="licensePlate">
            🚗 License Plate
          </label>
          <input
            id="licensePlate"
            type="text"
            placeholder="Enter license plate"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
            className="border border-blue-500 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-green-800 font-medium" htmlFor="driverName">
            🧑‍✈️ Driver's Name
          </label>
          <input
            id="driverName"
            type="text"
            placeholder="Enter driver's name"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            className="border border-blue-500 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
            disabled={isSubmitting}
          />
        </div>

        <p className="text-green-800 font-bold">Total Fare: {totalFare} cUSD</p>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 transform hover:scale-105"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Ride"}
        </button>
      </form>

      <Footer />
    </div>
  );
}
