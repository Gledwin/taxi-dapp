import {
    createWalletClient,
    createPublicClient,
    custom
} from "viem";
import { celoAlfajores } from "viem/chains";
import { taxiContractABI } from "@/utils/abis/taxiContractABI"; // Replace with your ABI
import { taxiContractAddress } from "@/utils/addresses/taxiContractAddress"; // Replace with your contract address

export const bookRide = async (
    _signerAddress: `0x${string}`,
    _rideId: number
): Promise<boolean> => {
    if (window.ethereum) {
        const walletClient = createWalletClient({
            chain: celoAlfajores,
            transport: custom(window.ethereum),
        });
        const publicClient = createPublicClient({
            chain: celoAlfajores,
            transport: custom(window.ethereum),
        });

        try {
            const [address] = await walletClient.getAddresses();

            const bookRideTxnHash = await walletClient.writeContract({
                account: address,
                address: taxiContractAddress,
                abi: taxiContractABI,
                functionName: "bookRide",
                args: [_rideId],
            });

            const bookRideTxnReceipt = await publicClient.waitForTransactionReceipt({
                hash: bookRideTxnHash,
            });

            if (bookRideTxnReceipt.status === "success") {
                return true;
            }
            return false;

        } catch (error) {
            console.error("Error booking ride:", error);
            return false;
        }
    }
    return false;
};
