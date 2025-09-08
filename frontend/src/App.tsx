import React, { useState } from 'react';
import { ethers } from 'ethers';
import WalletConnection from './components/WalletConnection';
import UserRegistration from './components/UserRegistration';

// Define User interface here too
interface User {
  userAddress: string;
  username: string;
  totalScore: number;
  level: number;
  joinedAt: number;
  isActive: boolean;
}

function App() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [account, setAccount] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);

  const handleWalletConnected = (address: string, provider: ethers.providers.Web3Provider) => {
    setAccount(address);
    setProvider(provider);
  };

  const handleUserRegistered = (user: User) => {
    setUser(user);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '20px', backgroundColor: '#f5f5f5' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>SomniaConnect</h1>
        <p>Your Gateway from Web2 to Web3</p>
      </header>
      
      {!account ? (
        <WalletConnection onWalletConnected={handleWalletConnected} />
      ) : !user ? (
        <UserRegistration 
          provider={provider!}
          account={account}
          onUserRegistered={handleUserRegistered}
        />
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h2>Welcome to Web3, {user.username}!</h2>
          <p>Ready to start learning?</p>
        </div>
      )}
    </div>
  );
}

export default App;