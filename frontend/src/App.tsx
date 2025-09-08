import React, { useState } from 'react';
import { ethers } from 'ethers';
import WalletConnection from './components/WalletConnection';

function App() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [account, setAccount] = useState<string>('');

  const handleWalletConnected = (address: string, provider: ethers.providers.Web3Provider) => {
    setAccount(address);
    setProvider(provider);
    console.log('Wallet connected:', address);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>SomniaConnect</h1>
        <p>Web2 to Web3 Onboarding Platform</p>
      </header>
      
      <WalletConnection onWalletConnected={handleWalletConnected} />
      
      {account && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p>Ready to start your Web3 journey!</p>
        </div>
      )}
    </div>
  );
}

export default App;