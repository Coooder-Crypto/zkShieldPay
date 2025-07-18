"use client";

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";
import { PropsWithChildren } from "react";

export const WalletProvider = ({ children }: PropsWithChildren) => {
  const dappConfig = {
    network: Network.TESTNET,
  };

  return (
    <AptosWalletAdapterProvider
      dappConfig={dappConfig}
      autoConnect={false}
      onError={(error) => {
        console.error("Wallet error:", error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};