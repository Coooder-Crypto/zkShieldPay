"use client";

interface ModePreviewProps {
  isShielded: boolean;
}

export default function ModePreview({ isShielded }: ModePreviewProps) {
  return (
    <div className={`p-4 rounded-lg border transition-all duration-300 ${
      isShielded 
        ? 'bg-gray-700/30 border-gray-600/50' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${
            isShielded ? 'bg-purple-400' : 'bg-gray-400'
          }`}></div>
          <span className={`text-sm font-medium ${
            isShielded ? 'text-gray-300' : 'text-gray-700'
          }`}>Current Mode</span>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isShielded 
            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
            : 'bg-gray-200 text-gray-600 border border-gray-300'
        }`}>
          {isShielded ? '🛡️ Shield Mode' : '🔓 Public Mode'}
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
          <div className={`w-3 h-3 rounded-full ${
            !isShielded ? 'bg-purple-400' : 'bg-gray-400'
          }`}></div>
          <span className={`text-sm font-medium ${
            isShielded ? 'text-gray-300' : 'text-gray-700'
          }`}>Switch to</span>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          !isShielded 
            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
            : 'bg-gray-200 text-gray-600 border border-gray-300'
        }`}>
          {!isShielded ? '🛡️ Shield Mode' : '🔓 Public Mode'}
        </div>
      </div>
    </div>
  );
}