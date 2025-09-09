import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface WalletConnectionProps {
  onWalletConnected: (address: string, provider: ethers.providers.Web3Provider) => void;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({ onWalletConnected }) => {
  const [account, setAccount] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>('');

  const somniaTestnet = {
  chainId: 50312, 
  chainName: 'Somnia Testnet',
  nativeCurrency: {
    name: 'Somnia Testnet Token',
    symbol: 'STT',
    decimals: 18,
  },
  rpcUrls: ['https://dream-rpc.somnia.network/', 'https://rpc.somnia.network'],
  blockExplorerUrls: ['https://shannon-explorer.somnia.network/'],
};



const connectWallet = async () => {
  if (!window.ethereum) {
    setError('Please install MetaMask!');
    return;
  }

  setIsConnecting(true);
  setError('');

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    console.log('Current chain ID (hex):', chainId);
    console.log('Expected chain ID (decimal):', somniaTestnet.chainId);
    
    // Convert hex chain ID to decimal for comparison
    const currentChainId = parseInt(chainId, 16);
    
    console.log('Current chain ID (decimal):', currentChainId);
    console.log('Expected chain ID (decimal):', somniaTestnet.chainId);
    
    if (currentChainId !== somniaTestnet.chainId) {
      setError('Please switch to Somnia Testnet in MetaMask and try again.');
      setIsConnecting(false);
      return;
    }

    setAccount(accounts[0]);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    onWalletConnected(accounts[0], provider);
  } catch (error: any) {
    setError(error.message || 'Failed to connect wallet');
  } finally {
    setIsConnecting(false);
  }
};

  
    



  const disconnectWallet = () => {
    setAccount('');
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          onWalletConnected(accounts[0], provider);
        } else {
          setAccount('');
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, [onWalletConnected]);

  return (
    <div>
      {!account ? (
        <div>
          <button 
            onClick={connectWallet} 
            disabled={isConnecting}
            className="btn-primary w-full"
          >
            {isConnecting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </span>
            ) : (
              'Connect Wallet'
            )}
          </button>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-800 font-medium">Connected</p>
              <p className="text-green-600 text-sm">{account.slice(0, 6)}...{account.slice(-4)}</p>
            </div>
            <button 
              onClick={disconnectWallet}
              className="text-green-600 hover:text-green-800 text-sm"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnection;