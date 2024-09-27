import { createPublicClient, createWalletClient, custom } from "viem";
import { celoAlfajores } from "viem/chains";
import { taxiContractABI } from "@/utils/abis/taxiContractABI";
import { taxiContractAddress } from "@/utils/addresses/taxiContractAddress";
import { cUSDAlfajoresContractABI } from "@/utils/abis/cUSDAlfajoresContractABI"; 
import { cUSDAlfajoresContractAddress } from "@/utils/addresses/cUSDAlfajoresContractAddresses";

export const payForRide = async (
  _signerAddress: `0x${string}` | undefined,
  { _rideId, fareAmount }: PayForRideProps
): Promise<boolean> => {
  if (window.ethereum) {
    // Create wallet and public clients
    const privateClient = createWalletClient({
      chain: celoAlfajores,
      transport: custom(window.ethereum),
    });
    const publicClient = createPublicClient({
      chain: celoAlfajores,
      transport: custom(window.ethereum),
    });

    const [address] = await privateClient.getAddresses();

    try {
      // Step 1: Approve cUSD transfer to the contract
      const approveTxnHash = await privateClient.writeContract({
        account: address,
        address: cUSDAlfajoresContractAddress, // cUSD token contract address
        abi: cUSDAlfajoresContractABI,         // cUSD token ABI
        functionName: "approve",   // Approve cUSD transfer
        args: [taxiContractAddress, fareAmount], // Approve contract to transfer fareAmount
      });

      await publicClient.waitForTransactionReceipt({
        hash: approveTxnHash,
      });

      // Step 2: Trigger the payForRide function in the taxi contract
      const payForRideTxnHash = await privateClient.writeContract({
        account: address,
        address: taxiContractAddress,
        abi: taxiContractABI,
        functionName: "payForRide",
        args: [_rideId],
      });

      // Wait for transaction receipt to confirm success
      const payForRideTxnReceipt = await publicClient.waitForTransactionReceipt({
        hash: payForRideTxnHash,
      });

      if (payForRideTxnReceipt.status === "success") {
        return true; // Payment succeeded
      }
      return false;
    } catch (error) {
      console.error("Error paying for ride:", error);
      return false;
    }
  }
  return false;
};

type PayForRideProps = {
  _rideId: number;
  fareAmount: bigint;
}
