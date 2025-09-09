import React, { useState } from 'react';
import { ethers } from 'ethers';
import WalletConnection from './components/WalletConnection';
import UserRegistration from './components/UserRegistration';
import LearningModules from './components/LearningModules';
import UserDashboard from './components/UserDashboard';

// Define User interface and app view type
interface User {
  userAddress: string;
  username: string;
  totalScore: number;
  level: number;
  joinedAt: number;
  isActive: boolean;
}

type AppView = 'dashboard' | 'learning';

function App() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [account, setAccount] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');

  const handleWalletConnected = (address: string, provider: ethers.providers.Web3Provider) => {
    setAccount(address);
    setProvider(provider);
  };

  const handleUserRegistered = (user: User) => {
    setUser(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Somnia<span className="text-purple-300">Connect</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Your Gateway from Web2 to Web3
            </p>
            <div className="flex justify-center space-x-4 text-sm text-blue-200">
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">Learn</span>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">Earn</span>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">Connect</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!account ? (
          <div className="text-center">
            <div className="card max-w-md mx-auto">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🔗</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Connect Your Wallet</h2>
                <p className="text-gray-600">Start your Web3 journey by connecting your wallet</p>
              </div>
              <WalletConnection onWalletConnected={handleWalletConnected} />
            </div>
          </div>
        ) : !user ? (
          <div className="text-center">
            <UserRegistration 
              provider={provider!}
              account={account}
              onUserRegistered={handleUserRegistered}
            />
          </div>
        ) : (
          <>
            {currentView === 'dashboard' ? (
              <UserDashboard 
                provider={provider!}
                user={user}
                onStartLearning={() => setCurrentView('learning')}
              />
            ) : (
              <div>
                <div className="mb-6">
                  <button 
                    onClick={() => setCurrentView('dashboard')}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    ← Back to Dashboard
                  </button>
                </div>
                <LearningModules 
                  provider={provider!}
                  user={user}
                  onProgressUpdate={handleUserRegistered}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>Built on Somnia Network • Hackathon Project</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;