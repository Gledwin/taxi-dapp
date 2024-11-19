"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Ride } from "@/entities/taxiRide";
import { getAllRides } from "@/services/getAllRides";
import Footer from "@/components/footer";
import Link from "next/link";
import { formatEther } from "viem"; // Import for conversion
import Spinner from "@/components/spinner";
import { FaCalendarAlt, FaMoneyBillWave, FaMapMarkerAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";

function CompletedRidesContent() {
  const [completedRidesByYearMonth, setCompletedRidesByYearMonth] = useState<{ [year: string]: { [month: string]: Ride[] } }>({});
  const [expandedSections, setExpandedSections] = useState<{ [year: string]: { [month: string]: boolean } }>({});
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

        // Group rides by year and month
        const ridesByYearMonth = completedRidesForDriver.reduce((acc, ride) => {
          const rideDate = new Date(Number(ride.updatedAt) * 1000);
          const year = rideDate.getFullYear().toString();
          const month = rideDate.toLocaleDateString("en-US", { month: "long" });

          if (!acc[year]) acc[year] = {};
          if (!acc[year][month]) acc[year][month] = [];
          acc[year][month].push(ride);

          return acc;
        }, {} as { [year: string]: { [month: string]: Ride[] } });

        setCompletedRidesByYearMonth(ridesByYearMonth);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching completed rides:", error);
        setError("Failed to load completed rides.");
        setLoading(false);
      }
    };

    fetchCompletedRides();
  }, [address]);

  const toggleSection = (year: string, month: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [year]: {
        ...prev[year],
        [month]: !prev[year]?.[month],
      },
    }));
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="flex flex-col items-center p-6 text-black shadow-lg min-h-screen bg-gray-100">
      <h4 className="text-3xl font-extrabold pt-6 pb-4 text-green-800">Completed Rides 🚖</h4>

      <section className="mt-8 p-6 w-full max-w-5xl">
        {Object.keys(completedRidesByYearMonth).length > 0 ? (
          Object.entries(completedRidesByYearMonth).map(([year, months]) => (
            <div key={year} className="mb-8">
              <h5 className="text-2xl font-bold text-green-800 mb-4 border-b-2 border-green-600">
                {year}
              </h5>
              {Object.entries(months).map(([month, rides]) => (
                <div key={month} className="mb-6">
                  <div
                    className="flex justify-between items-center cursor-pointer bg-green-200 px-4 py-2 rounded-lg hover:bg-green-300 transition"
                    onClick={() => toggleSection(year, month)}
                  >
                    <span className="text-lg font-bold">{month}</span>
                    {expandedSections[year]?.[month] ? (
                      <FaChevronUp className="text-green-800" />
                    ) : (
                      <FaChevronDown className="text-green-800" />
                    )}
                  </div>
                  {expandedSections[year]?.[month] && (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                      {rides.map((ride) => (
                        <li
                          key={ride.id.toString()}
                          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                        >
                          <Link href={`/roles/driver/overview/${ride.id}`} className="block">
                            
                            <h6 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                              <FaMapMarkerAlt className="text-green-600" /> {ride.destination}
                            </h6>
                            <ul className="space-y-2 text-gray-600 text-sm">
                            <li className="flex items-center gap-2">
                                <strong className="text-green-600">ID:</strong> {ride.id}
                              </li>
                              <li className="flex items-center gap-2">
                                <FaCalendarAlt className="text-green-600" />{" "}
                                <span>
                                  {new Date(Number(ride.updatedAt) * 1000).toLocaleDateString()}
                                </span>
                              </li>
                              <li className="flex items-center gap-2">
                                <FaMoneyBillWave className="text-green-600" />{" "}
                                <span>{formatEther(BigInt(ride.fareInEthers))} cUSD</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <strong className="text-green-600">License plate:</strong> {ride.licensePlate}
                              </li>
                            </ul>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
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
