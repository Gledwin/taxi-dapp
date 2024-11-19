import { createPublicClient, custom } from "viem";
import { celo } from "viem/chains";
import { taxiContractABI } from "@/utils/abis/taxiContractABI";
import { taxiContractAddress } from "@/utils/addresses/taxiContractAddress";
import { Ride } from "@/entities/taxiRide"; // Assuming you have an entity for Ride

// Define the type expected from the contract
type RideContractResponse = {
  id: bigint;
  driverWalletAddress:  `0x${string}`;
  destination: string;
  fareInEthers: number;
  createdAt: bigint;
  updatedAt: bigint;
  isBooked: boolean;
  isPaid: boolean;
  isCompleted: boolean;
  numPassengers: bigint;
  totalFare: bigint;
  driverName: string;
  licensePlate: string;
};

export const getRideById = async (rideId: number): Promise<Ride | null> => {
  if (window.ethereum) {
    const publicClient = createPublicClient({
      chain: celo,
      transport: custom(window.ethereum),
    });

    try {
      // Cast the result to the RideContractResponse type
      const rideToBeParsed = await publicClient.readContract({
        address: taxiContractAddress,
        abi: taxiContractABI,
        functionName: "getRideById",
        args: [rideId],
      }) as RideContractResponse;

      const ride: Ride = {
        id: Number(rideToBeParsed.id),
        driverWalletAddress: rideToBeParsed.driverWalletAddress,
        destination: rideToBeParsed.destination,
        fareInEthers: Number(rideToBeParsed.fareInEthers),
        createdAt: Number(rideToBeParsed.createdAt),
        updatedAt: Number(rideToBeParsed.updatedAt),
        isBooked: rideToBeParsed.isBooked,
        isPaid: rideToBeParsed.isPaid,
        isCompleted: rideToBeParsed.isCompleted,
        isBlank: false,
        numPassengers: Number(rideToBeParsed.numPassengers),
        totalFare: Number(rideToBeParsed.totalFare),
        driverName: rideToBeParsed.driverName,
        licensePlate: rideToBeParsed.licensePlate,
      };

      return ride;
    } catch (err) {
      console.error("Error fetching ride:", err);
      return null;
    }
  }
  return null;
};
