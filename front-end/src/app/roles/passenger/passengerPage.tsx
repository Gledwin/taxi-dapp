import { useEffect, useState } from "react";
import { parseUnits } from "viem";
import { Ride } from "@/entities/taxiRide";
import { Payment } from "@/entities/payments";
import { payForRide } from "@/services/payForRide";
import { getAllRides } from "@/services/getAllRides";
import { getBalance } from "@/services/getBalance";
import { getAllPayments } from "@/services/getAllPayment";
import Footer from "@/components/footer";
import { TaxiUser } from "@/entities/taxiUser";
import {
  FaCar,
  FaSearch,
  FaExclamationCircle,
  FaMoneyBillWave,
  FaUsers,
  FaMoneyBill,
  FaIdBadge,
  FaUserTie,
  FaCloud,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";
import FunSpinner from "@/components/spinner";

interface PassengerPageProps {
  address: `0x${string}`;
  payments: Payment[];
  message: string | null;
  setMessage: (message: string | null) => void;
  taxiUser: TaxiUser;
}

export default function PassengerPage({
  address,
  message,
  setMessage,
  taxiUser,
}: PassengerPageProps) {
  const [rides, setRides] = useState<Ride[]>([]);
  const [allPayments, setAllPayments] = useState<Payment[]>([]);
  const [balance, setBalance] = useState<string>("0");
  const [numPeoplePayingFor, setNumPeoplePayingFor] = useState(1);
  const [activeTab, setActiveTab] = useState<"Rides" | "Payments">("Rides");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false); // Payment-specific loader state


  // State for toggling years and months
  const [expandedYears, setExpandedYears] = useState<Record<number, Record<string, boolean>>>({});


  const fetchBalance = async () => {
    try {
      const currentBalance = await getBalance(address);
      setBalance(currentBalance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const rides = await getAllRides();
        const payments = await getAllPayments();
        const userBalance = await getBalance(address);

        setRides(rides);
        setAllPayments(payments.filter((payment) => payment.passengerWalletAddress === address));
        setBalance(userBalance);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [address]);

  const handlePayForRide = async (rideId: number) => {
    const ride = rides.find((ride) => ride.id === rideId);
    if (!ride) {
      setMessage("Ride not found.");
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    const fareInWei =
      parseUnits(ride.fareInEthers.toString(), 18) *
      BigInt(numPeoplePayingFor);

    setIsPaying(true);
    try {
      const success = await payForRide(address, {
        _rideId: rideId,
        fareAmount: fareInWei,
        _numPeoplePayingFor: numPeoplePayingFor,
      });

      setMessage(
        success
          ? `Payment for ride ${rideId} successful!`
          : `Payment for ride ${rideId} failed.`
      );
      if (success) {
        await getBalance(address).then(setBalance);
        await getAllPayments().then((data) =>
          setAllPayments(
            data.filter(
              (payment) => payment.passengerWalletAddress === address
            )
          )
        );

        setTimeout(() => {
          setMessage(null);
          window.location.reload();
        }, 5000);
      } else {
        setTimeout(() => setMessage(null), 5000);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setMessage(`Error processing payment for ride ${rideId}.`);
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setIsPaying(false);
    }
  };
  

  const toggleYear = (year: number) => {
    setExpandedYears((prevState) => ({
      ...prevState,
      [year]: prevState[year] ? { ...prevState[year], expanded: !prevState[year].expanded } : { expanded: true },
    }));
  };

  const toggleMonth = (year: number, month: string) => {
    setExpandedYears((prevState) => ({
      ...prevState,
      [year]: {
        ...prevState[year],
        [month]: !prevState[year]?.[month],
      },
    }));
  };

  const inProgressRides = rides.filter(
    (ride) => !ride.isCompleted && ride.licensePlate.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedPaymentsByMonthAndYear = allPayments.reduce((acc, payment) => {
    const date = new Date(payment.paidAt * 1000);
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "long" });

    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = [];
    acc[year][month].push(payment);

    return acc;
  }, {} as Record<number, Record<string, Payment[]>>);


  return (
    <>

    {isPaying && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-75 bg-gray-800 z-50">
          <div className="text-center text-white text-lg font-bold">
            Processing Payment...
          </div>
        </div>
      )}
      <div className="flex flex-col items-center p-6 ">
        <p className="text-lg text-green-800">
          Welcome, <span className="font-bold text-green-800">{taxiUser?.username || "Guest"}</span>!
        </p>

        {message && (
          <div className="fixed top-0 left-0 right-0 p-4 text-center z-50 text-white bg-green-800 shadow-lg">
            {message}
          </div>
        )}

       <div className="bg-green-800 text-white p-4 rounded-lg shadow-md w-full max-w-md mt-4 text-center">
          <h5 className="text-lg font-bold">Your Current balance</h5>
          <p className="text-xl font-semibold">{balance} cUSD</p>
        </div>

        <div className="flex w-full max-w-md mt-4">
          <button
            className={`flex-1 py-2 rounded-l-lg ${
              activeTab === "Rides" ? "bg-green-800 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("Rides")}
          >
            Rides
          </button>
          <button
            className={`flex-1 py-2 rounded-r-lg ${
              activeTab === "Payments" ? "bg-green-800 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("Payments")}
          >
            Your payments
          </button>
        </div>

        {activeTab === "Rides" && (
          <div className="mt-6 w-full max-w-md">
            {/* Search Bar */}
            <div className="flex items-center justify-between mb-6">
              <FaSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search by license plate"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow p-3 text-sm border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
              />
            </div>
            {/* Ride List */}
            <div className="bg-white p-5 rounded-lg shadow-lg">
              <h3 className="text-lg font-extrabold text-gray-800 mb-4">
                <FaCar className="inline mr-2" />
                Available Rides
              </h3>
              {rides.length === 0 ? (
                <p className="text-center text-gray-600 font-medium bg-gray-200 p-4 rounded-lgfont-medium">
                  <FaExclamationCircle className="inline mr-2" />
                  No rides available.
                </p>
              ) : inProgressRides.length > 0 ? (
                <ul className="space-y-6">
                  {inProgressRides.map((ride) => (
                    <li
                      key={ride.id}
                      className="bg-white p-5 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl"
                    >
                      <div className="mb-3">
                        <span className="bg-green-700 text-white text-sm font-bold px-3 py-1 rounded-full mr-3">
                          #{ride.id}
                        </span>
                        <h4 className="inline-block text-lg font-semibold text-gray-900">{ride.destination}</h4>
                      </div>
                      <p className="text-gray-800 mb-2">
                        <strong>
                          <FaUserTie className="inline mr-1" /> Driver:
                        </strong>{" "}
                        {ride.driverName}
                      </p>
                      <p className="text-gray-800 mb-2">
                        <strong>
                          <FaIdBadge className="inline mr-1" /> License Plate:
                        </strong>{" "}
                        <span className="bg-gray-200 text-gray-900 text-sm px-2 py-1 rounded">{ride.licensePlate}</span>
                      </p>
                      <p className="text-gray-800 mb-4">
                        <strong>
                          <FaMoneyBill className="inline mr-1" /> Fare:
                        </strong>{" "}
                        {ride.fareInEthers} cUSD
                      </p>
                      <p className="text-gray-800 mb-4">
                        <strong>
                          <FaUsers className="inline mr-1" /> Passengers Still to Pay:
                        </strong>{" "}
                        {ride.numPassengers}
                      </p>

                      <label className="block mb-2 font-semibold text-gray-600">
                        Number of Passengers to Pay For:
                      </label>
                      <input
                        type="number"
                        className="block w-full mb-4 border border-gray-300 rounded-lg p-2 text-sm"
                        value={numPeoplePayingFor}
                        onChange={(e) => setNumPeoplePayingFor(Number(e.target.value))}
                        min={1}
                        max={ride.numPassengers}
                      />
                      <button
                        onClick={() => handlePayForRide(ride.id)}
                        className="block w-full text-center bg-green-800 text-white font-bold py-2 rounded-lg shadow-md hover:bg-teal-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        Pay now
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-600 font-medium">
                  <FaExclamationCircle className="inline mr-2" />
                  No matching rides found.
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === "Payments" && (
          <div className="mt-6 w-full max-w-md">
            <h3 className="text-lg font-extrabold text-green-800 mb-4">
              <FaMoneyBillWave className="inline mr-2" />
              Payment History
            </h3>

            {Object.keys(groupedPaymentsByMonthAndYear).length > 0 ? (
              Object.entries(groupedPaymentsByMonthAndYear).map(([year, months]) => (
                <div key={year} className="mb-6">
                  <h4
                    className="text-xl font-extrabold text-green-800 border-b border-gray-400 pb-2 mb-4 cursor-pointer flex justify-between items-center"
                    onClick={() => toggleYear(Number(year))}
                  >
                    {year}
                    <span>
                      {expandedYears[Number(year)]?.expanded ? "▼" : <FaCloud/>}
                    </span>
                  </h4>
                  {expandedYears[Number(year)]?.expanded &&
                    Object.entries(months).map(([month, payments]) => (
                      <div key={month} className="mb-4">
                        <h6
                          className="text-lg font-semibold text-green-800  mb-3 cursor-pointer flex justify-between items-center"
                          onClick={() => toggleMonth(Number(year), month)}
                        >
                          {month}
                          <span>
                            {expandedYears[Number(year)]?.[month] ? "▼" : <FaCloud/>}
                          </span>
                        </h6>
                        {expandedYears[Number(year)]?.[month] &&
                payments.map((payment) => {
                  const rideDetails = rides.find((ride) => ride.id === payment.rideId);
                  return (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 rounded-lg shadow-lg bg-white transition-transform hover:scale-105"
                    >
                      <div>
                        <p className="text-sm text-gray-500">
                          <FaCar className="inline mr-1 text-yellow-500" />
                          Ride ID:{" "}
                          <span className="font-bold text-gray-700">{payment.rideId}</span>
                        </p>
                        {rideDetails && (
                          <>
                          <p className="text-sm text-gray-500">
                              <FaUserTie className="inline mr-1 text-purple-500" />
                              Driver:{" "}
                              <span className="font-bold text-gray-700">{rideDetails.driverName}</span>
                            </p>
                            <p className="text-sm text-gray-500">
                              <FaCloud className="inline mr-1 text-green-500" />
                              Destination:{" "}
                              <span className="font-bold text-gray-700">{rideDetails.destination}</span>
                            </p>
                            <p className="text-sm text-gray-500">
                              <FaIdBadge className="inline mr-1 text-blue-500" />
                              License Plate:{" "}
                              <span className="font-bold text-gray-700">{rideDetails.licensePlate}</span>
                            </p>
                          </>
                        )}
                        <p className="text-sm text-gray-500">
                          <FaMoneyBill className="inline mr-1 text-green-500" />
                          Amount Paid:{" "}
                          <span className="font-bold text-gray-700">
                            {payment.amountPaidInEthers} cUSD
                          </span>
                        </p>
                        <p className="text-sm text-gray-500">
                          <FaCalendarAlt className="inline mr-1 text-blue-500" />
                          Paid At:{" "}
                          <span className="font-bold text-gray-700">
                            {new Date(payment.paidAt * 1000).toLocaleString()}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center justify-center bg-yellow-400 text-white w-10 h-10 rounded-full shadow-md">
                                <FaCheckCircle className="text-xl" />
                              </div>
                            </div>
                          );
                        })}

                      </div>
                    ))}
                </div>
              ))
            ) : (
              <p className="text-center text-black font-medium bg-gray-200 p-4 rounded-lg">
                <FaExclamationCircle className="inline mr-2" />
                No payment history available.
              </p>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
