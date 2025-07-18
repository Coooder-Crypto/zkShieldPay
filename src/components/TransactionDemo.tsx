"use client";

import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export function TransactionDemo() {
  const { 
    connected, 
    account, 
    signAndSubmitTransaction,
    network 
  } = useWallet();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendTransaction = async () => {
    if (!connected || !account) {
      setMessage("请先连接钱包");
      return;
    }

    if (!recipient || !amount) {
      setMessage("请填写收款地址和金额");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // 构建交易数据
      const transaction = {
        data: {
          function: "0x1::aptos_coin::transfer",
          arguments: [recipient, (parseFloat(amount) * 100000000).toString()], // 转换为 octas
        },
      };

      console.log("发送交易:", transaction);

      // 签名并提交交易
      const result = await signAndSubmitTransaction(transaction);
      
      console.log("交易结果:", result);
      setMessage(`交易成功! 交易哈希: ${result.hash}`);
      
      // 清空表单
      setRecipient("");
      setAmount("");
    } catch (error) {
      console.error("交易失败:", error);
      setMessage(`交易失败: ${error.message || "未知错误"}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">发送交易</h2>
        <p className="text-gray-500">请先连接钱包以使用交易功能</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">发送 APT 代币</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            收款地址
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            金额 (APT)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.001"
            step="0.001"
            min="0"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={handleSendTransaction}
          disabled={isLoading || !recipient || !amount}
          className={`w-full p-3 rounded-md font-medium transition-colors ${
            isLoading || !recipient || !amount
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isLoading ? "发送中..." : "发送交易"}
        </button>

        {message && (
          <div className={`p-3 rounded-md ${
            message.includes("成功") 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          }`}>
            {message}
          </div>
        )}

        <div className="text-sm text-gray-500 space-y-1">
          <p>当前网络: {network?.name || "未知"}</p>
          <p>当前账户: {account?.address?.toString()?.slice(0, 10)}...</p>
        </div>
      </div>
    </div>
  );
}