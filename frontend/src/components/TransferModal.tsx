"use client";

interface TransferModalProps {
  showModal: boolean;
  isShielded: boolean;
  currentZkAddress: string | null;
  receiverAddress: string;
  transferAmount: string;
  isLoading: boolean;
  message: string;
  walletBalance: number;
  onClose: () => void;
  onReceiverChange: (address: string) => void;
  onAmountChange: (amount: string) => void;
  onConfirm: () => void;
}

export default function TransferModal({
  showModal,
  isShielded,
  currentZkAddress,
  receiverAddress,
  transferAmount,
  isLoading,
  message,
  walletBalance,
  onClose,
  onReceiverChange,
  onAmountChange,
  onConfirm
}: TransferModalProps) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`border rounded-xl p-8 w-full max-w-lg mx-4 transition-all duration-300 ${
        isShielded 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-300'
      }`}>
        <div className="text-center mb-8">
          <svg className="w-16 h-16 text-purple-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
          <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
            isShielded ? 'text-white' : 'text-gray-900'
          }`}>
            Send APT
          </h3>
          <p className={`text-sm transition-colors duration-300 ${
            isShielded ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Transfer APT to another zk address
          </p>
        </div>

        <div className="space-y-6">
          {/* Sender Address */}
          <div>
            <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
              isShielded ? 'text-gray-300' : 'text-gray-700'
            }`}>
              From (Sender)
            </label>
            <div className={`w-full border rounded-lg px-4 py-3 transition-all duration-300 ${
              isShielded 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}>
              {currentZkAddress ? `${currentZkAddress.slice(0, 12)}...${currentZkAddress.slice(-12)}` : 'No zk address'}
            </div>
          </div>

          {/* Receiver Address */}
          <div>
            <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
              isShielded ? 'text-gray-300' : 'text-gray-700'
            }`}>
              To (Receiver)
            </label>
            <input
              type="text"
              value={receiverAddress}
              onChange={(e) => onReceiverChange(e.target.value)}
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                isShielded 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Enter receiver's zk address (e.g., 0zkb0996e8...)"
            />
          </div>

          {/* Amount Input */}
          <div>
            <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
              isShielded ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Amount (APT)
            </label>
            <div className="relative">
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => onAmountChange(e.target.value)}
                className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                  isShielded 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter amount (e.g., 0.1)"
                step="0.01"
              />
              <button
                onClick={() => onAmountChange(walletBalance.toString())}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs rounded transition-colors duration-300 ${
                  isShielded 
                    ? 'bg-purple-600 text-white hover:bg-purple-700' 
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}
              >
                Max
              </button>
            </div>
          </div>

          {/* Error Message */}
          {message && message.includes('failed') && (
            <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/10">
              <p className="text-sm text-red-400">{message}</p>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            className={`flex-1 border rounded-lg py-3 px-4 text-sm font-medium transition-all duration-300 ${
              isShielded 
                ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-purple-600 border border-purple-500 rounded-lg py-3 px-4 text-white text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={transferAmount.length === 0 || receiverAddress.length === 0 || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sending...
              </div>
            ) : (
              "Send"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}