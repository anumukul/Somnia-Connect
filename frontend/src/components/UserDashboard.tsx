import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useContracts } from '../hooks/useContracts';
import SocialFeed from './SocialFeed';
import CommunityChat from './CommunityChat';
import LiveChallenges from './LiveChallenges';
import ProgressiveDisclosure from './ProgressiveDisclosure';

interface User {
  userAddress: string;
  username: string;
  totalScore: number;
  level: number;
  joinedAt: number;
  isActive: boolean;
}

interface Badge {
  id: number;
  name: string;
  description: string;
  earned: boolean;
  earnedAt?: number;
}

interface UserDashboardProps {
  provider: ethers.providers.Web3Provider;
  user: User;
  onStartLearning: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ provider, user, onStartLearning }) => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);
  const [web3Revealed, setWeb3Revealed] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'social' | 'challenges'>('overview');

  const { getUserBadges, rewardSystemContract } = useContracts(provider);

  // Check if user has progressed enough to see Web3 features
  useEffect(() => {
    const hasHighProgress = user.totalScore >= 200 || user.level >= 3;
    setWeb3Revealed(hasHighProgress);
  }, [user]);

  useEffect(() => {
    const fetchRealBadges = async () => {
      try {
        const earnedBadges = await getUserBadges(user.userAddress);
        const totalBadges = await rewardSystemContract?.totalBadges();
        const allBadges = [];
        
        for (let i = 0; i < (totalBadges?.toNumber() || 3); i++) {
          try {
            const badgeDetails = await rewardSystemContract?.getBadgeDetails(i);
            const isEarned = earnedBadges.some(badge => badge.id === i);
            
            allBadges.push({
              id: i,
              name: badgeDetails?.name || `Achievement ${i + 1}`,
              description: badgeDetails?.description || 'Complete challenges to earn this',
              earned: isEarned,
              earnedAt: isEarned ? Date.now() : undefined
            });
          } catch (error) {
            console.error('Error fetching badge details:', error);
          }
        }
        
        setBadges(allBadges);
      } catch (error) {
        console.error('Error fetching badges:', error);
        setBadges([
          {
            id: 0,
            name: "First Steps",
            description: "Completed your first learning module",
            earned: user.totalScore >= 50,
            earnedAt: user.totalScore >= 50 ? Date.now() : undefined
          },
          {
            id: 1,
            name: "Knowledge Seeker",
            description: "Reached level 5",
            earned: user.level >= 5,
            earnedAt: undefined
          },
          {
            id: 2,
            name: "Digital Expert",
            description: "Completed all basic modules",
            earned: false,
            earnedAt: undefined
          }
        ]);
      }
    };

    fetchRealBadges();

    setRecentActivity([
      "Joined SomniaConnect",
      user.totalScore > 0 ? "Completed learning module" : "",
      user.level > 1 ? `Reached level ${user.level}` : ""
    ].filter(Boolean));
  }, [user, getUserBadges, rewardSystemContract]);

  const getProgressToNextLevel = () => {
    const currentLevelScore = (user.level - 1) * 100;
    const nextLevelScore = user.level * 100;
    const progress = ((user.totalScore - currentLevelScore) / (nextLevelScore - currentLevelScore)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const earnedBadges = badges.filter(badge => badge.earned);
  const availableBadges = badges.filter(badge => !badge.earned);

  // Progressive terminology based on user understanding
  const terminology = {
    points: web3Revealed ? "Tokens" : "Points",
    badges: web3Revealed ? "NFT Badges" : "Achievements",
    wallet: web3Revealed ? "Digital Wallet" : "Account",
    network: web3Revealed ? "Blockchain Network" : "Secure Platform"
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <ProgressiveDisclosure 
        user={user} 
        onDisclosureComplete={() => setWeb3Revealed(true)} 
      />

      {/* Welcome Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {user.username}!
        </h2>
        <p className="text-gray-600">
          {web3Revealed ? "Continue your Web3 journey" : "Continue your learning journey"}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'overview' 
                ? 'bg-white text-blue-600 shadow' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'social' 
                ? 'bg-white text-blue-600 shadow' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Community
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'challenges' 
                ? 'bg-white text-blue-600 shadow' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Challenges
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">📊</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{user.level}</div>
              <div className="text-sm text-gray-500">Current Level</div>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">{web3Revealed ? "💎" : "⭐"}</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">{user.totalScore}</div>
              <div className="text-sm text-gray-500">Total {terminology.points}</div>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">🏆</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{earnedBadges.length}</div>
              <div className="text-sm text-gray-500">{terminology.badges} Earned</div>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">📅</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                {Math.floor((Date.now() - user.joinedAt * 1000) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="text-sm text-gray-500">Days Active</div>
            </div>
          </div>

          {/* Progress to Next Level */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Level Progress</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Level {user.level}</span>
              <span className="text-sm text-gray-600">Level {user.level + 1}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${getProgressToNextLevel()}%` }}
              ></div>
            </div>
            <div className="text-center mt-2">
              <span className="text-sm text-gray-600">
                {user.level * 100 - user.totalScore} {terminology.points.toLowerCase()} to next level
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Earned Badges */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Your {terminology.badges}</h3>
              {earnedBadges.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <p className="text-gray-500">No {terminology.badges.toLowerCase()} earned yet</p>
                  <button 
                    onClick={onStartLearning}
                    className="btn-primary mt-4"
                  >
                    Start Learning
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {earnedBadges.map((badge) => (
                    <div key={badge.id} className="border-2 border-green-200 rounded-lg p-4 text-center bg-green-50">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white">✓</span>
                      </div>
                      <h4 className="font-medium text-gray-800">{badge.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Available Badges */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Available {terminology.badges}</h3>
              <div className="space-y-3">
                {availableBadges.map((badge) => (
                  <div key={badge.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-gray-400">?</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{badge.name}</h4>
                      <p className="text-xs text-gray-600">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
            <div className="space-y-2">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  {activity}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="text-center">
            <button 
              onClick={onStartLearning}
              className="btn-primary text-lg px-8 py-4"
            >
              Continue Learning
            </button>
          </div>
        </>
      )}

      {activeTab === 'social' && (
        <div className="space-y-8">
          <CommunityChat provider={provider} user={user} />
          <SocialFeed provider={provider} user={user} />
        </div>
      )}

      {activeTab === 'challenges' && (
        <LiveChallenges provider={provider} user={user} />
      )}

      {/* Web3 Reveal Notice */}
      {web3Revealed && (
        <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🌐</span>
            <div>
              <h4 className="font-semibold text-blue-800">You're now using Web3!</h4>
              <p className="text-sm text-blue-600">
                Your progress is secured on the {terminology.network.toLowerCase()}, and you own your digital assets.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;