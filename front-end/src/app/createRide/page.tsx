"use client";

import { useState } from "react";
import { createNewRide } from "@/services/createNewRide";
import { useRouter } from "next/navigation";

export default function CreateRide() {
  const [rideName, setRideName] = useState("");
  const [rideDate, setRideDate] = useState("");
  const [fareInEthers, setFareInEthers] = useState(0);
  const [numPassengers, setNumPassengers] = useState(1);
  const [totalFare, setTotalFare] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null); // Define as string or null
  const router = useRouter();

  const handleCreateRide = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rideName || !rideDate || fareInEthers <= 0 || numPassengers <= 0) {
      setError("Please provide a name, date, fare, and number of passengers for the ride.");
      return;
    }

    setIsSubmitting(true);
    setError(null); // Reset error before making the request

    try {
      const newRide = await createNewRide({
        _destination: rideName,
        _fareInEthers: fareInEthers,
        _numPassengers: numPassengers,
        _totalFare: totalFare,
      });

      if (newRide) {
        alert("Ride successfully created!");
        router.push("/");
      }
    } catch (err) {
      setError("Failed to create ride. Please try again.");
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
    <div className="flex flex-col items-center p-6 bg-gray-800 h-screen">
      <h2 className="text-2xl font-bold pb-4 text-blue-700 drop-shadow-lg">
        Create a Ride!
      </h2>

      <form
        className="flex flex-col gap-6 w-full max-w-md p-6 bg-white rounded-lg shadow-lg border border-blue-500"
        onSubmit={handleCreateRide}
      >
        {error && (
          <p className="text-red-500 font-semibold">{error}</p> // Render error only when present
        )}

        <div className="flex flex-col">
          <label className="text-blue-600 font-medium" htmlFor="rideName">
            🎈 Ride Name
          </label>
          <input
            id="rideName"
            type="text"
            placeholder="Enter ride name"
            value={rideName}
            onChange={(e) => setRideName(e.target.value)}
            className="border border-blue-500 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-blue-600 font-medium" htmlFor="rideDate">
            📅 Ride Date
          </label>
          <input
            id="rideDate"
            type="date"
            value={rideDate}
            onChange={(e) => setRideDate(e.target.value)}
            className="border border-blue-500 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-blue-600 font-medium" htmlFor="fareInEthers">
            💰 Fare in Ethers
          </label>
          <input
            id="fareInEthers"
            type="number"
            placeholder="Enter fare in ethers"
            value={fareInEthers}
            onChange={(e) => handleFareChange(Number(e.target.value))}
            className="border border-blue-500 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-blue-600 font-medium" htmlFor="numPassengers">
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
          />
        </div>

        <p className="text-blue-600 font-bold"> Total Fare: {totalFare} ethers</p>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 transform hover:scale-105"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Ride"}
        </button>
      </form>
    </div>
  );
}
