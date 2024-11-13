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

interface PassengerPageProps {
  address: `0x${string}`;
  payments: Payment[];
  message: string | null;
  setMessage: (message: string | null) => void;
  taxiUser: TaxiUser;
}

export default function PassengerPage({
  address,
  payments,
  message,
  setMessage,
  taxiUser,
}: PassengerPageProps) {
  const [rides, setRides] = useState<Ride[]>([]);
  const [numPeoplePayingFor, setNumPeoplePayingFor] = useState(1);
  const [balance, setBalance] = useState<string>("0");
  const [allPayments, setAllPayments] = useState<Payment[]>([]);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const fetchBalance = async () => {
    try {
      const currentBalance = await getBalance(address);
      setBalance(currentBalance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const fetchPayments = async () => {
    try {
      const paymentsData = await getAllPayments();
      const userPayments = paymentsData.filter(
        (payment) => payment.passengerWalletAddress === address
      );
      setAllPayments(userPayments);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allRides = await getAllRides();
        setRides(allRides);
        await fetchPayments();
        await fetchBalance();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingData(false); // End loading state after data is fetched
      }
    };

    fetchData();
  }, [address]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message, setMessage]);

  const handlePayForRide = async (rideId: number) => {
    const ride = rides.find((ride) => ride.id === rideId);

    if (ride) {
      const fareInWei = parseUnits(ride.fareInEthers.toString(), 18) * BigInt(numPeoplePayingFor);

      try {
        setLoadingPayment(true); // Start loading
        const success = await payForRide(address, {
          _rideId: rideId,
          fareAmount: fareInWei,
          _numPeoplePayingFor: numPeoplePayingFor,
        });
        setMessage(success ? `Payment for ride ${rideId} successful!` : `Payment for ride ${rideId} failed.`);

        if (success) {
          await fetchBalance();
          await fetchPayments();
          window.location.reload(); // Refresh the page after successful payment
        }
      } catch (error) {
        console.error("Payment error:", error);
        setMessage(`Payment for ride ${rideId} encountered an error.`);
      } finally {
        setLoadingPayment(false); // End loading
      }
    } else {
      setMessage("Ride not found.");
    }
  };

  const groupedPayments = allPayments.reduce((acc, payment) => {
    const date = new Date(payment.paidAt * 1000).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(payment);
    return acc;
  }, {} as Record<string, Payment[]>);

  return (
    <>
      {(loadingData || loadingPayment) && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-75 bg-gray-800 z-50">
          <div className="text-center text-white text-lg font-bold">
            {loadingPayment ? "Processing Payment..." : "Loading Data..."}
          </div>
        </div>
      )}

      <main className="flex flex-col items-center p-6 shadow-lg">
        <h4 className="text-2xl font-bold pt-4 pb-2 text-black">Passenger Dashboard</h4>
        <p className="text-lg">
          Welcome, <span className="font-bold">{taxiUser?.username || "Guest"}</span>!
        </p>

        {message && (
          <div className="fixed top-0 left-0 right-0 p-4 text-center z-50 text-white bg-gradient-to-r from-green-500 to-yellow-500 shadow-lg">
            {message}
          </div>
        )}

        {/* Balance Display */}
        <div className="bg-gradient-to-r from-green-500 to-yellow-500 text-white p-4 rounded-lg shadow-md w-full max-w-md mt-4 text-center">
          <h5 className="text-lg font-bold">Current balance</h5>
          <p className="text-xl font-semibold">{balance} cUSD</p>
        </div>

        {/* Rides List */}
        <div className="mt-6 bg-gradient-to-r from-green-500 to-yellow-500 p-4 rounded-lg shadow-md w-full max-w-md">
          <h3 className="text-black font-bold mb-2">Available Rides</h3>
          {rides.filter(ride => !ride.isCompleted).length > 0 ? (
            <ul className="space-y-4">
              {rides.filter(ride => !ride.isCompleted).map((ride) => (
                <li key={ride.id} className="bg-gradient-to-r from-yellow-500 to-green-500 p-4 rounded-lg shadow-md">
                  <p><strong>Destination:</strong> {ride.destination}</p>
                  <p><strong>Driver's name:</strong> {ride.driverName}</p>
                  <p><strong>Number plate:</strong> {ride.licensePlate}</p>
                  <p><strong>Fare per Passenger:</strong> {ride.fareInEthers} cUSD</p>
                  <p><strong>Passengers Remaining:</strong> {ride.numPassengers}</p>
                  <label htmlFor={`numPeople-${ride.id}`} className="block mt-2 font-medium text-gray-700">
                    Number of Passengers to Pay For:
                  </label>
                  <input
                    id={`numPeople-${ride.id}`}
                    type="number"
                    value={numPeoplePayingFor}
                    onChange={(e) => setNumPeoplePayingFor(Number(e.target.value))}
                    min={1}
                    max={ride.numPassengers}
                    className="w-full mt-1 p-2 border rounded"
                  />
                  <button className="bg-green-500 text-white px-4 py-2 rounded mt-2" onClick={() => handlePayForRide(ride.id)}>
                    Pay for Ride
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No rides available.</p>
          )}
        </div>

        {/* Payments List Categorized by Date */}
        <div className="mt-6 bg-gradient-to-r from-green-500 to-yellow-500 p-4 rounded-lg shadow-md w-full max-w-md">
          <h5 className="text-black font-bold mb-2">Your Payments</h5>
          {Object.keys(groupedPayments).length > 0 ? (
            Object.entries(groupedPayments).map(([date, payments]) => (
              <div key={date} className="mb-4">
                <h6 className="text-lg font-bold mb-2">{date}</h6>
                <ul className="space-y-4">
                  {payments.map((payment) => {
                    const ride = rides.find((ride) => ride.id === payment.rideId);
                    return (
                      <li key={payment.id} className="p-4 rounded-lg shadow-md">
                        <p><strong>Ride ID:</strong> {payment.rideId}</p>
                        <p><strong>Amount Paid:</strong> {payment.amountPaidInEthers} cUSD</p>
                        <p><strong>Paid At:</strong> {new Date(payment.paidAt * 1000).toLocaleString()}</p>
                        {ride && (
                          <>
                            <p><strong>Destination:</strong> {ride.destination}</p>
                            <p><strong>Driver's name:</strong> {ride.driverName}</p>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          ) : (
            <p>No payments found.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
