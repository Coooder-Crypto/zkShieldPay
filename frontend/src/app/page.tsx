"use client";

import { WalletSelector } from "@/components/WalletSelector";
import { TransactionDemo } from "@/components/TransactionDemo";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gray-900">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Main Glow */}
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-purple-500/20 rounded-full filter blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-pink-500/20 rounded-full filter blur-[100px] animate-pulse" />

        {/* Decorative Lines */}
        <div className="absolute inset-0">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent opacity-50"
              style={{
                top: `${25 + i * 25}%`,
                left: '10%',
                right: '10%',
              }}
            />
          ))}
        </div>

        {/* Floating Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-500/30 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-gradient">zk</span>
            <span className="text-white">Shield</span>
            <span className="text-gradient">Pay</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto">
            A <span className="text-gradient font-semibold">privacy payment</span> wallet 
            powered by <span className="text-gradient font-semibold">Zero-Knowledge Proof</span> technology, 
            providing secure and anonymous transaction experiences 
            for the <span className="text-gradient font-semibold">Aptos</span> ecosystem.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button className="hero-button glow-hover">
              🛡️ Get Started
            </button>
            <button className="px-8 py-4 rounded-xl border border-purple-500/20 text-purple-400 font-medium text-lg hover:bg-purple-500/10 transition-colors">
              📖 Learn More
            </button>
          </div>
        </div>
        
        {/* Wallet & Transaction Section */}
        <div className="max-w-6xl mx-auto space-y-8">
          <WalletSelector />
          <TransactionDemo />
        </div>
      </div>
    </div>
  );
}