"use client";

import { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

export default function Navbar() {
  const { connected, account, wallet } = useWallet();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 z-50">
      {/* Background */}
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-xl border-b border-purple-500/10" />

      {/* Content */}
      <div className="relative container mx-auto h-full px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-bold">Z</span>
          </div>
          <div>
            <span className="text-xl font-bold">
              <span className="text-gradient">zk</span>
              <span className="text-white">Shield</span>
              <span className="text-gradient">Pay</span>
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            Home
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            Transactions
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            Privacy Pool
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            Docs
          </a>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Network Status */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="text-xs text-green-400">Testnet</span>
          </div>

          {/* User Info */}
          {connected && account ? (
            <div className="relative">
              <button 
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-500/10 transition-colors"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-[1px]">
                  <div className="w-full h-full rounded-lg bg-gray-900 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {wallet?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-white">
                    {account.address?.toString()?.slice(0, 6)}...{account.address?.toString()?.slice(-4)}
                  </p>
                  <div className="flex items-center">
                    <div className="px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                      <span className="text-xs text-purple-400">Connected</span>
                    </div>
                  </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 py-2 bg-gray-900/95 rounded-lg border border-purple-500/10 backdrop-blur-xl">
                  <div className="px-4 py-2 border-b border-gray-800">
                    <p className="text-sm font-medium text-white">zkShield User</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                        <span className="text-xs text-purple-400">🛡️ Privacy Protected</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-400">Wallet</span>
                      <span className="text-sm text-white">{wallet?.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Privacy Level</span>
                      <span className="text-sm text-green-400">🛡️ Advanced</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="px-3 py-1 rounded-lg bg-gray-700/30 border border-purple-500/20">
              <span className="text-xs text-gray-400">Disconnected</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}