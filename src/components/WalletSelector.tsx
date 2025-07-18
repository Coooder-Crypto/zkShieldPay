"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";

export function WalletSelector() {
  const { 
    connect, 
    connected, 
    account, 
    disconnect, 
    wallet,
    wallets 
  } = useWallet();

  // 调试日志
  console.log("Wallet state:", { connected, account, wallet, wallets });

  const handleConnect = async (walletName: string) => {
    try {
      console.log("尝试连接钱包:", walletName);
      await connect(walletName);
      console.log("钱包连接成功");
    } catch (error) {
      console.error("连接失败:", error);
      // 显示用户友好的错误信息
      if (error.message?.includes("Cross-Origin-Opener-Policy")) {
        alert("钱包连接失败: 请确保使用 HTTPS 访问 (https://localhost:3000)");
      } else {
        alert(`钱包连接失败: ${error.message || "未知错误"}`);
      }
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("断开连接失败:", error);
    }
  };

  if (connected && account) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">钱包已连接</h2>
        <div className="space-y-3">
          <div>
            <span className="font-medium">钱包名称:</span>
            <span className="ml-2">{wallet?.name}</span>
          </div>
          <div>
            <span className="font-medium">地址:</span>
            <span className="ml-2 text-sm font-mono break-all">
              {account.address?.toString() || "未知"}
            </span>
          </div>
          <div>
            <span className="font-medium">公钥:</span>
            <span className="ml-2 text-sm font-mono break-all">
              {account.publicKey?.toString() || "未知"}
            </span>
          </div>
        </div>
        <button
          onClick={handleDisconnect}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          断开连接
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">选择钱包</h2>
      <div className="space-y-3">
        {wallets.map((wallet) => (
          <button
            key={wallet.name}
            onClick={() => handleConnect(wallet.name)}
            className="w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
          >
            {wallet.icon && (
              <img 
                src={wallet.icon} 
                alt={wallet.name}
                className="w-6 h-6"
              />
            )}
            <span className="font-medium">{wallet.name}</span>
          </button>
        ))}
      </div>
      {wallets.length === 0 && (
        <p className="text-gray-500 text-center py-4">
          没有检测到可用的钱包
        </p>
      )}
    </div>
  );
}