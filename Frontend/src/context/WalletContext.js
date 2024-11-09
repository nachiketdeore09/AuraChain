// src/context/WalletContext.js
import React, { createContext, useState, useCallback, useEffect } from 'react';
import { ethers, MinInt256 } from 'ethers'; // Only import ethers
import SoulTokenABI from '../ABI/SoulToken.json';
import ERC20_ABI from "../ABI/ERC20_ABI.json";
import { toast } from 'react-toastify';
import { use } from 'i18next';
export const WalletContext = createContext();

const WalletProvider = ({ children }) => {
  const OwnerAddress="0x8Cd1d4f80e1d34410a3792c12f61DE71a59F0a56";
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(0);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [pyusdBalance, setPyusdBalance] = useState(0);
  const [pyusdContract, setPyusdContract] = useState(null);

  const contractAddress = "0x76538d2785c93cd0f67a8411252dbb651982217b"; // Replace with actual address
  // const pyusdAddress = "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9";
  const pyusdAddress = "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9";
  // Connect Wallet

  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) {
        alert('MetaMask not detected. Please install MetaMask.');
        return;
      }
      const providerInstance = new ethers.BrowserProvider(window.ethereum);
      const userSigner = await providerInstance.getSigner();
      setSigner(userSigner);
      const contractInstance = new ethers.Contract(contractAddress, SoulTokenABI, userSigner);
      setContract(contractInstance);
      const pyusdContractu = new ethers.Contract(pyusdAddress, ERC20_ABI, userSigner);
      setPyusdContract(pyusdContractu);
      const accounts = await providerInstance.send('eth_requestAccounts', []);
      const userAddress = accounts[0];
      setWalletAddress(userAddress);
      setProvider(providerInstance);
      const tokenBalance = await contractInstance.checkNoOfTokens(userAddress);
      setBalance(ethers.formatUnits(tokenBalance, 0)) // Fetch initial balance
      const pyusdBalanceu = await pyusdContractu?.balanceOf(userAddress);
      setPyusdBalance(ethers.formatUnits(pyusdBalanceu, 6));
      toast.success('Wallet connected successfully!',{
        toastId: 'connect'
      })
    } catch (error) {
      toast.error('Error connecting wallet. Please try again.',{
        toastId: 'error_connect'
      });
    }
  }, []);

  // Fetch Balance
  const fetchBalance = async () => {
    try {
      const tokenBalance = await contract.connect(provider).checkNoOfTokens(walletAddress);
      setBalance(ethers.formatUnits(tokenBalance, 0)); // Access utils via ethers
      const pyusdBalanceu = await pyusdContract?.balanceOf(walletAddress);
      setPyusdBalance(ethers.formatUnits(pyusdBalanceu, 6));
    } catch (error) {
      toast.error('Error fetching token balance!');
    }
  };

  // Earn Tokens
  const earnTokens = useCallback(async () => {
    if (!contract) {
      throw { message: 'Connect to wallet', code: 'WALLET_NOT_CONNECTED' };
    }
    const tx = await contract.earnTokens();
    await tx.wait();
    await fetchBalance();
    return true;
  }, [contract, fetchBalance]);

  // Reduce Tokens
  const reduceTokens = useCallback(async (token,amount) => {
      // Ensure contract is initialized
      if (!contract) {
        console.error("Contract is not initialized.");
        return;
      }
      var amountInWei = ethers.parseUnits(token.toString(), 0);
      var amountInPyusd = ethers.parseUnits(amount.toString(), 6);
      const txr = await contract.reduceTokens(amountInWei,amountInPyusd);
      await txr.wait();
      await fetchBalance();
     
  }, [contract, fetchBalance]);

  const approveTokens = useCallback(async (amount) => {
      if (!contract) {
        throw { message: 'Connect to wallet', code: 'WALLET_NOT_CONNECTED' };
      }
      var amountInPyusd = ethers.parseUnits(amount.toString(), 6);
      const approvalTz = await pyusdContract.increaseApproval(contractAddress, amountInPyusd);
      await approvalTz.wait();
      return true;
  }, [contract]);



  // Disconnect Wallet
  const disconnectWallet = useCallback(() => {
    setWalletAddress(null);
    setBalance('0');
    setProvider(null);
    setSigner(null);
    setContract(null);
    toast.info('Wallet disconnected successfully!',{
      toastId: 'disconnect'
    });
  }, []);

  // Effect to detect account change
  useEffect(() => {
    if (window.ethereum) {
      const providerInstance = new ethers.BrowserProvider(window.ethereum);
      window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts.length > 0) {
          await connectWallet();

        } else {
          disconnectWallet();
        }
      });
    }
  }, [connectWallet, disconnectWallet]);

  return (
    <WalletContext.Provider
      value={{
        approveTokens,
        pyusdBalance,
        walletAddress,
        balance, //change here to balance
        provider,
        signer,
        contract,
        connectWallet,
        disconnectWallet,
        fetchBalance,
        earnTokens,
        reduceTokens,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
