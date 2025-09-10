import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import io from 'socket.io-client';

interface User {
  userAddress: string;
  username: string;
  totalScore: number;
  level: number;
  joinedAt: number;
  isActive: boolean;
}

interface Message {
  id: string;
  username: string;
  message: string;
  timestamp: number;
  userLevel: number;
  tip?: number;
}

interface CommunityChatProps {
  provider: ethers.providers.Web3Provider;
  user: User;
}

const CommunityChat: React.FC<CommunityChatProps> = ({ provider, user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [socket, setSocket] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [tipAmount, setTipAmount] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize socket connection (for demo, we'll simulate this)
    const socketConnection = io('ws://localhost:3001', {
      transports: ['websocket']
    });

    socketConnection.on('connect', () => {
      console.log('Connected to chat server');
      socketConnection.emit('join', { username: user.username, level: user.level });
    });

    socketConnection.on('message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socketConnection.on('onlineUsers', (users: string[]) => {
      setOnlineUsers(users);
    });

    setSocket(socketConnection);

    // Simulate some initial messages
    const initialMessages: Message[] = [
      {
        id: '1',
        username: 'alice_crypto',
        message: 'Just completed the DeFi basics module! 🎉',
        timestamp: Date.now() - 300000,
        userLevel: 3
      },
      {
        id: '2',
        username: 'bob_web3',
        message: 'Anyone want to team up for the community challenge?',
        timestamp: Date.now() - 180000,
        userLevel: 5
      },
      {
        id: '3',
        username: 'carol_nft',
        message: 'Thanks for the tip! Really helped me understand smart contracts 💡',
        timestamp: Date.now() - 60000,
        userLevel: 2,
        tip: 5
      }
    ];
    setMessages(initialMessages);

    // Simulate online users
    setOnlineUsers(['alice_crypto', 'bob_web3', 'carol_nft', user.username]);

    return () => {
      socketConnection.disconnect();
    };
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      username: user.username,
      message: newMessage,
      timestamp: Date.now(),
      userLevel: user.level
    };

    // In real implementation, this would go through the socket
    setMessages(prev => [...prev, message]);
    
    // Simulate socket emit
    if (socket) {
      socket.emit('sendMessage', message);
    }

    setNewMessage('');
  };

  const sendTip = async () => {
    if (!selectedUser || !tipAmount) return;

    try {
      // Create a simple tip transaction
      const signer = provider.getSigner();
      const tipAmountWei = ethers.utils.parseEther(tipAmount);
      
      // For demo purposes, we'll simulate this
      console.log(`Sending ${tipAmount} STT to ${selectedUser}`);
      
      // In real implementation, this would be a smart contract call
      const tipMessage: Message = {
        id: Date.now().toString(),
        username: user.username,
        message: `Sent ${tipAmount} STT tip to @${selectedUser} 💰`,
        timestamp: Date.now(),
        userLevel: user.level,
        tip: parseFloat(tipAmount)
      };

      setMessages(prev => [...prev, tipMessage]);
      setSelectedUser('');
      setTipAmount('');
    } catch (error) {
      console.error('Error sending tip:', error);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getLevelBadge = (level: number) => {
    if (level >= 10) return '🏆';
    if (level >= 5) return '⭐';
    if (level >= 3) return '🌟';
    return '🔰';
  };

  return (
    <div className="card">
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Community Chat</h3>
        <p className="text-sm text-gray-600">{onlineUsers.length} learners online</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Online Users */}
        <div className="lg:col-span-1">
          <h4 className="font-medium text-gray-700 mb-2">Online Now</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {onlineUsers.map((username, index) => (
              <div 
                key={index}
                className={`flex items-center text-sm p-2 rounded cursor-pointer hover:bg-gray-50 ${
                  selectedUser === username ? 'bg-blue-50 border border-blue-200' : ''
                }`}
                onClick={() => setSelectedUser(username)}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className={username === user.username ? 'font-medium' : ''}>
                  {username} {username === user.username && '(you)'}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Tip */}
          {selectedUser && selectedUser !== user.username && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <h5 className="text-sm font-medium text-gray-700">Send Tip</h5>
              <div className="mt-2 space-y-2">
                <input
                  type="number"
                  placeholder="Amount (STT)"
                  value={tipAmount}
                  onChange={(e) => setTipAmount(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                />
                <button
                  onClick={sendTip}
                  className="w-full px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                >
                  Tip @{selectedUser}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Chat Messages */}
        <div className="lg:col-span-3">
          <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 space-y-3">
            {messages.map((message) => (
              <div key={message.id} className="flex flex-col">
                <div className="flex items-start space-x-2">
                  <span className="text-lg">{getLevelBadge(message.userLevel)}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-800">{message.username}</span>
                      <span className="text-xs text-gray-500">Level {message.userLevel}</span>
                      <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                    </div>
                    <p className={`text-sm mt-1 ${message.tip ? 'text-yellow-700 font-medium' : 'text-gray-700'}`}>
                      {message.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="mt-4 flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityChat;