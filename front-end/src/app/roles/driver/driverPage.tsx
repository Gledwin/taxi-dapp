"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Ride } from "@/entities/taxiRide";
import { completeRide } from "@/services/completeRide";
import Footer from "@/components/footer";
import { TaxiUser } from "@/entities/taxiUser";
import { getBalance } from "@/services/getBalance";
import { getAllPaymentsByRideId } from "@/services/getPaymentsByRide";
import { Payment } from "@/entities/payments";
import { getUserByWalletAddress } from "@/services/getUserByWalletAddress";

import {
  FaTaxi,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaUser,
  FaWallet,
  FaClock,
} from "react-icons/fa";

interface DriverPageProps {
  address: `0x${string}`;
  rides: Ride[];
  message: string | null;
  setMessage: (message: string | null) => void;
  taxiUser: TaxiUser;
}

interface PaymentWithUser extends Payment {
  username: string;
}

export default function DriverPage({
  address,
  rides,
  message,
  setMessage,
  taxiUser,
}: DriverPageProps) {
  const router = useRouter();
  const [balance, setBalance] = useState("0.00");
  const [ridePayments, setRidePayments] = useState<Record<string, PaymentWithUser[]>>({});
  const [loadingAction, setLoadingAction] = useState(false);

  const incompleteRides = rides.filter((ride) => !ride.isCompleted);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const balance = await getBalance(address);
        setBalance(balance);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };
    fetchBalance();
  }, [address]);

  useEffect(() => {
    const fetchPaymentsForRides = async () => {
      const paymentsData: Record<string, PaymentWithUser[]> = {};

      for (const ride of incompleteRides) {
        const payments = await getAllPaymentsByRideId(ride.id);

        const paymentsWithUsernames: PaymentWithUser[] = await Promise.all(
          payments
            .filter(
              (payment) =>
                payment.passengerWalletAddress !== "0x0000000000000000000000000000000000000000"
            )
            .map(async (payment) => {
              const taxiUser = await getUserByWalletAddress(address, {
                _walletAddress: payment.passengerWalletAddress,
              });
              return {
                ...payment,
                username: taxiUser?.username || payment.passengerWalletAddress,
              };
            })
        );

        paymentsData[ride.id.toString()] = paymentsWithUsernames;
      }
      setRidePayments(paymentsData);
    };

    if (incompleteRides.length > 0) {
      fetchPaymentsForRides();
    }
  }, [incompleteRides, address]);

  const handleCompleteRide = async (rideId: number) => {
    setLoadingAction(true);
    try {
      const success = await completeRide(address, { _rideId: rideId });
      setMessage(
        success
          ? `Ride ${rideId} marked as complete!`
          : `Failed to mark ride ${rideId} as complete.`
      );
  
      if (success) {
        setTimeout(() => {
          window.location.reload(); // Force a full-page reload
        }, 5000);
      }
    } catch (error) {
      console.error("Error completing ride:", error);
      setMessage(`Error completing ride ${rideId}.`);
    } finally {
      setLoadingAction(false);
    }
  };
  

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message, setMessage]);

  return (
    <>
      {loadingAction && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-75 bg-gray-800 z-50">
          <div className="text-center text-white text-lg font-bold">
            Completing a ride...
          </div>
        </div>
      )}

     {message && (
          <div className="fixed top-0 left-0 right-0 p-4 text-center z-50 text-white bg-green-800 shadow-lg">
            {message}
          </div>
        )}

      <main className="flex flex-col items-center p-4 min-h-screen">
        <div className="bg-green-800 w-full max-w-md p-8 rounded-3xl shadow-lg text-white mb-8">
          <h4 className="text-3xl font-semibold mb-2 text-left">
            Hi, {taxiUser?.username || "Driver"}
          </h4>
          <p className="text-left text-gray-400">Your Current Balance</p>
          <p className="text-left text-5xl font-bold mt-4 mb-6">{balance} cUSD</p>
        </div>
        <div className="w-full max-w-md mb-6 flex justify-around text-white gap-4">
  <button
    onClick={() => router.push("/createRide")}
    className="bg-green-800 rounded-3xl flex-1 p-4 flex flex-col items-center shadow-md hover:bg-green-500 transition"
    style={{ height: "80px" }} 
  >
    <FaTaxi size={24} />
    <span className="text-sm font-semibold mt-2">Create a Ride</span>
  </button>
  <button
    onClick={() => router.push(`/roles/driver/completed?address=${address}`)}
    className="bg-green-800 rounded-3xl flex-1 p-4 flex flex-col items-center shadow-md hover:bg-green-500 transition"
    style={{ height: "80px" }} 
  >
    <FaCheckCircle size={32} />
    <span className="text-sm font-semibold mt-2">Completed Rides</span>
  </button>
</div>


        <div className="w-full max-w-md space-y-4">
          <h5 className="text-2xl font-semibold text-green-800 mb-2">Current Rides</h5>

          {incompleteRides.length > 0 ? (
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {incompleteRides.map((ride) => (
                <li
                  key={ride.id.toString()}
                  className="bg-green-800 rounded-3xl p-6 shadow-lg text-white"
                >

                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <FaMapMarkerAlt className="text-white" /> {ride.destination}
                    </h3>
                    <span className="text-xs bg-yellow-500 px-3 py-1 rounded-full">
                      ID: {ride.id}
                    </span>
                  </div>

                  <div className="space-y-2 text-gray-300 mb-4">
                    <p className="flex items-center gap-2">
                      <FaMoneyBillWave className="text-white" />
                      Fare: <span className="text-white">{ride.fareInEthers} cUSD</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FaUser className="text-white" />
                      Passengers:{" "}
                      <span className="text-white">
                        {ride.numPassengers} {ride.numPassengers > 1 ? "Passengers" : "Passenger"}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleCompleteRide(ride.id)}
                    className="w-full py-2 text-sm font-semibold bg-yellow-500 rounded-lg hover:bg-teal-600 transition"
                  >
                    Mark as Complete
                  </button>

                  <div className="mt-6 ">
                    <h4 className="font-bold text-gray-200 mb-2">Payments</h4>
                    {ridePayments[ride.id.toString()] &&
                    ridePayments[ride.id.toString()].length > 0 ? (
                      <div className="space-y-4">
                        {ridePayments[ride.id.toString()].map((payment) => (
                          <div
                            key={payment.id}
                            className="bg-green-800 p-4 rounded-lg shadow-md"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <p className="font-bold text-white flex items-center gap-2">
                                <FaWallet /> {payment.username}
                              </p>
                              <p className="text-xs text-gray-400">
                                <FaClock className="inline-block mr-1" />
                                {new Date(Number(payment.paidAt) * 1000).toLocaleString()}
                              </p>
                            </div>
                            <p>
                              <strong className="text-gray-300">Paid:</strong>{" "}
                              <span className="text-green-400">{payment.amountPaidInEthers} cUSD</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 ">No payments yet.</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-centerfont-medium bg-gray-200 p-4 rounded-lg text-green-800">No rides available.</p>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
