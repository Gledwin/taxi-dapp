import { createPublicClient, createWalletClient, custom } from "viem";
import { celoAlfajores } from "viem/chains";
import { taxiContractABI } from "@/utils/abis/taxiContractABI";
import { taxiContractAddress } from "@/utils/addresses/taxiContractAddress";
import { cUSDAlfajoresContractABI } from "@/utils/abis/cUSDAlfajoresContractABI"; 
import { cUSDAlfajoresContractAddress } from "@/utils/addresses/cUSDAlfajoresContractAddresses";

export const payForRide = async (
  _signerAddress: `0x${string}` | undefined,
  { _rideId, fareAmount, _numPeoplePayingFor }: PayForRideProps
): Promise<boolean> => {
  if (window.ethereum) {
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
      const approveTxnHash = await privateClient.writeContract({
        account: address,
        address: cUSDAlfajoresContractAddress,
        abi: cUSDAlfajoresContractABI,
        functionName: "approve",
        args: [taxiContractAddress, fareAmount],
      });

      await publicClient.waitForTransactionReceipt({
        hash: approveTxnHash,
      });

      const payForRideTxnHash = await privateClient.writeContract({
        account: address,
        address: taxiContractAddress,
        abi: taxiContractABI,
        functionName: "payForRide",
        args: [_rideId, _numPeoplePayingFor],
      });

      const payForRideTxnReceipt = await publicClient.waitForTransactionReceipt({
        hash: payForRideTxnHash,
      });

      return payForRideTxnReceipt.status === "success";
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
  _numPeoplePayingFor: number;
};
