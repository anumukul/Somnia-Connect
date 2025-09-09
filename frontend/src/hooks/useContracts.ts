import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, USER_PROGRESS_ABI, REWARD_SYSTEM_ABI, testContract } from '../utils/contracts';

export const useContracts = (provider: ethers.providers.Web3Provider | null) => {
  const [userProgressContract, setUserProgressContract] = useState<ethers.Contract | null>(null);
  const [rewardSystemContract, setRewardSystemContract] = useState<ethers.Contract | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (provider) {
      const initializeContracts = async () => {
        try {
          console.log('Initializing contracts...');
          
          // Test basic contract connection first
          const testResult = await testContract(provider);
          if (!testResult) {
            console.error('Basic contract test failed');
            return;
          }

          const signer = provider.getSigner();
          
          const userProgress = new ethers.Contract(
            CONTRACT_ADDRESSES.USER_PROGRESS,
            USER_PROGRESS_ABI,
            signer
          );
          
          const rewardSystem = new ethers.Contract(
            CONTRACT_ADDRESSES.REWARD_SYSTEM,
            REWARD_SYSTEM_ABI,
            signer
          );
          
          setUserProgressContract(userProgress);
          setRewardSystemContract(rewardSystem);
          console.log('Contracts initialized successfully');
        } catch (error) {
          console.error('Error initializing contracts:', error);
        }
      };

      initializeContracts();
    }
  }, [provider]);

  const isUsernameAvailable = async (username: string) => {
    if (!userProgressContract) {
      console.log('Contract not initialized');
      return false;
    }
    
    try {
      console.log('Checking username availability for:', username);
      const result = await userProgressContract.isUsernameAvailable(username);
      console.log('Username availability result:', result);
      return result;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  };

  const registerUser = async (username: string) => {
    if (!userProgressContract) throw new Error('Contract not initialized');
    
    setLoading(true);
    try {
      console.log('Registering user with username:', username);
      const tx = await userProgressContract.registerUser(username);
      console.log('Transaction sent:', tx.hash);
      await tx.wait();
      console.log('Transaction confirmed');
      return tx;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getUserDetails = async (address: string) => {
    if (!userProgressContract) return null;
    
    try {
      console.log('Getting user details for:', address);
      const userDetails = await userProgressContract.getUserDetails(address);
      console.log('User details result:', userDetails);
      
      return {
        userAddress: userDetails.userAddress,
        username: userDetails.username,
        totalScore: userDetails.totalScore.toNumber(),
        level: userDetails.level.toNumber(),
        joinedAt: userDetails.joinedAt.toNumber(),
        isActive: userDetails.isActive
      };
    } catch (error) {
      console.error('Error getting user details:', error);
      return null;
    }
  };

  return {
    userProgressContract,
    rewardSystemContract,
    loading,
    registerUser,
    getUserDetails,
    isUsernameAvailable
  };
};