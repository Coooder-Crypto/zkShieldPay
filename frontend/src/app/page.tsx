"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "@/components/WalletSelector";
import BalanceCard from "@/components/BalanceCard";
import TokenList from "@/components/TokenList";
import ShieldModal from "@/components/ShieldModal";
import TransferModal from "@/components/TransferModal";
import { useState, useEffect } from "react";
import { 
  Aptos,
  AptosConfig,
  Network,
  EntryFunction,
  TransactionPayload,
  Serializer,
  MoveString,
  MoveVector,
  U8,
  InputTransactionData,
  InputViewFunctionJsonData
} from "@aptos-labs/ts-sdk";

// Contract address
const CONTRACT_ADDRESS = "0xc8c349e6536fc857aaeb779bd7af30ea59f3d8eb55019218b95cc3c1547ffe81";

// ZK address mappings from environment variables
const ZK_ADDRESS_MAPPING = {
  [process.env.NEXT_PUBLIC_ZK_ADDRESS_1 || ""]: process.env.NEXT_PUBLIC_ZK_ID_1 || "",
  [process.env.NEXT_PUBLIC_ZK_ADDRESS_2 || ""]: process.env.NEXT_PUBLIC_ZK_ID_2 || ""
};

// Aptos client for testnet
const TESTNET_CLIENT = new Aptos(new AptosConfig({ network: Network.TESTNET }));

