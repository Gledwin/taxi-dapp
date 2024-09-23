import { ReactNode } from "react";

export type Payment = {
    id: number;
    rideId: number;
    passengerWalletAddress: `0x${string}`;
    amountPaidInEthers: number;
    isBlank: boolean;
   
}