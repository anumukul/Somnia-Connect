import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface User {
  userAddress: string;
  username: string;
  totalScore: number;
  level: number;
  joinedAt: number;
  isActive: boolean;
}

interface FeedItem {
  id: string;
  type: 'achievement' | 'level_up' | 'module_complete' | 'badge_earned';
  username: string;
  message: string;
  timestamp: number;
  score?: number;
  level?: number;
}

interface SocialFeedProps {
  provider: ethers.providers.Web3Provider;
  user: User;
}

const SocialFeed: React.FC<SocialFeedProps> = ({ provider, user }) => {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<User[]>([]);

  useEffect(() => {
    // Simulate real-time feed updates
    const sampleFeed: FeedItem[] = [
      {
        id: '1',
        type: 'level_up',
        username: user.username,
        message: `reached level ${user.level}!`,
        timestamp: Date.now() - 300000,
        level: user.level
      },
      {
        id: '2',
        type: 'module_complete',
        username: 'alice_crypto',
        message: 'completed Web3 Basics module',
        timestamp: Date.now() - 600000,
        score: 85
      },
      {
        id: '3',
        type: 'badge_earned',
        username: 'bob_defi',
        message: 'earned the "First Steps" badge',
        timestamp: Date.now() - 900000
      },
      {
        id: '4',
        type: 'level_up',
        username: 'carol_nft',
        message: 'reached level 3!',
        timestamp: Date.now() - 1200000,
        level: 3
      }
    ];

    setFeedItems(sampleFeed);

    // Simulate leaderboard
    const sampleLeaderboard: User[] = [
      { ...user, username: user.username, totalScore: user.totalScore, level: user.level },
      { userAddress: '0x...', username: 'alice_crypto', totalScore: 450, level: 5, joinedAt: Date.now(), isActive: true },
      { userAddress: '0x...', username: 'bob_defi', totalScore: 380, level: 4, joinedAt: Date.now(), isActive: true },
      { userAddress: '0x...', username: 'carol_nft', totalScore: 320, level: 4, joinedAt: Date.now(), isActive: true },
      { userAddress: '0x...', username: 'dave_web3', totalScore: 280, level: 3, joinedAt: Date.now(), isActive: true }
    ].sort((a, b) => b.totalScore - a.totalScore);

    setLeaderboard(sampleLeaderboard);
  }, [user]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'level_up': return '🚀';
      case 'module_complete': return '📚';
      case 'badge_earned': return '🏆';
      default: return '⭐';
    }
  };

  const getTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Activity Feed */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Community Activity</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {feedItems.map((item) => (
            <div key={item.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl">{getActivityIcon(item.type)}</div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium text-blue-600">{item.username}</span>
                  {' '}{item.message}
                  {item.score && <span className="text-green-600"> ({item.score} points)</span>}
                </p>
                <p className="text-xs text-gray-500">{getTimeAgo(item.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Leaderboard</h3>
        <div className="space-y-2">
          {leaderboard.slice(0, 10).map((player, index) => (
            <div 
              key={player.userAddress} 
              className={`flex items-center justify-between p-3 rounded-lg ${
                player.username === user.username ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0 ? 'bg-yellow-400 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  index === 2 ? 'bg-orange-400 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{player.username}</p>
                  <p className="text-xs text-gray-500">Level {player.level}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-purple-600">{player.totalScore}</p>
                <p className="text-xs text-gray-500">points</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialFeed;