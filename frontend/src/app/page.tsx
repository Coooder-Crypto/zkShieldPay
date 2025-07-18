"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "@/components/WalletSelector";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { 
  Aptos,
  AptosConfig,
  Network,
  EntryFunction,
  TransactionPayload,
  Serializer,
  MoveString,
  MoveVector,
  U8,
  InputTransactionData,
  InputViewFunctionJsonData
} from "@aptos-labs/ts-sdk";

// Contract address
const CONTRACT_ADDRESS = "0xc8c349e6536fc857aaeb779bd7af30ea59f3d8eb55019218b95cc3c1547ffe81";

// Mock zk addresses mapping to real addresses
const ZK_ADDRESS_MAPPING = {
  "0x8bd63db745202c8cfe12155a8432e8492e82d4667e14a6270fbc9c9afd0098ed": "0zk8bd63db745202c8cfe12155a8432e8492e82d4667e14a6270fbc9c9afd0098ed",
  "0xb0996e81bda9475bf1ad135f64b7064e97c193b428aecfa580530f4bd1cc1877": "0zkb0996e81bda9475bf1ad135f64b7064e97c193b428aecfa580530f4bd1cc1877"
};

// Aptos client for testnet
const TESTNET_CLIENT = new Aptos(new AptosConfig({ network: Network.TESTNET }));

