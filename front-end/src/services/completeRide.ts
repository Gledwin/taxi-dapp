import {
    createPublicClient,
    createWalletClient,
    custom
} from "viem";
import { celo } from "viem/chains";
import { taxiContractABI } from "@/utils/abis/taxiContractABI";
import { taxiContractAddress } from "@/utils/addresses/taxiContractAddress";

export const completeRide = async (
    _signerAddress: `0x${string}` | undefined,
    { _rideId }: CompleteRideProps
): Promise<boolean> => {
    if (window.ethereum) {
        const privateClient = createWalletClient({
            chain: celo,
            transport: custom(window.ethereum),
        });
        const publicClient = createPublicClient({
            chain: celo,
            transport: custom(window.ethereum),
        });

        const [address] = await privateClient.getAddresses();

        try {
            // Log the action for debugging
            console.log(`Attempting to complete ride ID: ${_rideId} by driver: ${address}`);

            // Step 1: Call the 'completeRide' function on the smart contract
            const completeRideTxnHash = await privateClient.writeContract({
                account: address,
                address: taxiContractAddress,
                abi: taxiContractABI,
                functionName: "completeRide", // Call the updated function in the contract
                args: [_rideId], // Pass the ride ID
             
            });

            // Step 2: Wait for the transaction to be mined
            const completeRideTxnReceipt = await publicClient.waitForTransactionReceipt({
                hash: completeRideTxnHash,
            });

            if (completeRideTxnReceipt.status === "success") {
                console.log(`Ride ID: ${_rideId} successfully completed.`);
                return true; // Successfully completed the ride
            } else {
                console.error(`Failed to complete ride ID: ${_rideId}.`);
                return false; // Ride completion failed
            }
        } catch (error) {
            console.error("Error completing ride:", error); // Log the error for debugging
            return false;
        }
    }
    return false;
};

type CompleteRideProps = {
    _rideId: number;
};
