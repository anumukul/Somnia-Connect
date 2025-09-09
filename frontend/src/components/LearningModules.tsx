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

interface LearningModule {
  id: number;
  title: string;
  description: string;
  content: string;
  questions: Question[];
  requiredScore: number;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface LearningModulesProps {
  provider: ethers.providers.Web3Provider;
  user: User;
  onProgressUpdate: (updatedUser: User) => void;
}

const LearningModules: React.FC<LearningModulesProps> = ({ provider, user, onProgressUpdate }) => {
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { completeModuleWithBadges, getUserDetails } = useContracts(provider);

  // Sample learning modules (in real app, this would come from smart contract or API)
  const modules: LearningModule[] = [
    {
      id: 0,
      title: "Web3 Basics",
      description: "Introduction to blockchain and Web3 concepts",
      content: `
        Welcome to Web3! This module covers the fundamentals of blockchain technology.
        
        Key Concepts:
        • Blockchain: A distributed ledger technology
        • Decentralization: No single point of control
        • Smart Contracts: Self-executing contracts with code
        • Wallets: Your gateway to Web3
        • Tokens: Digital assets on blockchain
      `,
      questions: [
        {
          id: 1,
          question: "What is a blockchain?",
          options: [
            "A physical chain of blocks",
            "A distributed ledger technology",
            "A type of cryptocurrency",
            "A computer program"
          ],
          correctAnswer: 1,
          explanation: "A blockchain is a distributed ledger technology that maintains a continuously growing list of records."
        },
        {
          id: 2,
          question: "What makes blockchain decentralized?",
          options: [
            "It's controlled by one company",
            "It runs on multiple computers worldwide",
            "It's stored in the cloud",
            "It uses artificial intelligence"
          ],
          correctAnswer: 1,
          explanation: "Blockchain is decentralized because it runs on multiple computers (nodes) worldwide, with no single point of control."
        },
        {
          id: 3,
          question: "What is a smart contract?",
          options: [
            "A legal document",
            "Self-executing code on blockchain",
            "A type of wallet",
            "A trading algorithm"
          ],
          correctAnswer: 1,
          explanation: "A smart contract is self-executing code that runs on the blockchain and automatically enforces agreements."
        }
      ],
      requiredScore: 50
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < selectedModule!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateAndSubmitResults();
    }
  };

  const calculateAndSubmitResults = async () => {
    if (!selectedModule) return;

    const correctAnswers = userAnswers.filter((answer, index) => 
      answer === selectedModule.questions[index].correctAnswer
    ).length;

    const score = Math.round((correctAnswers / selectedModule.questions.length) * 100);
    
    setShowResults(true);
    setIsSubmitting(true);

    try {
      // Use the new function that handles both module completion and badge minting
      const result = await completeModuleWithBadges(selectedModule.id, score, user.userAddress);
      
      if (result.newBadges.length > 0) {
        // Show badge notification
        console.log('New badges earned:', result.newBadges);
        // You can add a toast notification here
      }
      
      // Update user details
      if (result.userDetails) {
        onProgressUpdate({
          userAddress: result.userDetails.userAddress,
          username: result.userDetails.username,
          totalScore: result.userDetails.totalScore.toNumber(),
          level: result.userDetails.level.toNumber(),
          joinedAt: result.userDetails.joinedAt.toNumber(),
          isActive: result.userDetails.isActive
        });
      }
    } catch (error) {
      console.error('Error submitting module completion:', error);
      // Add user-friendly error message
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetModule = () => {
    setSelectedModule(null);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setShowResults(false);
  };

  if (showResults && selectedModule) {
    const correctAnswers = userAnswers.filter((answer, index) => 
      answer === selectedModule.questions[index].correctAnswer
    ).length;
    const score = Math.round((correctAnswers / selectedModule.questions.length) * 100);

    return (
      <div className="card max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className={`w-20 h-20 ${score >= 70 ? 'bg-green-500' : 'bg-yellow-500'} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <span className="text-3xl text-white">{score >= 70 ? '🎉' : '📚'}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Module Complete!</h3>
          <p className="text-gray-600">Your score: {score}%</p>
        </div>

        <div className="space-y-4 mb-6">
          {selectedModule.questions.map((question, index) => (
            <div key={question.id} className="border rounded-lg p-4">
              <p className="font-medium mb-2">{question.question}</p>
              <p className={`text-sm ${userAnswers[index] === question.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                Your answer: {question.options[userAnswers[index]]}
                {userAnswers[index] !== question.correctAnswer && (
                  <span className="block text-green-600">
                    Correct: {question.options[question.correctAnswer]}
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-1">{question.explanation}</p>
            </div>
          ))}
        </div>

        <button 
          onClick={resetModule}
          className="btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving Progress...' : 'Continue Learning'}
        </button>
      </div>
    );
  }

  if (selectedModule) {
    const question = selectedModule.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedModule.questions.length) * 100;

    return (
      <div className="card max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Question {currentQuestion + 1} of {selectedModule.questions.length}</span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-4">{question.question}</h3>

        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                userAnswers[currentQuestion] === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          <button 
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            className="btn-secondary"
            disabled={currentQuestion === 0}
          >
            Previous
          </button>
          <button 
            onClick={handleNextQuestion}
            className="btn-primary"
            disabled={userAnswers[currentQuestion] === undefined}
          >
            {currentQuestion === selectedModule.questions.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Learning Modules</h2>
        <p className="text-gray-600">Complete modules to earn points and unlock badges</p>
      </div>

      <div className="grid gap-6">
        {modules.map((module) => (
          <div key={module.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{module.title}</h3>
                <p className="text-gray-600 mb-4">{module.description}</p>
              </div>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {module.questions.length} questions
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">{module.content}</pre>
            </div>

            <button 
              onClick={() => setSelectedModule(module)}
              className="btn-primary"
            >
              Start Module
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningModules;