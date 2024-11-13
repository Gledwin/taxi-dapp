import { createPublicClient, custom } from "viem";
import { celoAlfajores } from "viem/chains";
import { taxiContractABI } from "@/utils/abis/taxiContractABI";
import { taxiContractAddress } from "@/utils/addresses/taxiContractAddress";
import { Payment } from "@/entities/payments";

export const getAllPaymentsByRideId = async (rideId: number): Promise<Payment[]> => {
    const ridePayments: Payment[] = [];
    if (window.ethereum) {
        const publicClient = createPublicClient({
            chain: celoAlfajores,
            transport: custom(window.ethereum),
        });
        try {
            const fetchedPayments = await publicClient.readContract({
                address: taxiContractAddress,
                abi: taxiContractABI,
                functionName: "getAllPaymentsByRideId",
                args: [rideId],
            }) as Payment[]; // Cast to Payment[] type

            if (Array.isArray(fetchedPayments)) {
                fetchedPayments.forEach((fetchedPayment) => {
                    const payment: Payment = {
                      id: Number(fetchedPayment.id),
                      rideId: Number(fetchedPayment.rideId),
                      passengerWalletAddress: fetchedPayment.passengerWalletAddress,
                      amountPaidInEthers: Number(fetchedPayment.amountPaidInEthers),
                      paidAt: Number(fetchedPayment.paidAt),
                      isBlank: fetchedPayment.isBlank,
                      passengerUsername: ""
                    };
                    ridePayments.push(payment);
                });
            } else {
                console.warn("Fetched payments is not a valid array:", fetchedPayments);
            }

            return ridePayments;
        } catch (err) {
            console.info("Error fetching payments:", err);
            return ridePayments;
        }
    }
    return ridePayments;
};
