export interface User {
  userAddress: string;
  username: string;
  totalScore: number;
  level: number;
  joinedAt: number;
  isActive: boolean;
}

export interface LearningModule {
  title: string;
  description: string;
  requiredScore: number;
  isActive: boolean;
  createdAt: number;
}

export interface Badge {
  name: string;
  description: string;
  imageURI: string;
  requiredScore: number;
  requiredLevel: number;
  isActive: boolean;
  createdAt: number;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}