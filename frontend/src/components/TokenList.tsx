"use client";

interface TokenListProps {
  isShielded: boolean;
  shieldedBalance: number;
  walletBalance: number;
}

export default function TokenList({ 
  isShielded, 
  shieldedBalance, 
  walletBalance 
}: TokenListProps) {
  return (
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
        {/* Aptos Token */}
        <div className={`flex items-center rounded-lg p-4 h-14 transition-all duration-700 ${
          isShielded ? 'bg-gray-800' : 'bg-gray-200'
        }`}>
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-sm font-bold">APT</span>
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
            <span className="text-white text-xs font-bold">USDC</span>
          </div>
          <div className="flex-1">
            <div className={`text-sm font-medium transition-colors duration-700 ${
              isShielded ? 'text-white' : 'text-gray-900'
            }`}>USD Coin</div>
            <div className={`text-xs transition-colors duration-700 ${
              isShielded ? 'text-gray-400' : 'text-gray-600'
            }`}>USDC</div>
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

        {/* USDT */}
        <div className={`flex items-center rounded-lg p-4 h-14 transition-all duration-700 ${
          isShielded ? 'bg-gray-800' : 'bg-gray-200'
        }`}>
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-xs font-bold">USDT</span>
          </div>
          <div className="flex-1">
            <div className={`text-sm font-medium transition-colors duration-700 ${
              isShielded ? 'text-white' : 'text-gray-900'
            }`}>Tether USD</div>
            <div className={`text-xs transition-colors duration-700 ${
              isShielded ? 'text-gray-400' : 'text-gray-600'
            }`}>USDT</div>
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
  );
}