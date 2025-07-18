"use client";

interface NavbarProps {
  isShielded: boolean;
}

export default function Navbar({ isShielded }: NavbarProps) {

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 z-50">
      {/* Background */}
      <div className={`absolute inset-0 backdrop-blur-xl border-b transition-all duration-700 ${
        isShielded 
          ? 'bg-gray-900/50 border-purple-500/10' 
          : 'bg-gray-100/50 border-gray-300/20'
      }`} />

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
              <span className={`transition-colors duration-700 ${isShielded ? 'text-white' : 'text-gray-900'}`}>Shield</span>
              <span className="text-gradient">Pay</span>
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className={`transition-colors duration-700 ${
            isShielded 
              ? 'text-gray-400 hover:text-white' 
              : 'text-gray-600 hover:text-gray-900'
          }`}>
            Home
          </a>
          <a href="#" className={`transition-colors duration-700 ${
            isShielded 
              ? 'text-gray-400 hover:text-white' 
              : 'text-gray-600 hover:text-gray-900'
          }`}>
            Transactions
          </a>
          <a href="#" className={`transition-colors duration-700 ${
            isShielded 
              ? 'text-gray-400 hover:text-white' 
              : 'text-gray-600 hover:text-gray-900'
          }`}>
            Privacy Pool
          </a>
          <a href="#" className={`transition-colors duration-700 ${
            isShielded 
              ? 'text-gray-400 hover:text-white' 
              : 'text-gray-600 hover:text-gray-900'
          }`}>
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

          {/* Privacy Mode Indicator */}
          <div className={`px-3 py-1 rounded-lg border transition-all duration-700 ${
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
    </nav>
  );
}