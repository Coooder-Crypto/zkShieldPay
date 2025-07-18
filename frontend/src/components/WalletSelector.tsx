"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";

export function WalletSelector() {
  const { 
    connect, 
    connected, 
    account, 
    disconnect, 
    wallet,
    wallets 
  } = useWallet();

  // Debug logging
  console.log("Wallet state:", { connected, account, wallet, wallets });

  const handleConnect = async (walletName: string) => {
    try {
      console.log("Attempting to connect wallet:", walletName);
      await connect(walletName);
      console.log("Wallet connected successfully");
    } catch (error) {
      console.error("Connection failed:", error);
      // Display user-friendly error messages
      if (error.message?.includes("Cross-Origin-Opener-Policy")) {
        alert("Wallet connection failed: Please ensure you're using HTTPS access (https://localhost:3000)");
      } else {
        alert(`Wallet connection failed: ${error.message || "Unknown error"}`);
      }
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Disconnect failed:", error);
    }
  };

  if (connected && account) {
    return (
      <div className="card hover-card glow">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3">
              🛡️
            </span>
            Wallet Connected
          </h2>
          <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
            <span className="text-xs text-green-400">● Verified</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-gray-700/30 border border-purple-500/10">
            <span className="text-sm font-medium text-gray-400">Wallet Name</span>
            <div className="flex items-center mt-1">
              {wallet?.icon && (
                <img 
                  src={wallet.icon} 
                  alt={wallet.name}
                  className="w-5 h-5 mr-2"
                />
              )}
              <span className="text-white font-medium">{wallet?.name}</span>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-gray-700/30 border border-purple-500/10">
            <span className="text-sm font-medium text-gray-400">Wallet Address</span>
            <div className="mt-1 text-sm font-mono break-all text-purple-300">
              {account.address?.toString() || "Unknown"}
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-gray-700/30 border border-purple-500/10">
            <span className="text-sm font-medium text-gray-400">Public Key</span>
            <div className="mt-1 text-sm font-mono break-all text-purple-300">
              {account.publicKey?.toString() || "Unknown"}
            </div>
          </div>
        </div>
        
        <button
          onClick={handleDisconnect}
          className="mt-6 w-full px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors flex items-center justify-center"
        >
          <span className="mr-2">🔌</span>
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="card hover-card">
      <div className="flex items-center mb-6">
        <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3">
          💼
        </span>
        <h2 className="text-xl font-semibold text-white">Connect Wallet</h2>
      </div>
      
      <div className="space-y-3">
        {wallets.map((wallet) => (
          <button
            key={wallet.name}
            onClick={() => handleConnect(wallet.name)}
            className="w-full p-4 border border-purple-500/20 rounded-lg hover:bg-purple-500/10 hover:border-purple-500/40 transition-all duration-200 flex items-center space-x-3 group hover-card"
          >
            {wallet.icon && (
              <img 
                src={wallet.icon} 
                alt={wallet.name}
                className="w-6 h-6 group-hover:scale-110 transition-transform"
              />
            )}
            <span className="font-medium text-white group-hover:text-purple-300 transition-colors">
              {wallet.name}
            </span>
            <div className="ml-auto">
              <div className="w-6 h-6 rounded-full border-2 border-purple-500/30 group-hover:border-purple-400 flex items-center justify-center transition-colors">
                <div className="w-2 h-2 rounded-full bg-purple-500/50 group-hover:bg-purple-400"></div>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {wallets.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700/30 flex items-center justify-center">
            <span className="text-2xl">🔍</span>
          </div>
          <p className="text-gray-400 mb-2">No available wallets detected</p>
          <p className="text-sm text-gray-500">Please ensure you have installed supported Aptos wallet extensions</p>
        </div>
      )}
    </div>
  );
}