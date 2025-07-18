"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "@/components/WalletSelector";
import { useState } from "react";

export default function Home() {
  const { connected, account } = useWallet();
  const [showUnshieldModal, setShowUnshieldModal] = useState(false);
  const [password, setPassword] = useState("");
  const [isShielded, setIsShielded] = useState(true); // true = unshield, false = shield

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
    <div className="min-h-screen bg-gray-900">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      
      {/* Main Dashboard */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Balance Card */}
        <div className="max-w-md mx-auto mb-8">
          <div className="glass border-gradient rounded-xl p-6 text-center backdrop-blur-xl bg-gray-800/20 border border-white/10">
            {/* Account Info */}
            <div className="mb-6">
              <div className="text-sm text-white font-light mb-1">test</div>
              <div className="flex items-center justify-center gap-2 text-gray-400 font-mono text-sm">
                <span>{account?.address ? `${account.address.toString().slice(0, 8)}...${account.address.toString().slice(-6)}` : 'No address'}</span>
                <button className="p-1 hover:bg-white/10 rounded transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Balance */}
            <div className="mb-2">
              <div className="text-4xl font-bold text-white">$ 0.00</div>
              <div className="text-xs text-gray-500 mt-1">Pending balances: $ 0.00</div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <button className="flex-1 bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
                Send
              </button>
              <button className="flex-1 bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                </svg>
                Receive
              </button>
              <button 
                onClick={() => setShowUnshieldModal(true)}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
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
              <h2 className="text-lg font-semibold text-white">Shielded tokens</h2>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
                <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="bg-transparent text-white text-sm outline-none w-24"
                />
              </div>
              
              {/* Refresh */}
              <button className="p-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              
              {/* Add */}
              <button className="p-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Token List */}
          <div className="space-y-3">
            {/* Wrapped Ether */}
            <div className="flex items-center bg-gray-800 rounded-lg p-4 h-14">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">W</span>
              </div>
              <div className="flex-1">
                <div className="text-white text-sm font-medium">Wrapped Ether</div>
                <div className="text-gray-400 text-xs">WETH • $ 0.00</div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">$ 0.00</div>
                <div className="text-gray-400 text-xs">0.00</div>
              </div>
            </div>

            {/* Aptos Token */}
            <div className="flex items-center bg-gray-800 rounded-lg p-4 h-14">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <div className="flex-1">
                <div className="text-white text-sm font-medium">Aptos Token</div>
                <div className="text-gray-400 text-xs">APT • $ 0.00</div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">$ 0.00</div>
                <div className="text-gray-400 text-xs">0.00</div>
              </div>
            </div>

            {/* USDC */}
            <div className="flex items-center bg-gray-800 rounded-lg p-4 h-14">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">U</span>
              </div>
              <div className="flex-1">
                <div className="text-white text-sm font-medium">USD Coin</div>
                <div className="text-gray-400 text-xs">USDC • $ 0.00</div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">$ 0.00</div>
                <div className="text-gray-400 text-xs">0.00</div>
              </div>
            </div>
          </div>
        </div>

        {/* Unshield Password Modal */}
        {showUnshieldModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md mx-4">
              <div className="text-center mb-6">
                <svg className="w-12 h-12 text-purple-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {isShielded ? "Unshield Assets" : "Shield Assets"}
                </h3>
                <p className="text-gray-400 text-sm">
                  Enter your password to {isShielded ? "unshield" : "shield"} your assets
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowUnshieldModal(false);
                    setPassword("");
                  }}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-gray-300 text-sm font-medium hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Mock password validation (any password works)
                    if (password.length > 0) {
                      setIsShielded(!isShielded);
                      setShowUnshieldModal(false);
                      setPassword("");
                    }
                  }}
                  className="flex-1 bg-purple-600 border border-purple-500 rounded-lg py-2 px-4 text-white text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={password.length === 0}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}