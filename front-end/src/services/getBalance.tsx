import { createPublicClient, custom, formatUnits } from "viem";
import { celo } from "viem/chains";
import { taxiContractABI } from "@/utils/abis/taxiContractABI";
import { taxiContractAddress } from "@/utils/addresses/taxiContractAddress";

export const getBalance = async (_userAddress: `0x${string}` | undefined): Promise<string> => {
    if (window.ethereum && _userAddress) {
        try {
            const publicClient = createPublicClient({
                chain: celo,
                transport: custom(window.ethereum),
            });

            // Fetch balance from contract
            const balance = await publicClient.readContract({
                address: taxiContractAddress,
                abi: taxiContractABI,
                functionName: "getBalance",
                args: [_userAddress],
            }) as bigint;

            // Convert balance from wei to cUSD with 18 decimals
            return formatUnits(balance, 18); // Returns formatted balance in cUSD as a string
        } catch (error) {
            console.error("Error fetching balance:", error);
            return "0"; // Return zero if there's an error
        }
    }
    return "0";
};
