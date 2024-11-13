"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Import useParams instead of useRouter
import { Ride } from "@/entities/taxiRide";
import Footer from "@/components/footer";
import { Payment } from "@/entities/payments";
import { getAllPaymentsByRideId } from "@/services/getPaymentsByRide";
import { getUserByWalletAddress } from "@/services/getUserByWalletAddress";
import { getRideById } from "@/services/getRideById";
import { FaUser, FaCar, FaMapMarkerAlt, FaMoneyBill, FaCalendarAlt } from "react-icons/fa";

interface RideOverviewProps {
  address: `0x${string}`;
}

interface PaymentWithUser extends Payment {
  username: string;
}

interface RideWithEarnings extends Ride {
  totalEarnings: number;
  payments: PaymentWithUser[];
}

export default function RideOverview({ address }: RideOverviewProps) {
  const [rideWithEarnings, setRideWithEarnings] = useState<RideWithEarnings | null>(null);
  const { id: rideId } = useParams(); // Use useParams to get rideId

  useEffect(() => {
    if (!rideId) return;

    const fetchRideWithEarnings = async () => {
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
            const user = await getUserByWalletAddress(
              address,
              { _walletAddress: payment.passengerWalletAddress }
            );
            return {
              ...payment,
              username: user?.username || payment.passengerWalletAddress,
            };
          })
      );

      const totalEarnings = validPayments.reduce((acc, payment) => acc + Number(payment.amountPaidInEthers), 0);

      setRideWithEarnings({
        ...ride,
        totalEarnings,
        payments: validPayments,
      });
    };

    fetchRideWithEarnings();
  }, [rideId, address]);

  return (
    <>
      <main className="flex flex-col items-center p-6 text-black min-h-screen">
        <h4 className="text-3xl font-extrabold pt-6 pb-2 text-green-800">Ride Overview</h4>

        {rideWithEarnings ? (
          <div className="space-y-8 max-w-4xl w-full">
            <div className="bg-white shadow-lg rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Driver and Vehicle Info */}
              <div className="flex flex-col space-y-2 p-4 bg-gradient-to-r from-green-500 to-yellow-500 rounded-lg shadow-md">
                <div className="flex items-center space-x-2">
                  <FaUser className="text-xl text-green-800" />
                  <p><strong>Driver:</strong> {rideWithEarnings.driverName}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCar className="text-xl text-green-800" />
                  <p><strong>License Plate:</strong> {rideWithEarnings.licensePlate}</p>
                </div>
              </div>

              {/* Trip Info */}
              <div className="flex flex-col space-y-2 p-4 bg-gradient-to-r from-green-500 to-yellow-500 rounded-lg shadow-md">
                <div className="flex items-center space-x-2">
                  <FaMapMarkerAlt className="text-xl text-blue-800" />
                  <p><strong>Destination:</strong> {rideWithEarnings.destination}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCalendarAlt className="text-xl text-yellow-800" />
                  <p><strong>Created At:</strong> {new Date(Number(rideWithEarnings.updatedAt) * 1000).toLocaleString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <FaMoneyBill className="text-xl text-blue-800" />
                  <p><strong>Fare:</strong> {rideWithEarnings.fareInEthers} cUSD</p>
                </div>
                <div className="flex items-center space-x-2">
                  <FaUser className="text-xl text-blue-800" />
                  <p><strong>Passengers still yet to pay:</strong> {rideWithEarnings.numPassengers}</p>
                </div>
              </div>

              {/* Earnings and Completion Info */}
              <div className="flex flex-col space-y-2 p-4 bg-gradient-to-r from-green-500 to-yellow-500 rounded-lg shadow-md md:col-span-2">
                <div className="flex items-center space-x-2">
                  <FaMoneyBill className="text-xl text-yellow-800" />
                  <p><strong>Total Earnings:</strong> {rideWithEarnings.totalEarnings.toFixed(2)} cUSD</p>
                </div>
              </div>

              {/* Payments Section */}
              <div className="md:col-span-2 mt-4">
                <h6 className="font-bold text-lg mb-2 text-center text-green-800">Payments</h6>
                {rideWithEarnings.payments.length > 0 ? (
                  <ul className="space-y-2">
                    {rideWithEarnings.payments.map((payment) => (
                      <li key={payment.id} className="flex flex-col space-y-1 bg-gradient-to-r from-green-500 to-yellow-500 rounded-md p-4 shadow-md">
                        <p><strong>Passenger:</strong> {payment.username}</p>
                        <p><strong>Address:</strong> {payment.passengerWalletAddress}</p>
                        <p><strong>Amount Paid:</strong> {payment.amountPaidInEthers.toString()} cUSD</p>
                        <p><strong>Paid At:</strong> {new Date(Number(payment.paidAt) * 1000).toLocaleString()}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-gray-500">No payments available.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-white">No completed ride found.</p>
        )}
      </main>

      <Footer />
    </>
  );
}
