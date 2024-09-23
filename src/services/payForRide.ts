import {
    createWalletClient,
    createPublicClient,
    custom
} from "viem";
import { celoAlfajores } from "viem/chains";
import { cUSDAlfajoresContractABI } from "@/utils/abis/cUSDAlfajoresContractABI";
import { cUSDAlfajoresContractAddress } from "@/utils/addresses/cUSDAlfajoresContractAddresses";
import { taxiContractABI } from "@/utils/abis/taxiContractABI";
import { taxiContractAddress } from "@/utils/addresses/taxiContractAddress";

export const payForRide = async (
    _signerAddress: `0x${string}`,
    _rideId: number,
    _fareAmount: number
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

            // Step 1: Approve cUSD transfer to the driver
            const approveTxnHash = await walletClient.writeContract({
                account: address,
                address: cUSDAlfajoresContractAddress,
                abi: cUSDAlfajoresContractABI,
                functionName: "approve",
                args: [taxiContractAddress, _fareAmount],
            });

            const approveTxnReceipt = await publicClient.waitForTransactionReceipt({ hash: approveTxnHash });

            if (approveTxnReceipt.status !== "success") {
                throw new Error("Approval transaction failed.");
            }

            // Step 2: Pay for the ride
            const payRideTxnHash = await walletClient.writeContract({
                account: address,
                address: taxiContractAddress,
                abi: taxiContractABI,
                functionName: "payForRide",
                args: [_rideId],
            });

            const payRideTxnReceipt = await publicClient.waitForTransactionReceipt({
                hash: payRideTxnHash,
            });

            if (payRideTxnReceipt.status === "success") {
                return true;
            } else {
                throw new Error("Payment transaction failed.");
            }

        } catch (error) {
            console.error("Error paying for ride:", error);
            return false;
        }
    }
    return false;
};