export default function Home() {
  const { connected, account, signAndSubmitTransaction } = useWallet();
  const [showShieldModal, setShowShieldModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [isShielded, setIsShielded] = useState(false); // true = shield mode (dark), false = unshield mode (light)
  const [isLoading, setIsLoading] = useState(false);
  const [isTransferLoading, setIsTransferLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [shieldedBalance, setShieldedBalance] = useState(0);

  // Get current mock zk address based on wallet address
  const currentZkAddress = account?.address ? 
    ZK_ADDRESS_MAPPING[account.address.toString() as keyof typeof ZK_ADDRESS_MAPPING] || 
    `0zk${account.address.toString().slice(2)}` // Fallback for addresses not in mapping
    : null;

  // Get account name based on address
  const getAccountName = (address: string) => {
    if (address === process.env.NEXT_PUBLIC_ZK_ADDRESS_1) {
      return "Account 1";
    } else if (address === process.env.NEXT_PUBLIC_ZK_ADDRESS_2) {
      return "Account 2";
    }
    return "Unknown Account";
  };

  // Load shielded balance from localStorage on component mount
  useEffect(() => {
    if (account?.address) {
      const stored = localStorage.getItem(`shielded_balance_${account.address.toString()}`);
      if (stored) {
        setShieldedBalance(parseFloat(stored));
      }
    }
  }, [account?.address]);

  // Save shielded balance to localStorage whenever it changes
  useEffect(() => {
    if (account?.address) {
      localStorage.setItem(`shielded_balance_${account.address.toString()}`, shieldedBalance.toString());
    }
  }, [shieldedBalance, account?.address]);


  // Fetch wallet balance
  useEffect(() => {
    if (account?.address) {
      const fetchBalance = async () => {
        try {
          const payload: InputViewFunctionJsonData = {
            function: "0x1::coin::balance",
            typeArguments: ["0x1::aptos_coin::AptosCoin"],
            functionArguments: [account.address.toString()],
          };
          const [balance] = await TESTNET_CLIENT.viewJson<[number]>({ payload });
          setWalletBalance(balance * 1e-8); // Convert from octas to APT
        } catch (error) {
          console.error("Failed to fetch balance:", error);
        }
      };
      fetchBalance();
      
      // Refresh balance every 10 seconds
      const interval = setInterval(fetchBalance, 10000);
      return () => clearInterval(interval);
    }
  }, [account?.address]);

  const handleShieldToggle = async () => {
    if (amount.length === 0 || isNaN(parseFloat(amount)) || parseFloat(amount) < 0) {
      setMessage("Please enter a valid amount (0 or greater)");
      return;
    }

    setIsLoading(true);
    setMessage("");
    
    try {
      // Call the appropriate contract function
      const contractFunction = isShielded ? "unshield_apt" : "shield_apt";
      
      console.log(`Calling ${contractFunction} with zkId: "${currentZkAddress}", amount: ${amount}`);
      
      // Convert amount to octas and zkId to bytes
      const amountInOctas = (parseFloat(amount) * 100000000).toString();
      const zkIdBytes = Array.from(new TextEncoder().encode(currentZkAddress || ""));
      
      const transaction = {
        data: {
          function: `${CONTRACT_ADDRESS}::zk_pay::${contractFunction}`,
          functionArguments: [zkIdBytes, amountInOctas],
          typeArguments: [],
        },
      };

      console.log("Test transaction payload:", transaction);
      console.log("signAndSubmitTransaction function:", typeof signAndSubmitTransaction);
      console.log("Connected:", connected);
      console.log("Account:", account);
      
      if (!signAndSubmitTransaction) {
        throw new Error("signAndSubmitTransaction function is not available");
      }
      
      if (!connected || !account) {
        throw new Error("Wallet not connected or account not available");
      }
      
      console.log("Attempting to sign test transaction...");
      const result = await signAndSubmitTransaction(transaction);
      console.log(`Test transaction result:`, result);
      
      // Simulate loading for 1.5 seconds
      setTimeout(() => {
        const transactionAmount = parseFloat(amount);
        
        // Update balances based on shield/unshield action
        if (!isShielded) {
          // Currently in public mode, doing shield action: move from wallet to shielded
          setShieldedBalance(prev => prev + transactionAmount);
        } else {
          // Currently in shield mode, doing unshield action: move from shielded to wallet
          setShieldedBalance(prev => Math.max(0, prev - transactionAmount));
        }
        
        setIsShielded(!isShielded);
        setIsLoading(false);
        setShowShieldModal(false);
        setAmount("");
        const actionName = isShielded ? "Unshield" : "Shield";
        setMessage(`${actionName} transaction successful! Hash: ${result.hash}`);
        
        // Clear message after 3 seconds
        setTimeout(() => {
          setMessage("");
        }, 3000);
      }, 1500);
    } catch (error) {
      console.error(`${isShielded ? 'Shield' : 'Unshield'} transaction failed:`, error);
      setIsLoading(false);
      setMessage(`Transaction failed: ${(error as any)?.message || "Unknown error"}`);
    }
  };

  const handleTransfer = async () => {
    if (transferAmount.length === 0 || isNaN(parseFloat(transferAmount)) || parseFloat(transferAmount) <= 0) {
      setMessage("Please enter a valid amount (greater than 0)");
      return;
    }

    if (receiverAddress.length === 0) {
      setMessage("Please enter a receiver address");
      return;
    }

    const transferAmountNum = parseFloat(transferAmount);
    if (transferAmountNum > walletBalance) {
      setMessage("Insufficient wallet balance");
      return;
    }

    setIsTransferLoading(true);
    setMessage("");

    try {
      // Validate receiver address exists in mapping
      const receiverRealAddress = Object.keys(ZK_ADDRESS_MAPPING).find(
        key => ZK_ADDRESS_MAPPING[key as keyof typeof ZK_ADDRESS_MAPPING] === receiverAddress
      );

      if (!receiverRealAddress) {
        throw new Error("Invalid receiver address - not found in mapping");
      }

      // Convert amount to octas and addresses to bytes
      const amountInOctas = (transferAmountNum * 100000000).toString();
      const fromIdBytes = Array.from(new TextEncoder().encode(currentZkAddress || ""));
      const toIdBytes = Array.from(new TextEncoder().encode(receiverAddress));
      
      // Use zk contract transfer_zk_apt function
      const transaction = {
        data: {
          function: `${CONTRACT_ADDRESS}::zk_pay::transfer_zk_apt`,
          functionArguments: [fromIdBytes, toIdBytes, amountInOctas],
          typeArguments: [],
        },
      };
      
      if (!signAndSubmitTransaction) {
        throw new Error("signAndSubmitTransaction function is not available");
      }
      
      if (!connected || !account) {
        throw new Error("Wallet not connected or account not available");
      }

      const result = await signAndSubmitTransaction(transaction);
      
      // Update UI after successful transaction
      setTimeout(() => {
        // Update shielded balance after transfer
        setShieldedBalance(prev => Math.max(0, prev - transferAmountNum));
        
        setIsTransferLoading(false);
        setShowTransferModal(false);
        setTransferAmount("");
        setReceiverAddress("");
        setMessage(`ZK Transfer successful! Sent ${transferAmountNum} APT to ${receiverAddress.slice(0, 8)}...${receiverAddress.slice(-8)}. Hash: ${result.hash}`);
        
        // Clear message after 5 seconds
        setTimeout(() => {
          setMessage("");
        }, 5000);
      }, 1500);
    } catch (error) {
      console.error('ZK Transfer failed:', error);
      setIsTransferLoading(false);
      setMessage(`ZK Transfer failed: ${(error as any)?.message || "Unknown error"}`);
    }
  };
  

  if (!connected) {
    return (
      <div className="relative min-h-screen bg-gray-900">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-purple-500/20 rounded-full filter blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-pink-500/20 rounded-full filter blur-[100px] animate-pulse" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-6 pt-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient">zk</span>
              <span className="text-white">Shield</span>
              <span className="text-gradient">Pay</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto">
              A <span className="text-gradient font-semibold">privacy payment</span> wallet 
              powered by <span className="text-gradient font-semibold">Zero-Knowledge Proof</span> technology
            </p>
            <div className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              <p className="mb-4">Connect your wallet to start using zkShieldPay:</p>
              <ul className="text-left space-y-2">
                <li>• <strong>Shield Mode:</strong> Private transactions with zero-knowledge proofs</li>
                <li>• <strong>Public Mode:</strong> Standard blockchain transactions</li>
                <li>• <strong>Seamless:</strong> Switch between modes anytime</li>
              </ul>
            </div>
          </div>
          
          <div className="max-w-md mx-auto">
            <WalletSelector />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isShielded ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Top-right status indicators */}
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-4">
        {/* Network Status */}
        <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <span className="text-xs text-green-400">Testnet</span>
        </div>
      </div>
      
      {/* Background Grid */}
      <div className={`absolute inset-0 grid-bg opacity-20 transition-opacity duration-700 ${isShielded ? 'opacity-20' : 'opacity-10'}`} />
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`p-8 rounded-xl ${isShielded ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}>
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
              <p className={`text-sm font-medium ${isShielded ? 'text-white' : 'text-gray-900'}`}>
                {isShielded ? 'Switching to public mode...' : 'Switching to shield mode...'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Dashboard */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* App Title and Description */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">zk</span>
            <span className={`transition-colors duration-700 ${isShielded ? 'text-white' : 'text-gray-900'}`}>Shield</span>
            <span className="text-gradient">Pay</span>
          </h1>
          <p className={`text-lg md:text-xl leading-relaxed max-w-3xl mx-auto transition-colors duration-700 ${
            isShielded ? 'text-gray-300' : 'text-gray-600'
          }`}>
            A <span className="text-gradient font-semibold">privacy payment</span> wallet 
            powered by <span className="text-gradient font-semibold">Zero-Knowledge Proof</span> technology
          </p>
        </div>

        {/* Balance Card */}
        <BalanceCard
          account={account!}
          isShielded={isShielded}
          shieldedBalance={shieldedBalance}
          walletBalance={walletBalance}
          getAccountName={getAccountName}
          currentZkAddress={currentZkAddress}
          onShieldClick={() => setShowShieldModal(true)}
          onSendClick={() => {
            if (isShielded) {
              setShowTransferModal(true);
            } else {
              setMessage("Send is only available in Shield Mode");
              setTimeout(() => setMessage(""), 3000);
            }
          }}
          onReceiveClick={() => {}}
        />

        {/* Shielded Tokens Section */}
        <TokenList
          isShielded={isShielded}
          shieldedBalance={shieldedBalance}
          walletBalance={walletBalance}
        />

        {/* Success Message */}
        {message && message.includes('successful') && (
          <div className="max-w-2xl mx-auto mt-4">
            <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/10">
              <div className="text-sm text-green-400 text-center">
                {(() => {
                  const parts = message.split('Hash: ');
                  if (parts.length === 2) {
                    const [actionText, hash] = parts;
                    return (
                      <p>
                        {actionText}Hash: {' '}
                        <a
                          href={`https://explorer.aptoslabs.com/txn/${hash}?network=testnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-300 hover:text-green-200 underline transition-colors"
                        >
                          {hash.slice(0, 8)}...{hash.slice(-8)}
                        </a>
                      </p>
                    );
                  }
                  return <p>{message}</p>;
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Shield/Unshield Modal */}
        <ShieldModal
          showModal={showShieldModal}
          isShielded={isShielded}
          amount={amount}
          isLoading={isLoading}
          message={message}
          currentAddress={account?.address?.toString() || ""}
          zkAddress={currentZkAddress || ""}
          onClose={() => {
            setShowShieldModal(false);
            setAmount("");
            setMessage("");
          }}
          onAmountChange={setAmount}
          onConfirm={handleShieldToggle}
        />

        {/* Transfer Modal */}
        <TransferModal
          showModal={showTransferModal}
          isShielded={isShielded}
          currentZkAddress={currentZkAddress}
          receiverAddress={receiverAddress}
          transferAmount={transferAmount}
          isLoading={isTransferLoading}
          message={message}
          walletBalance={walletBalance}
          onClose={() => {
            setShowTransferModal(false);
            setTransferAmount("");
            setReceiverAddress("");
            setMessage("");
          }}
          onReceiverChange={setReceiverAddress}
          onAmountChange={setTransferAmount}
          onConfirm={handleTransfer}
        />
      </div>
    </div>
  );
}