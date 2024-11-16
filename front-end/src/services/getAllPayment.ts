import { createPublicClient, custom } from "viem";
import { celo } from "viem/chains";
import { taxiContractABI } from "@/utils/abis/taxiContractABI";
import { taxiContractAddress } from "@/utils/addresses/taxiContractAddress";
import { Payment } from "@/entities/payments";

export const getAllPayments = async (): Promise<Payment[]> => {
  const allPayments: Payment[] = []; // Changed to const
  if (window.ethereum) {
    const publicClient = createPublicClient({
      chain: celo,
      transport: custom(window.ethereum),
    });
    try {
      const fetchedPayments = await publicClient.readContract({
        address: taxiContractAddress,
        abi: taxiContractABI,
        functionName: "getAllPayments", // Ensure this matches the contract function
      }) as Payment[]; // Specify type as Payment[]

      for (let paymentId = 0; paymentId < fetchedPayments.length; paymentId++) {
        const paymentToBeParsed = fetchedPayments[paymentId];
        const payment: Payment = {
          id: Number(paymentToBeParsed["id"]),
          rideId: Number(paymentToBeParsed["rideId"]),
          passengerWalletAddress: paymentToBeParsed["passengerWalletAddress"],
          amountPaidInEthers: Number(paymentToBeParsed["amountPaidInEthers"]),
          paidAt: Number(paymentToBeParsed["paidAt"]),
          isBlank: false,
          passengerUsername: ""
        };
        allPayments.push(payment);
      }
  
      return allPayments;
    } catch (err) {
      console.info(err);
      return allPayments;
    }
  }
  return allPayments;
};
