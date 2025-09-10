import React, { useState, useEffect } from 'react';

interface User {
  userAddress: string;
  username: string;
  totalScore: number;
  level: number;
  joinedAt: number;
  isActive: boolean;
}

interface ProgressiveDisclosureProps {
  user: User;
  onDisclosureComplete: () => void;
}

const ProgressiveDisclosure: React.FC<ProgressiveDisclosureProps> = ({ user, onDisclosureComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const disclosureSteps = [
    {
      trigger: user.totalScore >= 100,
      title: "You're Earning Digital Assets!",
      content: "Those points you've been earning? They're actually stored as digital tokens on a secure network. Think of them like loyalty points, but owned entirely by you!",
      icon: "💎"
    },
    {
      trigger: user.level >= 3,
      title: "Your Progress is Permanent",
      content: "Your achievements are recorded on something called a 'blockchain' - a digital ledger that means your progress can never be lost or taken away.",
      icon: "🔒"
    },
    {
      trigger: user.totalScore >= 200,
      title: "Welcome to Web3!",
      content: "You've been using blockchain technology this whole time! You now have a digital wallet and real cryptocurrency tokens. Ready to explore more?",
      icon: "🌐"
    }
  ];

  useEffect(() => {
    const nextStep = disclosureSteps.find((step, index) => 
      index > currentStep && step.trigger
    );

    if (nextStep) {
      const stepIndex = disclosureSteps.indexOf(nextStep);
      setCurrentStep(stepIndex);
      setShowModal(true);
    }
  }, [user.totalScore, user.level, currentStep]);

  const handleContinue = () => {
    setShowModal(false);
    if (currentStep === disclosureSteps.length - 1) {
      onDisclosureComplete();
    }
  };

  if (!showModal) return null;

  const currentDisclosure = disclosureSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <div className="text-center">
          <div className="text-4xl mb-4">{currentDisclosure.icon}</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{currentDisclosure.title}</h2>
          <p className="text-gray-600 mb-6">{currentDisclosure.content}</p>
          
          <div className="flex space-x-3">
            <button
              onClick={handleContinue}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              {currentStep === disclosureSteps.length - 1 ? "Explore Web3!" : "Cool, got it!"}
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-500 hover:text-gray-700"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressiveDisclosure;