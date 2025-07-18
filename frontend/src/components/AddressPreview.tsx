"use client";

interface AddressPreviewProps {
  isShielded: boolean;
  currentAddress: string;
  zkAddress: string;
}

export default function AddressPreview({ 
  isShielded, 
  currentAddress, 
  zkAddress 
}: AddressPreviewProps) {
  const formatAddress = (address: string) => {
    if (!address) return "No address";
    return `${address.slice(0, 10)}...${address.slice(-8)}`;
  };

  return (
    <div className={`p-4 rounded-lg border transition-all duration-300 ${
      isShielded 
        ? 'bg-gray-700/30 border-gray-600/50' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <span className={`text-sm font-medium ${
            isShielded ? 'text-gray-300' : 'text-gray-700'
          }`}>Current Address</span>
        </div>
        <div className={`px-3 py-1 rounded text-xs font-mono ${
          isShielded 
            ? 'bg-gray-600/50 text-gray-300 border border-gray-600' 
            : 'bg-white text-gray-600 border border-gray-300'
        }`}>
          {formatAddress(isShielded ? zkAddress : currentAddress)}
        </div>
      </div>
      
      <div className="flex items-center justify-center mb-4">
        <div className={`p-2 rounded-full ${
          isShielded ? 'bg-purple-500/10' : 'bg-gray-200'
        }`}>
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
          <span className={`text-sm font-medium ${
            isShielded ? 'text-gray-300' : 'text-gray-700'
          }`}>Switch to Address</span>
        </div>
        <div className={`px-3 py-1 rounded text-xs font-mono ${
          isShielded 
            ? 'bg-gray-600/50 text-gray-300 border border-gray-600' 
            : 'bg-white text-gray-600 border border-gray-300'
        }`}>
          {formatAddress(!isShielded ? zkAddress : currentAddress)}
        </div>
      </div>
    </div>
  );
}