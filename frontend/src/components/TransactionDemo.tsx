"use client";

import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export function TransactionDemo() {
  const { 
    connected, 
    account, 
    signAndSubmitTransaction,
    network 
  } = useWallet();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendTransaction = async () => {
    if (!connected || !account) {
      setMessage("Please connect your wallet first");
      return;
    }

    if (!recipient || !amount) {
      setMessage("Please fill in recipient address and amount");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // Build transaction data
      const transaction = {
        data: {
          function: "0x1::aptos_coin::transfer",
          arguments: [recipient, (parseFloat(amount) * 100000000).toString()], // Convert to octas
        },
      };

      console.log("Sending transaction:", transaction);

      // Sign and submit transaction
      const result = await signAndSubmitTransaction(transaction);
      
      console.log("Transaction result:", result);
      setMessage(`Transaction successful! Hash: ${result.hash}`);
      
      // Clear form
      setRecipient("");
      setAmount("");
    } catch (error) {
      console.error("Transaction failed:", error);
      setMessage(`Transaction failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="card">
        <div className="flex items-center mb-6">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3">
            🔐
          </span>
          <h2 className="text-xl font-semibold text-white">Privacy Transaction</h2>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <span className="text-2xl">🔒</span>
          </div>
          <p className="text-gray-400 mb-2">Please connect your wallet first</p>
          <p className="text-sm text-gray-500">Start privacy transactions after connecting your wallet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card hover-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3">
            🔐
          </span>
          <h2 className="text-xl font-semibold text-white">Privacy Transaction</h2>
        </div>
        <div className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
          <span className="text-xs text-purple-400">🛡️ ZK Protected</span>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            💼 Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full p-4 bg-gray-700/30 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            💰 Amount (APT)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.001"
            step="0.001"
            min="0"
            className="w-full p-4 bg-gray-700/30 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </div>

        <button
          onClick={handleSendTransaction}
          disabled={isLoading || !recipient || !amount}
          className={`w-full p-4 rounded-lg font-medium text-lg transition-all duration-200 flex items-center justify-center ${
            isLoading || !recipient || !amount
              ? "bg-gray-600/30 text-gray-500 cursor-not-allowed border border-gray-600/20"
              : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 shadow-lg hover:shadow-purple-500/20 glow-hover"
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <span className="mr-2">🚀</span>
              Send Privacy Transaction
            </>
          )}
        </button>

        {message && (
          <div className={`p-4 rounded-lg border ${
            message.includes("successful") 
              ? "bg-green-500/10 border-green-500/20 text-green-400" 
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}>
            <div className="flex items-center">
              <span className="mr-2">
                {message.includes("successful") ? "✅" : "❌"}
              </span>
              {message}
            </div>
          </div>
        )}

        <div className="p-4 bg-gray-700/20 rounded-lg border border-purple-500/10">
          <div className="text-sm text-gray-400 space-y-2">
            <div className="flex justify-between">
              <span>🌐 Network:</span>
              <span className="text-purple-300">{network?.name || "Unknown"}</span>
            </div>
            <div className="flex justify-between">
              <span>👤 Account:</span>
              <span className="text-purple-300 font-mono">
                {account?.address?.toString()?.slice(0, 10)}...
              </span>
            </div>
            <div className="flex justify-between">
              <span>🔐 Privacy Level:</span>
              <span className="text-green-400">🛡️ Advanced Protection</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}