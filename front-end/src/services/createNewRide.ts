import {
    createPublicClient,
    createWalletClient,
    custom,
    parseEther, // Utility for converting Ether to Wei
    formatEther, // Utility for converting Wei to Ether
} from "viem";
import { celo } from "viem/chains";
import { taxiContractABI } from "@/utils/abis/taxiContractABI";
import { taxiContractAddress } from "@/utils/addresses/taxiContractAddress";

export const createNewRide = async (
    {
        _destination,
        _fareInEthers,
        _numPassengers,
        _totalFare,
        _driverName,
        _licensePlate,
    }: CreateRideProps
): Promise<boolean> => {
    if (window.ethereum) {
        // Initialize the wallet client to handle transactions
        const privateClient = createWalletClient({
            chain: celo,
            transport: custom(window.ethereum),
        });

        // Initialize the public client to retrieve the transaction receipt
        const publicClient = createPublicClient({
            chain: celo,
            transport: custom(window.ethereum),
        });

        // Get the connected wallet address
        const [address] = await privateClient.getAddresses();

        try {
            // Convert Ether values to Wei before sending to the contract
            const fareInWei = parseEther(`${_fareInEthers}`);
            const totalFareInWei = parseEther(`${_totalFare}`);

            // Call the `createRide` function from the smart contract with updated arguments
            const createRideTxnHash = await privateClient.writeContract({
                account: address,
                address: taxiContractAddress, // Smart contract address
                abi: taxiContractABI,         // Smart contract ABI
                functionName: "createRide",   // The function in the smart contract
                args: [
                    _destination,
                    fareInWei,
                    _numPassengers,
                    totalFareInWei,
                    _driverName,
                    _licensePlate,
                ],
            });

            // Wait for the transaction to be mined and retrieve the receipt
            const createRideTxnReceipt = await publicClient.waitForTransactionReceipt({
                hash: createRideTxnHash,
            });

            // Check if the transaction was successful
            return createRideTxnReceipt.status === "success";
        } catch (err) {
            console.error("Error creating ride:", err);
            return false;
        }
    }

    // Return false if `window.ethereum` is not available
    return false;
};

// Define the types for the props passed to the `createNewRide` function
export type CreateRideProps = {
    _destination: string;
    _fareInEthers: number; // Fractional Ether value
    _numPassengers: number;
    _totalFare: number; // Fractional Ether value
    _driverName: string;
    _licensePlate: string;
};
