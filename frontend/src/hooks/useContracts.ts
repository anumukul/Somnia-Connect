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

  const completeModuleWithBadges = async (moduleId: number, score: number, userAddress: string) => {
    if (!userProgressContract || !rewardSystemContract) throw new Error('Contracts not initialized');
    
    setLoading(true);
    try {
      console.log('Completing module and checking for badges...');
      
      // 1. Complete the module on UserProgress contract
      const tx = await userProgressContract.completeModule(moduleId, score);
      console.log('Module completion transaction sent:', tx.hash);
      await tx.wait();
      
      // 2. Get updated user details
      const userDetails = await userProgressContract.getUserDetails(userAddress);
      const userScore = userDetails.totalScore.toNumber();
      const userLevel = userDetails.level.toNumber();
      
      // 3. Check for eligible badges
      const eligibleBadges = await rewardSystemContract.checkEligibleBadges(userAddress, userScore, userLevel);
      
      // 4. Mint eligible badges (Note: This requires the RewardSystem to be connected to UserProgress)
      for (const badgeId of eligibleBadges) {
        try {
          console.log('Minting badge:', badgeId.toString());
          const badgeTx = await rewardSystemContract.mintBadge(userAddress, badgeId);
          await badgeTx.wait();
          console.log('Badge minted successfully');
        } catch (badgeError) {
          console.error('Error minting badge:', badgeError);
          // Continue with other badges even if one fails
        }
      }
      
      return { userDetails, newBadges: eligibleBadges };
    } catch (error) {
      console.error('Error completing module:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getUserBadges = async (userAddress: string) => {
    if (!rewardSystemContract) return [];
    
    try {
      const badgeIds = await rewardSystemContract.getUserBadges(userAddress);
      const badges = [];
      
      for (const badgeId of badgeIds) {
        const badgeDetails = await rewardSystemContract.getBadgeDetails(badgeId);
        badges.push({
          id: badgeId.toNumber(),
          name: badgeDetails.name,
          description: badgeDetails.description,
          imageURI: badgeDetails.imageURI,
          earned: true,
          earnedAt: Date.now() // In real app, get from transaction timestamp
        });
      }
      
      return badges;
    } catch (error) {
      console.error('Error getting user badges:', error);
      return [];
    }
  };

  return {
    userProgressContract,
    rewardSystemContract,
    loading,
    registerUser,
    getUserDetails,
    isUsernameAvailable,
    completeModuleWithBadges,
    getUserBadges
  };
};