export default function Home() {
  const { connected, account, signAndSubmitTransaction } = useWallet();
  const [showShieldModal, setShowShieldModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [isShielded, setIsShielded] = useState(true); // true = shield mode (dark), false = unshield mode (light)
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [shieldedBalance, setShieldedBalance] = useState(0);

  // Get current mock zk address based on wallet address
  const currentZkAddress = account?.address ? 
    ZK_ADDRESS_MAPPING[account.address.toString() as keyof typeof ZK_ADDRESS_MAPPING] || 
    `0zk${account.address.toString().slice(2)}` // Fallback for addresses not in mapping
    : null;

  // Load shielded balance from localStorage on component mount
  useEffect(() => {
    if (account?.address) {
      const stored = localStorage.getItem(`shielded_balance_${account.address.toString()}`);
      if (stored) {
        setShieldedBalance(parseFloat(stored));
      }
    }
  }, [account?.address]);

  // Save shielded balance to localStorage whenever it changes
  useEffect(() => {
    if (account?.address) {
      localStorage.setItem(`shielded_balance_${account.address.toString()}`, shieldedBalance.toString());
    }
  }, [shieldedBalance, account?.address]);

  // Fetch wallet balance
  useEffect(() => {
    if (account?.address) {
      const fetchBalance = async () => {
        try {
          const payload: InputViewFunctionJsonData = {
            function: "0x1::coin::balance",
            typeArguments: ["0x1::aptos_coin::AptosCoin"],
            functionArguments: [account.address.toString()],
          };
          const [balance] = await TESTNET_CLIENT.viewJson<[number]>({ payload });
          setWalletBalance(balance * 1e-8); // Convert from octas to APT
        } catch (error) {
          console.error("Failed to fetch balance:", error);
        }
      };
      fetchBalance();
      
      // Refresh balance every 10 seconds
      const interval = setInterval(fetchBalance, 10000);
      return () => clearInterval(interval);
    }
  }, [account?.address]);

  const handleShieldToggle = async () => {
    if (amount.length === 0 || isNaN(parseFloat(amount)) || parseFloat(amount) < 0) {
      setMessage("Please enter a valid amount (0 or greater)");
      return;
    }

    setIsLoading(true);
    setMessage("");
    
    try {
      // Call the appropriate contract function
      const contractFunction = isShielded ? "shield_apt" : "unshield_apt";
      
      console.log(`Calling ${contractFunction} with zkId: "${currentZkAddress}", amount: ${amount}`);
      
      // Convert amount to octas and zkId to bytes
      const amountInOctas = (parseFloat(amount) * 100000000).toString();
      const zkIdBytes = Array.from(new TextEncoder().encode(currentZkAddress || ""));
      
      const transaction = {
        data: {
          function: `${CONTRACT_ADDRESS}::zk_pay::${contractFunction}`,
          functionArguments: [zkIdBytes, amountInOctas],
          typeArguments: [],
        },
      };

      console.log("Test transaction payload:", transaction);
      console.log("signAndSubmitTransaction function:", typeof signAndSubmitTransaction);
      console.log("Connected:", connected);
      console.log("Account:", account);
      
      if (!signAndSubmitTransaction) {
        throw new Error("signAndSubmitTransaction function is not available");
      }
      
      if (!connected || !account) {
        throw new Error("Wallet not connected or account not available");
      }
      
      console.log("Attempting to sign test transaction...");
      const result = await signAndSubmitTransaction(transaction);
      console.log(`Test transaction result:`, result);
      
      // Simulate loading for 1.5 seconds
      setTimeout(() => {
        const transactionAmount = parseFloat(amount);
        
        // Update balances based on shield/unshield action
        if (isShielded) {
          // Shielding: move from wallet to shielded
          setShieldedBalance(prev => prev + transactionAmount);
        } else {
          // Unshielding: move from shielded to wallet
          setShieldedBalance(prev => Math.max(0, prev - transactionAmount));
        }
        
        setIsShielded(!isShielded);
        setIsLoading(false);
        setShowShieldModal(false);
        setAmount("");
        setMessage(`${contractFunction} transaction successful!`);
        
        // Clear message after 3 seconds
        setTimeout(() => {
          setMessage("");
        }, 3000);
      }, 1500);
    } catch (error) {
      console.error(`${isShielded ? 'Shield' : 'Unshield'} transaction failed:`, error);
      setIsLoading(false);
      setMessage(`Transaction failed: ${(error as any)?.message || "Unknown error"}`);
    }
  };

  if (!connected) {
    return (
      <div className="relative min-h-screen bg-gray-900">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-purple-500/20 rounded-full filter blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-pink-500/20 rounded-full filter blur-[100px] animate-pulse" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-6 pt-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient">zk</span>
              <span className="text-white">Shield</span>
              <span className="text-gradient">Pay</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto">
              A <span className="text-gradient font-semibold">privacy payment</span> wallet 
              powered by <span className="text-gradient font-semibold">Zero-Knowledge Proof</span> technology
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <WalletSelector />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isShielded ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Navbar */}
      <Navbar isShielded={isShielded} />
      
      {/* Background Grid */}
      <div className={`absolute inset-0 grid-bg opacity-20 transition-opacity duration-700 ${isShielded ? 'opacity-20' : 'opacity-10'}`} />
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`p-8 rounded-xl ${isShielded ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}>
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
              <p className={`text-sm font-medium ${isShielded ? 'text-white' : 'text-gray-900'}`}>
                {isShielded ? 'Switching to public mode...' : 'Switching to shield mode...'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Dashboard */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Balance Card */}
        <div className="max-w-md mx-auto mb-8">
          <div className={`rounded-xl p-6 text-center backdrop-blur-xl transition-all duration-700 border ${
            isShielded 
              ? 'bg-gray-800/30 border-white/10 shadow-lg shadow-purple-500/10' 
              : 'bg-white/40 border-gray-300/30 shadow-lg shadow-gray-500/10'
          }`}>
            {/* Account Info */}
            <div className="mb-6">
              <div className={`text-sm font-light mb-1 transition-colors duration-700 ${
                isShielded ? 'text-white' : 'text-gray-900'
              }`}>test</div>
              <div className={`flex items-center justify-center gap-2 font-mono text-sm transition-colors duration-700 ${
                isShielded ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <span>{account?.address ? 
                  isShielded ? 
                    currentZkAddress ? `${currentZkAddress.slice(0, 8)}...${currentZkAddress.slice(-6)}` : 'No zk address' : 
                    `${account.address.toString().slice(0, 8)}...${account.address.toString().slice(-6)}` 
                  : 'No address'}</span>
                <button className={`p-1 rounded transition-colors duration-300 ${
                  isShielded ? 'hover:bg-white/10' : 'hover:bg-gray-800/10'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Balance */}
            <div className="mb-2">
              <div className={`text-4xl font-bold transition-colors duration-700 ${
                isShielded ? 'text-white' : 'text-gray-900'
              }`}>{(isShielded ? shieldedBalance : walletBalance).toFixed(4)} APT</div>
              <div className={`text-xs mt-1 transition-colors duration-700 ${
                isShielded ? 'text-gray-500' : 'text-gray-600'
              }`}>{isShielded ? 'Shielded balance' : 'Wallet balance'}</div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <button className={`flex-1 rounded-lg py-3 px-4 text-sm font-medium transition-all duration-700 flex items-center justify-center gap-2 ${
                isShielded 
                  ? 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700' 
                  : 'bg-gray-200 border border-gray-300 text-gray-900 hover:bg-gray-300'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
                Send
              </button>
              <button className={`flex-1 rounded-lg py-3 px-4 text-sm font-medium transition-all duration-700 flex items-center justify-center gap-2 ${
                isShielded 
                  ? 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700' 
                  : 'bg-gray-200 border border-gray-300 text-gray-900 hover:bg-gray-300'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                </svg>
                Receive
              </button>
              <button 
                onClick={() => setShowShieldModal(true)}
                className={`flex-1 rounded-lg py-3 px-4 text-sm font-medium transition-all duration-700 flex items-center justify-center gap-2 ${
                  isShielded 
                    ? 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700' 
                    : 'bg-gray-200 border border-gray-300 text-gray-900 hover:bg-gray-300'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {isShielded ? "Unshield" : "Shield"}
              </button>
            </div>
          </div>
        </div>

        {/* Shielded Tokens Section */}
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h2 className={`text-lg font-semibold transition-colors duration-700 ${
                isShielded ? 'text-white' : 'text-gray-900'
              }`}>Shielded tokens</h2>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className={`flex items-center rounded-lg px-3 py-2 transition-all duration-700 ${
                isShielded 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-gray-200 border border-gray-300'
              }`}>
                <svg className={`w-4 h-4 mr-2 transition-colors duration-700 ${
                  isShielded ? 'text-gray-400' : 'text-gray-600'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search" 
                  className={`bg-transparent text-sm outline-none w-24 transition-colors duration-700 ${
                    isShielded ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
              
              {/* Refresh */}
              <button className={`p-2 rounded-lg transition-all duration-700 ${
                isShielded 
                  ? 'bg-gray-800 border border-gray-700 hover:bg-gray-700' 
                  : 'bg-gray-200 border border-gray-300 hover:bg-gray-300'
              }`}>
                <svg className={`w-4 h-4 transition-colors duration-700 ${
                  isShielded ? 'text-white' : 'text-gray-900'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              
              {/* Add */}
              <button className={`p-2 rounded-lg transition-all duration-700 ${
                isShielded 
                  ? 'bg-gray-800 border border-gray-700 hover:bg-gray-700' 
                  : 'bg-gray-200 border border-gray-300 hover:bg-gray-300'
              }`}>
                <svg className={`w-4 h-4 transition-colors duration-700 ${
                  isShielded ? 'text-white' : 'text-gray-900'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Token List */}
          <div className="space-y-3">
            {/* Wrapped Ether */}
            <div className={`flex items-center rounded-lg p-4 h-14 transition-all duration-700 ${
              isShielded ? 'bg-gray-800' : 'bg-gray-200'
            }`}>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">W</span>
              </div>
              <div className="flex-1">
                <div className={`text-sm font-medium transition-colors duration-700 ${
                  isShielded ? 'text-white' : 'text-gray-900'
                }`}>Wrapped Ether</div>
                <div className={`text-xs transition-colors duration-700 ${
                  isShielded ? 'text-gray-400' : 'text-gray-600'
                }`}>WETH • $ 0.00</div>
              </div>
              <div className="text-right">
                <div className={`font-bold transition-colors duration-700 ${
                  isShielded ? 'text-white' : 'text-gray-900'
                }`}>$ 0.00</div>
                <div className={`text-xs transition-colors duration-700 ${
                  isShielded ? 'text-gray-400' : 'text-gray-600'
                }`}>0.00</div>
              </div>
            </div>

            {/* Aptos Token */}
            <div className={`flex items-center rounded-lg p-4 h-14 transition-all duration-700 ${
              isShielded ? 'bg-gray-800' : 'bg-gray-200'
            }`}>
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <div className="flex-1">
                <div className={`text-sm font-medium transition-colors duration-700 ${
                  isShielded ? 'text-white' : 'text-gray-900'
                }`}>Aptos Token</div>
                <div className={`text-xs transition-colors duration-700 ${
                  isShielded ? 'text-gray-400' : 'text-gray-600'
                }`}>APT</div>
              </div>
              <div className="text-right">
                <div className={`font-bold transition-colors duration-700 ${
                  isShielded ? 'text-white' : 'text-gray-900'
                }`}>{(isShielded ? shieldedBalance : walletBalance).toFixed(4)} APT</div>
                <div className={`text-xs transition-colors duration-700 ${
                  isShielded ? 'text-gray-400' : 'text-gray-600'
                }`}>{isShielded ? shieldedBalance.toFixed(4) : walletBalance.toFixed(4)}</div>
              </div>
            </div>

            {/* USDC */}
            <div className={`flex items-center rounded-lg p-4 h-14 transition-all duration-700 ${
              isShielded ? 'bg-gray-800' : 'bg-gray-200'
            }`}>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">U</span>
              </div>
              <div className="flex-1">
                <div className={`text-sm font-medium transition-colors duration-700 ${
                  isShielded ? 'text-white' : 'text-gray-900'
                }`}>USD Coin</div>
                <div className={`text-xs transition-colors duration-700 ${
                  isShielded ? 'text-gray-400' : 'text-gray-600'
                }`}>USDC • $ 0.00</div>
              </div>
              <div className="text-right">
                <div className={`font-bold transition-colors duration-700 ${
                  isShielded ? 'text-white' : 'text-gray-900'
                }`}>$ 0.00</div>
                <div className={`text-xs transition-colors duration-700 ${
                  isShielded ? 'text-gray-400' : 'text-gray-600'
                }`}>0.00</div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {message && message.includes('successful') && (
          <div className="max-w-2xl mx-auto mt-4">
            <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/10">
              <p className="text-sm text-green-400 text-center">{message}</p>
            </div>
          </div>
        )}

        {/* Shield/Unshield Modal */}
        {showShieldModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className={`border rounded-xl p-8 w-full max-w-lg mx-4 transition-all duration-300 ${
              isShielded 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-300'
            }`}>
              <div className="text-center mb-8">
                <svg className="w-16 h-16 text-purple-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
                  isShielded ? 'text-white' : 'text-gray-900'
                }`}>
                  {isShielded ? "Unshield Assets" : "Shield Assets"}
                </h3>
                <p className={`text-sm transition-colors duration-300 ${
                  isShielded ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Enter amount to {isShielded ? "unshield" : "shield"} your assets
                </p>
              </div>

              <div className="space-y-6">
                {/* Amount Input */}
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                    isShielded ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Amount (APT)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                      isShielded 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter amount (e.g., 0.1)"
                    step="0.01"
                  />
                </div>


                {/* Error Message */}
                {message && (
                  <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/10">
                    <p className="text-sm text-red-400">{message}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => {
                    setShowShieldModal(false);
                    setAmount("");
                    setMessage("");
                  }}
                  className={`flex-1 border rounded-lg py-3 px-4 text-sm font-medium transition-all duration-300 ${
                    isShielded 
                      ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleShieldToggle}
                  className="flex-1 bg-purple-600 border border-purple-500 rounded-lg py-3 px-4 text-white text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={amount.length === 0 || isNaN(parseFloat(amount)) || parseFloat(amount) < 0 || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </div>
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}