import { createPublicClient, custom } from "viem";
import { celoAlfajores } from "viem/chains";
import { taxiContractABI } from "@/utils/abis/taxiContractABI";
import { taxiContractAddress } from "@/utils/addresses/taxiContractAddress";
import { Ride } from "@/entities/taxiRide"; // Assuming you have an entity for Ride

export const getAllRides = async (): Promise<Ride[]> => {
  const allRides: Ride[] = []; // Changed to const
  if (window.ethereum) {
    const publicClient = createPublicClient({
      chain: celoAlfajores,
      transport: custom(window.ethereum),
    });
    try {
      const fetchedRides = await publicClient.readContract({
        address: taxiContractAddress,
        abi: taxiContractABI,
        functionName: "getAllRides", // Assuming this is the correct function name in the Solidity contract
      }) as Ride[]; // Specify the type as Ride[]

      for (let rideId = 0; rideId < fetchedRides.length; rideId++) {
        const rideToBeParsed = fetchedRides[rideId];
        const ride: Ride = {
          id: Number(rideToBeParsed["id"]),
          driverWalletAddress: rideToBeParsed["driverWalletAddress"],
          destination: rideToBeParsed["destination"],
          fareInEthers: Number(rideToBeParsed["fareInEthers"]),
          createdAt: Number(rideToBeParsed["createdAt"]),
          updatedAt: Number(rideToBeParsed["updatedAt"]),
          isBooked: rideToBeParsed["isBooked"],
          isPaid: rideToBeParsed["isPaid"],
          isCompleted: rideToBeParsed["isCompleted"],
          isBlank: false,
          numPassengers: Number(rideToBeParsed["numPassengers"]),
          totalFare: Number(rideToBeParsed["totalFare"]),
          driverName: rideToBeParsed["driverName"],
          licensePlate: rideToBeParsed["licensePlate"]
        };
        allRides.push(ride);
      }

      return allRides;
    } catch (err) {
      console.info(err);
      return allRides;
    }
  }
  return allRides;
};
