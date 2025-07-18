"use client";

import { WalletSelector } from "@/components/WalletSelector";
import { TransactionDemo } from "@/components/TransactionDemo";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            我的 Aptos 钱包
          </h1>
          <p className="text-gray-600">
            一个基于 Aptos 区块链的简单网页钱包
          </p>
        </div>
        
        <div className="space-y-6">
          <WalletSelector />
          <TransactionDemo />
        </div>
      </div>
    </div>
  );
}