import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useContracts } from '../hooks/useContracts';

// Define User interface directly in this file
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
}

const UserRegistration: React.FC<UserRegistrationProps> = ({ 
  provider, 
  account, 
  onUserRegistered 
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

  // Check if user is already registered
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

  // Check username availability with debounce
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
      
      // Get updated user details
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
      <div style={{ 
        maxWidth: '400px', 
        margin: '0 auto', 
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa'
      }}>
        <h3>Welcome back, {existingUser.username}!</h3>
        <p>Level: {existingUser.level}</p>
        <p>Total Score: {existingUser.totalScore}</p>
        <p>Member since: {new Date(existingUser.joinedAt * 1000).toLocaleDateString()}</p>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '0 auto', 
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px'
    }}>
      <h3>Create Your Profile</h3>
      <p>Choose a username to start your Web3 journey</p>
      
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Username:
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username (min 3 characters)"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
            disabled={isRegistering || loading}
          />
          
          {username.length >= 3 && (
            <div style={{ marginTop: '5px', fontSize: '14px' }}>
              {isChecking ? (
                <span style={{ color: '#007bff' }}>Checking availability...</span>
              ) : isAvailable === true ? (
                <span style={{ color: 'green' }}>✓ Username available</span>
              ) : isAvailable === false ? (
                <span style={{ color: 'red' }}>✗ Username taken</span>
              ) : null}
            </div>
          )}
        </div>

        {error && (
          <div style={{ 
            color: 'red', 
            marginBottom: '15px',
            fontSize: '14px'
          }}>
            {error}
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
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isAvailable === true ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: isAvailable === true ? 'pointer' : 'not-allowed'
          }}
        >
          {isRegistering ? 'Creating Profile...' : 'Create Profile'}
        </button>
      </form>
    </div>
  );
};

export default UserRegistration;