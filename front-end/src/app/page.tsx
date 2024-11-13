"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { TaxiUser } from "@/entities/taxiUser";
import { getUserByWalletAddress } from "@/services/getUserByWalletAddress";
import { checkIfUserExists } from "@/services/checkIfUserExists";
import { getAllPayments } from "@/services/getAllPayment";
import { getDriverRides } from "@/services/getDriverRides";
import BecomeAUser from "./become-a-user/page";
import PassengerPage from "./roles/passenger/passengerPage";
import DriverPage from "./roles/driver/driverPage";
import { Ride } from "@/entities/taxiRide";
import { Payment } from "@/entities/payments";
import FunSpinner from "@/components/spinner";


export default function Home() {
  const [userExists, setUserExists] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { address, isConnected } = useAccount();
  const [taxiUser, setTaxiUser] = useState<TaxiUser | null>(null);
  const [rides, setRides] = useState<Ride[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const initializeUser = async () => {
      if (isConnected && address) {
        try {
          setIsLoading(true);
          const doesUserExist = await checkIfUserExists(address);
          setUserExists(doesUserExist);

         if (doesUserExist) {
           const fetchedTaxiUser = await getUserByWalletAddress(address, { _walletAddress: address });

            if (fetchedTaxiUser) {  // Check if fetchedTaxiUser is not null
              setTaxiUser(fetchedTaxiUser);

              if (fetchedTaxiUser.isDriver) {
                const driverRides = await getDriverRides(address);
                setRides(driverRides);
              } else {
                const allPayments = await getAllPayments();
                const userPayments = allPayments.filter(payment => payment.passengerWalletAddress === address);
                setPayments(userPayments);
              }
            }
          }

          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, [address, isConnected]);

  if (!isConnected || !address) {
  return (
    <main className="flex h-screen items-center justify-center bg-gradient-to-r from-yellow-500 to-green-500">
      <p className="text-white">Connect your wallet to access the taxi system.</p>
    </main>
  );
}


  if (isLoading) {
    return (
      <FunSpinner />

    )
    

    
  }
  return userExists && taxiUser ? (
    taxiUser.isDriver ? (
      <DriverPage address={address} rides={rides} message={message} setMessage={setMessage} taxiUser={taxiUser} />
    ) : (
      <PassengerPage address={address} payments={payments} message={message} setMessage={setMessage} taxiUser={taxiUser} />
    )
  ) : (
    <BecomeAUser />
  );
  
}
