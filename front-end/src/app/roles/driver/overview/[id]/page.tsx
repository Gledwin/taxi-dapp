"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Ride } from "@/entities/taxiRide";
import Footer from "@/components/footer";
import { Payment } from "@/entities/payments";
import { getAllPaymentsByRideId } from "@/services/getPaymentsByRide";
import { getUserByWalletAddress } from "@/services/getUserByWalletAddress";
import { getRideById } from "@/services/getRideById";
import { FaUser, FaCar, FaMapMarkerAlt, FaMoneyBill, FaCalendarAlt } from "react-icons/fa";


interface PaymentWithUser extends Payment {
  username: string;
}

interface RideWithEarnings extends Ride {
  totalEarnings: number;
  payments: PaymentWithUser[];
}

export default function RideOverview( ) {
  const [rideWithEarnings, setRideWithEarnings] = useState<RideWithEarnings | null>(null);
  const { id: rideId } = useParams();
  const searchParams = useSearchParams();
  const passedAddress = searchParams.get("address") as `0x${string}`;

  useEffect(() => {
    if (!rideId || !passedAddress) return;

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
              passedAddress,
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
  }, [rideId, passedAddress]);

  return (
    <>
      <main className="flex flex-col items-center p-6 text-black min-h-screen">
        <h4 className="text-3xl font-extrabold pt-6 pb-2 text-green-800">Ride Overview</h4>

        {rideWithEarnings ? (
          <div className="space-y-8 max-w-4xl w-full bg-gradient-to-r from-green-500 to-yellow-500 text-black p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <FaMapMarkerAlt className="mr-2" />
              <span className="font-bold">Destination:</span>
              <p className="ml-2">{rideWithEarnings.destination}</p>
            </div>
            <div className="flex items-center mb-4">
              <FaMoneyBill className="mr-2" />
              <span className="font-bold">Total Earnings:</span>
              <p className="ml-2">{rideWithEarnings.totalEarnings.toFixed(2)} ETH</p>
            </div>
            <div className="flex flex-col space-y-2">
              <h5 className="font-bold mb-2">Payments</h5>
              <ul>
                {rideWithEarnings.payments.map((payment, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span>{payment.username}</span>
                    <span>{Number(payment.amountPaidInEthers).toFixed(2)} ETH</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p>No ride data available.</p>
        )}
      </main>

      <Footer />
    </>
  );
}
