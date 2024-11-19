"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Ride } from "@/entities/taxiRide";
import Footer from "@/components/footer";
import { Payment } from "@/entities/payments";
import { getAllPaymentsByRideId } from "@/services/getPaymentsByRide";
import { getUserByWalletAddress } from "@/services/getUserByWalletAddress";
import { getRideById } from "@/services/getRideById";
import FunSpinner from "@/components/spinner";
import {
  FaUser,
  FaCar,
  FaMapMarkerAlt,
  FaMoneyBill,
  FaCalendarAlt,
} from "react-icons/fa";
import { formatEther } from "viem"; // Import for conversion


interface PaymentWithUser extends Payment {
  username: string;
}

interface RideWithEarnings extends Ride {
  totalEarnings: number;
  payments: PaymentWithUser[];
}

export default function RideOverview() {
  const [rideWithEarnings, setRideWithEarnings] = useState<RideWithEarnings | null>(null);
  const [loading, setLoading] = useState(true); // Loading state
  const { id: rideId } = useParams();

  useEffect(() => {
    if (!rideId) return;

    const fetchRideWithEarnings = async () => {
      setLoading(true); // Set loading to true
      try {
        const ride = await getRideById(Number(rideId));
        if (!ride || !ride.isCompleted) {
          setRideWithEarnings(null);
          return;
        }

        const payments = await getAllPaymentsByRideId(ride.id);

        const validPayments = await Promise.all(
          payments
            .filter(payment => payment.passengerWalletAddress !== "0x0000000000000000000000000000000000000000")
            .map(async (payment) => {
              const user = await getUserByWalletAddress(undefined, {
                _walletAddress: payment.passengerWalletAddress,
              });
              return {
                ...payment,
                username: user?.username || payment.passengerWalletAddress,
              };
            })
        );

        const totalEarnings = validPayments.reduce(
          (acc, payment) => acc + Number(payment.amountPaidInEthers),
          0
        );

        setRideWithEarnings({
          ...ride,
          totalEarnings,
          payments: validPayments,
        });
      } catch (error) {
        console.error("Error fetching ride data:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchRideWithEarnings();
  }, [rideId]);

  if (loading) {
    return <FunSpinner />; 
  }

  return (
    <>
      <main className="flex flex-col items-center p-6 text-black min-h-screen">
        {/* Heading */}
        <h4 className="text-4xl font-extrabold py-6 text-green-800">Ride Overview 🚖</h4>

        {rideWithEarnings ? (
          <div className="space-y-8 max-w-5xl w-full">
            {/* Ride Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-green-800 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300">
                <h5 className="text-lg font-bold text-white mb-4">Driver Information</h5>
                <p className="flex items-center text-white space-x-2">
                  <FaUser className="text-xl" />
                  <span><strong>Name:</strong> {rideWithEarnings.driverName}</span>
                </p>
                <p className="flex items-center text-white space-x-2">
                  <FaCar className="text-xl " />
                  <span><strong>License Plate:</strong> {rideWithEarnings.licensePlate}</span>
                </p>
              </div>

              <div className="p-6 bg-green-800 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300">
                <h5 className="text-lg font-bold text-white mb-4">Trip Details</h5>
                <div>
                  <p className="flex items-center text-white space-x-2">
                    <FaMapMarkerAlt className="text-xl " />
                    <span><strong>Destination:</strong> {rideWithEarnings.destination}</span>
                  </p>
                </div>
                <div>
                  <p className="flex items-center text-white  space-x-2">
                    <FaCalendarAlt className="text-xl " />
                    <span><strong>Date:</strong> {new Date(Number(rideWithEarnings.updatedAt) * 1000).toLocaleString()}</span>
                  </p>
                </div>
                <div>
                  <p className="flex items-center text-white space-x-2">
                    <FaMoneyBill className="text-xl" />
                    <span><strong>Fare:</strong>  {formatEther(BigInt(rideWithEarnings.fareInEthers))} cUSD</span>
                  </p>
                </div>
                <div>
                  <p className="flex items-center text-white space-x-2">
                    <FaUser className="text-xl" />
                    <span><strong>Passengers who did not pay:</strong> {rideWithEarnings.numPassengers}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Earnings Section */}
            <div className="p-6 bg-green-800 rounded-lg shadow-lg text-center hover:scale-105 transform transition-all duration-300">
              <h5 className="text-xl font-bold text-white mb-2">Total Earnings</h5>
              <p className="text-3xl font-extrabold text-white">
                {formatEther(BigInt(rideWithEarnings.totalEarnings))} cUSD
              </p>
            </div>

            {/* Payments Section */}
            <div className="mt-8">
              <h5 className="font-bold text-3xl text-green-700 text-center mb-8">
                Passenger Payments
              </h5>
              {rideWithEarnings.payments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rideWithEarnings.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="relative bg-green-800 shadow-lg rounded-xl p-6 border border-gray-200 transform hover:scale-105 transition-transform duration-300"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <FaUser className="text-white text-3xl" />
                          <div>
                            <p className="text-lg font-bold text-white">{payment.username}</p>
                            <p className="text-sm text-white break-all">
                              {payment.passengerWalletAddress}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Details */}
                      <div className="space-y-3 text-white">
                        <p className=" text-lg">
                          <strong>Paid:</strong> {formatEther(BigInt(payment.amountPaidInEthers.toString()))} cUSD
                        </p>
                        <p className=" text-lg">
                          <strong>Paid at:</strong> {new Date(Number(payment.paidAt) * 1000).toLocaleString()}
                        </p>
                      </div>

                      {/* Decorative Badge */}
                      <div className="absolute top-4 right-4 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        PAID
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600">No payments available yet.</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-red-500 mt-10">No completed ride found.</p>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
