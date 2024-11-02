"use client";
import { createContext, useContext, useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";

// Define a key for storing data in localStorage
const STORAGE_KEY = "walletData";

type Wallet = {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  accounts: string[];
  address: string;
  balance: string;
  isConnected: boolean;
  isConnecting: boolean;
};

const WalletContext = createContext<Wallet>({
  connect: async () => {},
  disconnect: async () => {},
  accounts: [],
  address: "",
  balance: "",
  isConnected: false,
  isConnecting: false,
});

const WalletProvider = ({ children }) => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [balance, setBalance] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const { address, accounts } = JSON.parse(storedData);
      setAddress(address);
      setAccounts(accounts);
    }
  }, []);

  // Save data to localStorage whenever address or accounts change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ address, accounts }));
  }, [address, accounts]);

  const connect = async () => {
    try {
      const provider = (await detectEthereumProvider()) as any;
      if (provider) {
        // Metamask is installed
        await provider.request({ method: "eth_requestAccounts" });
        const accounts = await provider.request({ method: "eth_accounts" });
        setAccounts(accounts);
        setIsConnected(true);
      } else {
        console.error("Please install Metamask!");
      }
    } catch (error) {
      console.error("Error connecting to Metamask:", error);
    }
  };

  const disconnect = async () => {
    setIsConnected(false);
    setAccounts([]);
    setAddress("");
  };

  return (
    <WalletContext.Provider
      value={{
        accounts,
        address,
        balance,
        disconnect,
        connect,
        isConnected,
        isConnecting,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
export const useWalletContext = () => useContext(WalletContext);
export { WalletProvider, WalletContext };
