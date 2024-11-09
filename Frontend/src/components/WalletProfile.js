import React, { useContext, useState } from 'react';
import { WalletContext } from '../context/WalletContext';
import { FaWallet, FaSpinner, FaPowerOff, FaCopy } from 'react-icons/fa';

// import { Tooltip } from 'react-tooltip'; // Optional tooltip for better UX

const WalletProfile = () => {
  const {pyusdBalance, walletAddress, balance, connectWallet, disconnectWallet, fetchBalance } = useContext(WalletContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false); // Track copy status

  const handleFetchBalance = async () => {
    setIsLoading(true);
    await fetchBalance();
    setIsLoading(false);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(walletAddress);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000); // Reset tooltip after 2 seconds
  };

  return (
    <div className="relative flex items-center">
      {walletAddress ? (
        <div className="relative">
          {/* Wallet Icon */}
          <FaWallet 
            className="text-xl cursor-pointer text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400"
            onClick={() => setIsOpen(!isOpen)}
          />
          
          {isOpen && (
            <div className="absolute top-10 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 w-72">
              {/* Wallet Address with Copy Icon */}
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
                <div className="relative">
                  <FaCopy
                    className="text-lg cursor-pointer text-gray-500 hover:text-gray-700 dark:hover:text-gray-400"
                    onClick={copyToClipboard}
                  />
                  {copySuccess && (
                    <span className="absolute top-full left-0 mt-1 text-xs text-green-500">
                      Copied!
                    </span>
                  )}
                </div>
              </div>

              {/* Balance Section with Spinner */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-md font-semibold text-gray-800 dark:text-gray-100">
                  SOUL Tokens: {balance}
                </p>
                <FaSpinner
                  className={`text-xl cursor-pointer ${isLoading ? 'animate-spin' : ''}`}
                  onClick={handleFetchBalance}
                />
              </div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-md font-semibold text-gray-800 dark:text-gray-100">
                  PYUSD Tokens: {pyusdBalance}
                </p>
                
              </div>    
              {/* Disconnect Button */}
              <button
                onClick={disconnectWallet}
                className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 flex items-center justify-center gap-2"
              >
                <FaPowerOff /> Disconnect
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
        >
          Connect to Wallet
        </button>
      )}
    </div>
  );
};

export default WalletProfile;
