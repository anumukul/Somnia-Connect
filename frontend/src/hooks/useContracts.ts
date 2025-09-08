import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, USER_PROGRESS_ABI, REWARD_SYSTEM_ABI } from '../utils/contracts';

export const useContracts = (provider: ethers.providers.Web3Provider | null) => {
  const [userProgressContract, setUserProgressContract] = useState<ethers.Contract | null>(null);
  const [rewardSystemContract, setRewardSystemContract] = useState<ethers.Contract | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (provider) {
      try {
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
      } catch (error) {
        console.error('Error initializing contracts:', error);
      }
    }
  }, [provider]);

  const registerUser = async (username: string) => {
    if (!userProgressContract) throw new Error('Contract not initialized');
    
    setLoading(true);
    try {
      const tx = await userProgressContract.registerUser(username);
      await tx.wait();
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
      const userDetails = await userProgressContract.getUserDetails(address);
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

  const isUsernameAvailable = async (username: string) => {
    if (!userProgressContract) return false;
    
    try {
      return await userProgressContract.isUsernameAvailable(username);
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
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