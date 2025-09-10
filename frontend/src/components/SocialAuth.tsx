import React, { useState, useEffect } from 'react';
import { web3auth } from '../config/web3auth';
import { ethers } from 'ethers';
import { createBiconomyAccount } from '../config/biconomy';

interface SocialAuthProps {
  onUserConnected: (userInfo: any, provider: ethers.providers.Web3Provider, smartAccount?: any) => void;
}

const SocialAuth: React.FC<SocialAuthProps> = ({ onUserConnected }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [smartAccount, setSmartAccount] = useState<any>(null);
  const [connectionStep, setConnectionStep] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        setIsInitialized(true);
        
        // Check if user is already logged in
        if (web3auth.connected) {
          setConnectionStep('Setting up your account...');
          const userInfo = await web3auth.getUserInfo();
          const web3authProvider = web3auth.provider;
          const ethersProvider = new ethers.providers.Web3Provider(web3authProvider);
          
          // Create Biconomy smart account
          const biconomyAccount = await createBiconomyAccount(ethersProvider, userInfo.email);
          
          setUser(userInfo);
          setSmartAccount(biconomyAccount);
          onUserConnected(userInfo, ethersProvider, biconomyAccount);
        }
      } catch (error) {
        console.error('Error initializing Web3Auth:', error);
        setConnectionStep('');
      }
    };

    init();
  }, [onUserConnected]);

  const connectWithSocial = async (loginProvider?: string) => {
    if (!isInitialized) return;
    
    setIsConnecting(true);
    setConnectionStep('Signing you in...');
    
    try {
      const connectOptions = loginProvider ? { loginProvider } : undefined;
      await web3auth.connect(connectOptions);
      
      setConnectionStep('Getting your profile...');
      const userInfo = await web3auth.getUserInfo();
      const web3authProvider = web3auth.provider;
      const ethersProvider = new ethers.providers.Web3Provider(web3authProvider);
      
      setConnectionStep('Setting up your secure account...');
      // Create Biconomy smart account for gasless transactions
      const biconomyAccount = await createBiconomyAccount(ethersProvider, userInfo.email);
      
      setUser(userInfo);
      setSmartAccount(biconomyAccount);
      onUserConnected(userInfo, ethersProvider, biconomyAccount);
    } catch (error) {
      console.error('Error connecting:', error);
      setConnectionStep('');
    } finally {
      setIsConnecting(false);
    }
  };

  const logout = async () => {
    try {
      await web3auth.logout();
      setUser(null);
      setSmartAccount(null);
      setConnectionStep('');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Initializing...</p>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        <p className="mt-4 text-gray-600">{connectionStep}</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="card max-w-md mx-auto text-center">
        <div className="mb-4">
          <img 
            src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`} 
            alt="Profile" 
            className="w-16 h-16 rounded-full mx-auto mb-2"
          />
          <h3 className="text-lg font-semibold">Welcome, {user.name}!</h3>
          <p className="text-gray-600 text-sm">{user.email}</p>
          {smartAccount && (
            <p className="text-xs text-green-600 mt-1">
              Secure account ready
            </p>
          )}
        </div>
        <button 
          onClick={logout}
          className="text-red-600 hover:text-red-800 text-sm"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="card max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Get Started</h2>
        <p className="text-gray-600">Choose your preferred sign-in method</p>
      </div>
      
      <div className="space-y-3">
        <button
          onClick={() => connectWithSocial('google')}
          disabled={isConnecting}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5 mr-3" />
          Continue with Google
        </button>
        
        <button
          onClick={() => connectWithSocial('twitter')}
          disabled={isConnecting}
          className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
          Continue with Twitter
        </button>

        <button
          onClick={() => connectWithSocial('discord')}
          disabled={isConnecting}
          className="w-full flex items-center justify-center px-4 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9460 2.4189-2.1568 2.4189Z"/>
          </svg>
          Continue with Discord
        </button>
      </div>
      
      <p className="text-xs text-gray-500 text-center mt-4">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
};

export default SocialAuth;