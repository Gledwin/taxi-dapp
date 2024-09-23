"use client";

import StekcitNavBar from "../components/navbar";
import { fonts } from "./fonts";
import { ThemeProvider } from "./providers";

import {
  RainbowKitProvider,
  connectorsForWallets,
  getDefaultConfig,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { http, WagmiProvider } from "wagmi";
import { celo, celoAlfajores } from "wagmi/chains";

import {
  rainbowWallet,
  walletConnectWallet,
  injectedWallet,
  metaMaskWallet,
} from "@rainbow-me/rainbowkit/wallets";

import "./globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: "Stekcit BwC",
  projectId: process.env.WALLETCONNECT_PROJECT_ID!,
  chains: [celo, celoAlfajores],
  transports: {
    [celo.id]: http(),
    [celoAlfajores.id]: http(),
  },
  ssr: true,
  wallets: [
    {
      groupName: "Recommended",
      wallets: [
        injectedWallet,
        rainbowWallet,
        walletConnectWallet,
        metaMaskWallet,
      ],
    },
  ],
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fonts.dmSans.variable}>
      <head>
        <title>taxi system</title>
      </head>
      <body>
        <ThemeProvider>
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider
                theme={lightTheme({
                  accentColor: "#EA1845",
                  accentColorForeground: "white",
                  borderRadius: "large",
                  fontStack: "rounded",
                  overlayBlur: "small",
                })}
              >
                <StekcitNavBar />
                <div>{children}</div>
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
