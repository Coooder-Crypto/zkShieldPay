"use client";

import { AccountInfo } from "@aptos-labs/wallet-adapter-react";

interface BalanceCardProps {
  account: AccountInfo;
  isShielded: boolean;
  shieldedBalance: number;
  walletBalance: number;
  getAccountName: (address: string) => string;
  currentZkAddress: string | null;
  onShieldClick: () => void;
  onSendClick: () => void;
  onReceiveClick: () => void;
}

export default function BalanceCard({
  account,
  isShielded,
  shieldedBalance,
  walletBalance,
  getAccountName,
  currentZkAddress,
  onShieldClick,
  onSendClick,
  onReceiveClick
}: BalanceCardProps) {
  return (
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
          }`}>{account?.address ? getAccountName(account.address.toString()) : 'No Account'}</div>
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
          
          {/* Mode Indicator */}
          <div className="flex justify-center mt-3">
            <div className={`px-3 py-1 rounded-full border transition-all duration-700 ${
              isShielded 
                ? 'bg-purple-500/10 border-purple-500/20' 
                : 'bg-gray-200/50 border-gray-300/50'
            }`}>
              <span className={`text-xs font-medium transition-colors duration-700 ${
                isShielded ? 'text-purple-400' : 'text-gray-600'
              }`}>
                {isShielded ? '🛡️ Shield Mode' : '🔓 Public Mode'}
              </span>
            </div>
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
          <button 
            onClick={onSendClick}
            className={`flex-1 rounded-lg py-3 px-4 text-sm font-medium transition-all duration-700 flex items-center justify-center gap-2 ${
              isShielded 
                ? 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700' 
                : 'bg-gray-200 border border-gray-300 text-gray-900 hover:bg-gray-300'
            }`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
            Send
          </button>
          <button 
            onClick={onReceiveClick}
            className={`flex-1 rounded-lg py-3 px-4 text-sm font-medium transition-all duration-700 flex items-center justify-center gap-2 ${
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
            onClick={onShieldClick}
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
  );
}