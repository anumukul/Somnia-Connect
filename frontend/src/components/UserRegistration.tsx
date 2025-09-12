import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useContracts } from '../hooks/useContracts';

interface User {
  userAddress: string;
  username: string;
  totalScore: number;
  level: number;
  joinedAt: number;
  isActive: boolean;
}

interface UserRegistrationProps {
  provider: ethers.providers.Web3Provider;
  account: string;
  onUserRegistered: (user: User) => void;
  userInfo?: any; 
} // Add this closing brace

const UserRegistration: React.FC<UserRegistrationProps> = ({ 
  provider, 
  account, 
  onUserRegistered,
  userInfo // Add this to match the interface
}) => {
  const [username, setUsername] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [existingUser, setExistingUser] = useState<User | null>(null);

  const {
    loading,
    registerUser,
    getUserDetails,
    isUsernameAvailable
  } = useContracts(provider);

  useEffect(() => {
    const checkExistingUser = async () => {
      if (account) {
        const userDetails = await getUserDetails(account);
        if (userDetails && userDetails.isActive) {
          setExistingUser(userDetails);
          onUserRegistered(userDetails);
        }
      }
    };
    
    checkExistingUser();
  }, [account, getUserDetails, onUserRegistered]);

  useEffect(() => {
    if (username.length >= 3) {
      const timeoutId = setTimeout(async () => {
        setIsChecking(true);
        try {
          const available = await isUsernameAvailable(username);
          setIsAvailable(available);
        } catch (error) {
          console.error('Error checking username:', error);
        } finally {
          setIsChecking(false);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setIsAvailable(null);
    }
  }, [username, isUsernameAvailable]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (isAvailable === false) {
      setError('Username is not available');
      return;
    }

    setError('');
    setIsRegistering(true);

    try {
      await registerUser(username.trim());
      
      const userDetails = await getUserDetails(account);
      if (userDetails) {
        onUserRegistered(userDetails);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to register user');
    } finally {
      setIsRegistering(false);
    }
  };

  if (existingUser) {
    return (
      <div className="card max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">👋</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Welcome back, {existingUser.username}!</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-blue-600">{existingUser.level}</div>
            <div className="text-xs text-blue-500">Level</div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-purple-600">{existingUser.totalScore}</div>
            <div className="text-xs text-purple-500">Score</div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-green-600">{new Date(existingUser.joinedAt * 1000).toLocaleDateString()}</div>
            <div className="text-xs text-green-500">Joined</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl text-white">👤</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Create Your Profile</h3>
        <p className="text-gray-600">Choose a username to start your learning journey</p>
      </div>
      
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username (min 3 characters)"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            disabled={isRegistering || loading}
          />
          
          {username.length >= 3 && (
            <div className="mt-2 text-sm">
              {isChecking ? (
                <span className="text-blue-500 flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking availability...
                </span>
              ) : isAvailable === true ? (
                <span className="text-green-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Username available
                </span>
              ) : isAvailable === false ? (
                <span className="text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Username taken
                </span>
              ) : null}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={
            isRegistering || 
            loading || 
            !username.trim() || 
            username.length < 3 || 
            isAvailable !== true
          }
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isRegistering ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Profile...
            </span>
          ) : 'Create Profile'}
        </button>
      </form>
    </div>
  );
};

export default UserRegistration;