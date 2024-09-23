"use client"

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import BecomeAUser from "./become-a-user/page";
import { TaxiUser } from "@/entities/taxiUser";
import { getUserByWalletAddress } from "@/services/getUserByWalletAddress";
import { checkIfUserExists } from "@/services/checkIfUserExists";
import { getAllRides } from "@/services/getAllRides";
import { getAllPayments } from "@/services/getAllPayment";
import { Ride } from "@/entities/taxiRide";
import { Payment } from "@/entities/payments";
import { useRouter } from "next/navigation";
import { payForRide } from "@/services/payForRide";

export default function Home() {
  const [userExists, setUserExists] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { address, isConnected } = useAccount();
  const [taxiUser, setTaxiUser] = useState<TaxiUser | null>(null);
  const [rides, setRides] = useState<Ride[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const router = useRouter();

  useEffect(() => {
    const initializeUser = async () => {
      if (isConnected && address) {
        try {
          setIsLoading(true);

          const doesUserExist = await checkIfUserExists(address);
          setUserExists(doesUserExist);

          if (doesUserExist) {
            const fetchedTaxiUser = await getUserByWalletAddress(address, {
              _walletAddress: address as `0x${string}`,
            });
            setTaxiUser(fetchedTaxiUser);

            const allRides = await getAllRides();
            setRides(allRides);

            const allPayments = await getAllPayments();
            const userPayments = allPayments.filter(
              (payment) => payment.passengerWalletAddress === address
            );
            setPayments(userPayments);
          }

          setIsLoading(false);
        } catch (error) {
          console.error("Error checking user existence or fetching data:", error);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, [address, isConnected]);

  const handlePayForRide = async (rideId: number) => {
    const fareAmount = rides.find((ride) => ride.id === rideId)?.fareInEthers;

    if (fareAmount !== undefined) {
        // Directly use fareAmount without converting to BigInt
        const success = await payForRide(address as `0x${string}`, rideId, fareAmount);
        
        if (success) {
            alert(`Payment for ride ${rideId} successful!`);
        } else {
            alert(`Payment for ride ${rideId} failed.`);
        }
    } else {
        alert("Ride not found.");
    }
};


  if (!isConnected) {
    return (
      <main className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-white">
          <p>Connect your wallet to access the cashless taxi system.</p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex h-screen items-center justify-center bg-gray-900">
        <p className="text-white">Loading...</p>
      </main>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center bg-gray-900 p-4">
        <p className="text-white">
          Connected: <span className="font-bold">{isConnected.toString()}</span>
        </p>
      </div>
      {userExists ? (
  <main className="flex flex-col items-center p-6 bg-gray-800 shadow-lg">
    <h4 className="text-2xl font-bold pt-4 pb-2 text-white">
      Welcome, {taxiUser?.username || "Valued User"}! 
    </h4>

    {taxiUser?.isDriver ? (
      <div className="mt-6 flex flex-col gap-6 items-center">
        <p className="text-gray-300 text-center">
          As a driver, you play a vital role in our community! Create rides effortlessly and provide passengers with seamless, cashless journeys.
        </p>
        <button
          className="bg-blue-600 text-white px-6 py-2  transition-transform transform hover:scale-105"
          onClick={() => router.push("/createRide")}
        >
          Create a Ride
        </button>

        <div className="mt-6 bg-gray-700 p-6 rounded-lg shadow-md w-full max-w-xl">
          <h5 className="text-white font-bold mb-4 text-xl text-center">
            Manage Your Rides 🚕
          </h5>
          {rides.length > 0 ? (
            <ul className="bg-gray-800 p-4 rounded-lg shadow-md divide-y divide-gray-600">
              {rides.map((ride) => (
                <li
                  key={ride.id}
                  className="py-4 px-4 rounded-lg mb-2 transition hover:bg-gray-600 flex justify-between items-center"
                >
                  <div className="flex flex-col">
                    <p className="text-lg font-semibold text-gray-300">
                      <span>Destination:</span> {ride.destination}
                    </p>
                    <p className="text-gray-400">
                      <strong>Fare per Passenger:</strong> {ride.fareInEthers} ETH
                    </p>
                    <p className="text-gray-400">
                      <strong>Passengers:</strong> {ride.numPassengers}
                    </p>
                    <p className="text-gray-400">
                      <strong>Total Fare:</strong> {ride.totalFare} ETH
                    </p>
                    <p className="text-gray-500 text-sm">
                      <strong>Created At:</strong> {new Date(ride.createdAt * 1000).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">
              No rides created yet. Let's get started!
            </p>
          )}
        </div>
      </div>
    ) : (
      <div className="mt-6 flex flex-col gap-6 items-center">
        <p className="text-gray-300 text-center">
          Enjoy seamless cashless rides! Book your journey easily, knowing your payments are secure.
        </p>

        <div className="mt-6 bg-white p-4 rounded-lg shadow-md w-full max-w-md">
          <h5 className="text-black font-bold mb-2">Available Rides</h5>
          {rides.length > 0 ? (
            <ul className="bg-white p-4 rounded-lg shadow-md">
              {rides.map((ride) => (
                <li key={ride.id} className="border-b py-3">
                  <p><strong>Destination:</strong> {ride.destination}</p>
                  <p><strong>Fare:</strong> {ride.fareInEthers} ETH</p>
                  <p><strong>Created At:</strong> {new Date(ride.createdAt * 1000).toLocaleString()}</p>
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded mt-2 transition-transform transform hover:scale-105"
                    onClick={() => handlePayForRide(ride.id)}
                  >
                    Pay for Ride
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No rides available. Check back soon!</p>
          )}
        </div>

        <div className="mt-6 bg-white p-4 rounded-lg shadow-md w-full max-w-md">
          <h5 className="text-black font-bold mb-2">Your Payments</h5>
          {payments.length > 0 ? (
            <ul className="bg-white p-4 rounded-lg shadow-md">
              {payments.map((payment) => (
                <li key={payment.id} className="border-b py-2">
                  <p><strong>Ride ID:</strong> {payment.rideId}</p>
                  <p><strong>Amount Paid:</strong> {payment.amountPaidInEthers / 1e18} ETH</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No payments made yet. Start your journey today!</p>
          )}
        </div>
      </div>
    )}
  </main>
) : (
  <BecomeAUser />
)}

    </>
  );
}
