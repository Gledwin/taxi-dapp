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

  const incompleteRides = rides.filter((ride) => !ride.isCompleted);

  useEffect(() => {
    console.log("Driver's address in DriverPage:", address); // Debugging line for address

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
              const taxiUser = await getUserByWalletAddress(
                address,
                { _walletAddress: payment.passengerWalletAddress }
              );
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
    try {
      const success = await completeRide(address, { _rideId: rideId });
      setMessage(
        success
          ? `Ride ${rideId} marked as complete!`
          : `Failed to mark ride ${rideId} as complete.`
      );
  
      if (success) {
        // Refresh the page to update the list of incomplete rides
        router.refresh();
      }
    } catch (error) {
      console.error("Error completing ride:", error);
      setMessage(`Error completing ride ${rideId}.`);
    }
  };
  

  return (
    <>
      <main className="flex flex-col items-center p-6 text-black shadow-lg min-h-screen">
        <h4 className="text-3xl text-green-800 font-extrabold pt-6 pb-2">Driver Dashboard</h4>
        <p className="text-lg text-green-800">
          Welcome, <span className="font-bold text-green-800">{taxiUser?.username || "Driver"}</span>!
        </p>

        {message && (
          <div className="fixed top-0 left-0 right-0 p-4 text-center z-50 text-white bg-gradient-to-r from-green-500 to-yellow-500 shadow-lg">
            {message}
          </div>
        )}

        <section className="flex flex-col md:flex-row items-center justify-around w-full max-w-4xl mt-6 space-y-4 md:space-y-0 md:space-x-6">
          <div className="bg-gradient-to-r from-green-500 to-yellow-500 rounded-lg p-6 shadow-lg w-full md:w-1/3">
            <h5 className="text-xl font-semibold mb-2">Current Balance</h5>
            <p className="text-3xl font-bold">{balance} cUSD</p>
          </div>

          <button
            className="w-full bg-gradient-to-r from-green-500 to-yellow-500 text-black font-bold px-6 py-3 rounded-lg shadow-lg hover:opacity-90 transition duration-200"
            onClick={() => router.push("/createRide")}
          >
            Create a Ride
          </button>
          <button
            className="w-full bg-gradient-to-r from-green-500 to-yellow-500 text-black font-bold px-6 py-3 rounded-lg shadow-lg hover:opacity-90 transition duration-200"
            onClick={() => router.push(`/roles/driver/completed?address=${address}`)}
          >
            Completed Rides
          </button>
        </section>

        <div className="mt-8 bg-gradient-to-r from-green-500 to-yellow-500 p-6 rounded-lg shadow-md w-full max-w-4xl">
          <h5 className="text-2xl font-bold mb-4 text-center">Current Rides 🚕</h5>
          {incompleteRides.length > 0 ? (
            <ul className="divide-y divide-gray-600">
              {incompleteRides.map((ride) => (
                <li key={ride.id.toString()} className="py-4 px-4 rounded-lg mb-2 bg-gradient-to-r from-yellow-500 to-green-500">
                  <p><strong>Destination:</strong> {ride.destination}</p>
                  <p><strong>Driver's name:</strong> {ride.driverName}</p>
                  <p><strong>License plate:</strong> {ride.licensePlate}</p>
                  <p><strong>Fare:</strong> {ride.fareInEthers} cUSD</p>
                  <p><strong>Number of passengers:</strong> {ride.numPassengers}</p>
                  <p><strong>Expected amount:</strong> {ride.totalFare} cUSD</p>
                  <p><strong>Created At:</strong>{" "}
                    {new Date(Number(ride.createdAt) * 1000).toLocaleDateString()}
                  </p>
                  
                  <button
                    className="bg-green-600 text-white px-4 py-1 rounded mt-2 hover:bg-green-700"
                    onClick={() => handleCompleteRide(ride.id)}
                  >
                    Complete Ride
                  </button>
                  <div className="mt-4">
                    <h6 className="font-bold">Payments:</h6>
                    {ridePayments[ride.id.toString()] && ridePayments[ride.id.toString()].length > 0 ? (
                      <ul className="space-y-2 mt-2">
                        {ridePayments[ride.id.toString()].map((payment) => (
                          <li key={payment.id} className="text-sm">
                            <strong>Passenger:</strong> {payment.username} <br />
                            <strong>Address:</strong> {payment.passengerWalletAddress} <br />
                            <strong>Amount Paid:</strong> {payment.amountPaidInEthers} cUSD <br />
                            <strong>Paid At:</strong> {new Date(Number(payment.paidAt) * 1000).toLocaleString()}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-200">No payments yet.</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-white">No rides available.</p>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
