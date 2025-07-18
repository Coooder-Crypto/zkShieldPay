"use client";

import ModePreview from "./ModePreview";
import AddressPreview from "./AddressPreview";

interface ShieldModalProps {
  showModal: boolean;
  isShielded: boolean;
  amount: string;
  isLoading: boolean;
  message: string;
  currentAddress: string;
  zkAddress: string;
  onClose: () => void;
  onAmountChange: (amount: string) => void;
  onConfirm: () => void;
}

export default function ShieldModal({
  showModal,
  isShielded,
  amount,
  isLoading,
  message,
  currentAddress,
  zkAddress,
  onClose,
  onAmountChange,
  onConfirm
}: ShieldModalProps) {
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
            isShielded ? 'text-white' : 'text-gray-900'
          }`}>
            {isShielded ? "Unshield Assets" : "Shield Assets"}
          </h3>
          <p className={`text-sm transition-colors duration-300 mb-4 ${
            isShielded ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Enter amount to {isShielded ? "unshield" : "shield"} your assets
          </p>
          
          {/* Preview Components */}
          <div className="space-y-4">
            <ModePreview isShielded={isShielded} />
            <AddressPreview 
              isShielded={isShielded}
              currentAddress={currentAddress}
              zkAddress={zkAddress}
            />
          </div>
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
              onChange={(e) => onAmountChange(e.target.value)}
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
  );
}