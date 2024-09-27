import { ReactNode } from "react";

export type Ride = {

    id: number;
    driverWalletAddress: `0x${string}`;
    destination: string;
    fareInEthers: number;
    createdAt: number;
    updatedAt: number;
    isBooked: boolean;
    numPassengers: number;
    totalFare: number;
    isCompleted: boolean;
    isPaid: boolean;
    isBlank: boolean;
}