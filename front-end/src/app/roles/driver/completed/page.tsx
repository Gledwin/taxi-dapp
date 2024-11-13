"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Ride } from "@/entities/taxiRide";
import { getAllRides } from "@/services/getAllRides"; 
import Footer from "@/components/footer";
import Link from "next/link";
import Spinner from "@/components/spinner";

function CompletedRidesContent() {
  const [completedRidesByDate, setCompletedRidesByDate] = useState<{ [date: string]: Ride[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const address = searchParams.get("address") as `0x${string}` | null;

  useEffect(() => {
    if (!address) {
      setError("Driver address not provided.");
      setLoading(false);
      return;
    }

    const fetchCompletedRides = async () => {
      try {
        setLoading(true);
        const allRides = await getAllRides();
        const completedRidesForDriver = allRides.filter(
          (ride) => ride.isCompleted && ride.driverWalletAddress === address
        );

        // Group rides by date
        const ridesByDate = completedRidesForDriver.reduce((acc, ride) => {
          const dateKey = new Date(Number(ride.updatedAt) * 1000).toLocaleDateString();
          if (!acc[dateKey]) acc[dateKey] = [];
          acc[dateKey].push(ride);
          return acc;
        }, {} as { [date: string]: Ride[] });

        setCompletedRidesByDate(ridesByDate);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching completed rides:", error);
        setError("Failed to load completed rides.");
        setLoading(false);
      }
    };

    fetchCompletedRides();
  }, [address]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="flex flex-col items-center p-6 text-black shadow-lg min-h-screen">
      <h4 className="text-3xl font-extrabold pt-6 pb-2 text-green-800">Completed Rides 🚖</h4>

      <section className="mt-8 p-6 rounded-lg shadow-md w-full max-w-4xl">
        {Object.keys(completedRidesByDate).length > 0 ? (
          Object.entries(completedRidesByDate).map(([date, rides]) => (
            <div key={date} className="mb-8">
              <h5 className="text-xl font-bold text-green-800 mb-4">{date}</h5>
              <ul className="divide-y divide-gray-600">
                {rides.map((ride) => (
                  <li
                    key={ride.id.toString()}
                    className="py-4 px-4 rounded-lg mb-2 bg-gradient-to-r from-yellow-500 to-green-500"
                  >
                    <Link href={`/roles/driver/overview/${ride.id}`} className="text-white font-bold">
                      <p><strong>Destination:</strong> {ride.destination}</p>
                      <p><strong>Driver's name:</strong> {ride.driverName}</p>
                      <p><strong>License plate:</strong> {ride.licensePlate}</p>
                      <p><strong>Fare:</strong> {ride.fareInEthers} cUSD</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-center text-green-800">No completed rides available.</p>
        )}
      </section>
    </main>
  );
}

export default function CompletedRides() {
  return (
    <Suspense fallback={<Spinner />}>
      <CompletedRidesContent />
      <Footer />
    </Suspense>
  );
}
