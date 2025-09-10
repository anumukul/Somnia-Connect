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

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'speed' | 'collaboration';
  participants: string[];
  prize: number;
  timeLeft: number;
  status: 'active' | 'completed' | 'starting';
  question?: string;
  options?: string[];
  correctAnswer?: number;
}

interface LiveChallengesProps {
  provider: ethers.providers.Web3Provider;
  user: User;
}

const LiveChallenges: React.FC<LiveChallengesProps> = ({ provider, user }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);

  useEffect(() => {
    // Simulate live challenges
    const mockChallenges: Challenge[] = [
      {
        id: '1',
        title: 'Quick Quiz: DeFi Basics',
        description: 'First 5 people to answer correctly win 10 STT each!',
        type: 'speed',
        participants: ['alice_crypto', 'bob_web3'],
        prize: 50,
        timeLeft: 180,
        status: 'active',
        question: 'What does AMM stand for in DeFi?',
        options: [
          'Automated Market Maker',
          'Advanced Money Management',
          'Asset Management Module',
          'Algorithmic Market Model'
        ],
        correctAnswer: 0
      },
      {
        id: '2',
        title: 'Community Goal: 100 Modules',
        description: 'Complete 100 learning modules as a community this week',
        type: 'collaboration',
        participants: ['alice_crypto', 'bob_web3', 'carol_nft', user.username],
        prize: 200,
        timeLeft: 86400,
        status: 'active'
      }
    ];

    setChallenges(mockChallenges);

    // Simulate countdown timer
    const timer = setInterval(() => {
      setChallenges(prev => prev.map(challenge => ({
        ...challenge,
        timeLeft: Math.max(0, challenge.timeLeft - 1)
      })));
    }, 1000);

    return () => clearInterval(timer);
  }, [user.username]);

  const joinChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, participants: [...challenge.participants, user.username] }
        : challenge
    ));
    setActiveChallenge(challengeId);
  };

  const submitAnswer = async (challengeId: string, answer: number) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge || challenge.correctAnswer === undefined) return;

    setUserAnswer(answer);

    // Simulate submission
    if (answer === challenge.correctAnswer) {
      console.log('Correct answer! You won the challenge!');
      
      // In real implementation, this would trigger a smart contract transaction
      try {
        // Simulate prize distribution
        console.log(`Sending ${challenge.prize / 5} STT prize...`);
        
        // Update challenge status
        setChallenges(prev => prev.map(c => 
          c.id === challengeId 
            ? { ...c, status: 'completed' as const }
            : c
        ));
      } catch (error) {
        console.error('Error claiming prize:', error);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'speed': return '⚡';
      case 'quiz': return '🧠';
      case 'collaboration': return '🤝';
      default: return '🏆';
    }
  };

  return (
    <div className="card">
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Live Challenges</h3>
        <p className="text-sm text-gray-600">Compete in real-time and earn rewards</p>
      </div>

      <div className="space-y-4">
        {challenges.map((challenge) => (
          <div key={challenge.id} className={`border rounded-lg p-4 ${
            challenge.status === 'active' ? 'border-green-300 bg-green-50' : 
            challenge.status === 'completed' ? 'border-gray-300 bg-gray-50' : 'border-blue-300 bg-blue-50'
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getChallengeIcon(challenge.type)}</span>
                <div>
                  <h4 className="font-medium text-gray-800">{challenge.title}</h4>
                  <p className="text-sm text-gray-600">{challenge.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">{challenge.prize} STT</div>
                <div className="text-xs text-gray-500">Prize Pool</div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {challenge.participants.length} participants
                </span>
                <span className={`text-sm font-medium ${
                  challenge.timeLeft < 60 ? 'text-red-600' : 'text-orange-600'
                }`}>
                  {formatTime(challenge.timeLeft)} left
                </span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                challenge.status === 'active' ? 'bg-green-100 text-green-800' :
                challenge.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {challenge.status}
              </span>
            </div>

            {challenge.question && challenge.status === 'active' && (
              <div className="mt-4 p-3 bg-white rounded border">
                <p className="font-medium text-gray-800 mb-3">{challenge.question}</p>
                <div className="space-y-2">
                  {challenge.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => submitAnswer(challenge.id, index)}
                      disabled={userAnswer !== null}
                      className={`w-full text-left p-2 border rounded hover:bg-gray-50 disabled:opacity-50 ${
                        userAnswer === index ? 
                          (index === challenge.correctAnswer ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500') :
                          'border-gray-300'
                      }`}
                    >
                      {String.fromCharCode(65 + index)}. {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!challenge.participants.includes(user.username) && challenge.status === 'active' && (
              <button
                onClick={() => joinChallenge(challenge.id)}
                className="w-full mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Join Challenge
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveChallenges;