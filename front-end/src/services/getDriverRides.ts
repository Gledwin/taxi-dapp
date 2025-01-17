import { createPublicClient, custom } from "viem";
import { celo} from "viem/chains";
import { taxiContractABI } from "@/utils/abis/taxiContractABI";
import { taxiContractAddress } from "@/utils/addresses/taxiContractAddress";
import { Ride } from "@/entities/taxiRide"; // Assuming you have an entity for Ride

export const getDriverRides = async (driverAddress: string): Promise<Ride[]> => {
  const driverRides: Ride[] = []; // Changed to const
  if (window.ethereum) {
    const publicClient = createPublicClient({
      chain: celo,
      transport: custom(window.ethereum),
    });
    try {
      const fetchedRides = await publicClient.readContract({
        address: taxiContractAddress,
        abi: taxiContractABI,
        functionName: "getDriverRides", // Use the correct function from Solidity contract
        args: [driverAddress], // Pass the driver's wallet address as an argument
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
        driverRides.push(ride);
      }

      return driverRides;
    } catch (err) {
      console.info(err);
      return driverRides;
    }
  }
  return driverRides;
};
