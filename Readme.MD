# SomniaConnect - Web2 to Web3 Onboarding Platform

## Project Overview

SomniaConnect is a comprehensive Web2-to-Web3 onboarding platform that uses account abstraction, social authentication, and progressive disclosure to seamlessly introduce users to blockchain technology. Built for the Somnia DeFi Mini Hackathon in the Dev Tooling Apps track.

## Project Architecture

```
SomniaConnect/
├── contracts/                          # Smart contracts & blockchain logic
│   ├── contracts/
│   │   ├── RewardSystem.sol            # NFT badge minting & rewards
│   │   └── UserProgress.sol            # User data & progress tracking
│   ├── ignition/
│   │   └── deployments/                # Deployment artifacts
│   ├── scripts/
│   │   ├── connectContracts.js         # Connect contracts script
│   │   └── test.js                     # Contract testing
│   ├── test/                          # Contract test files
│   ├── hardhat.config.ts              # Hardhat configuration
│   ├── package.json                   # Contract dependencies
│   └── tsconfig.json                  # TypeScript config
│
├── frontend/                          # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── CommunityChat.tsx      # Real-time chat with micropayments
│   │   │   ├── ErrorBoundary.tsx      # Error handling component
│   │   │   ├── LearningModules.tsx    # Interactive quiz system
│   │   │   ├── LiveChallenges.tsx     # Real-time competitions
│   │   │   ├── LoadingSpinner.tsx     # Loading state component
│   │   │   ├── ProgressiveDisclosure.tsx # Web3 education flow
│   │   │   ├── SocialAuth.tsx         # Web3Auth social login
│   │   │   ├── SocialFeed.tsx         # Community activity feed
│   │   │   ├── TransactionStatus.tsx  # Transaction feedback
│   │   │   ├── UserDashboard.tsx      # Main dashboard interface
│   │   │   └── UserRegistration.tsx   # Username registration
│   │   ├── config/
│   │   │   ├── biconomy.ts            # Account abstraction config
│   │   │   └── web3auth.ts            # Social auth configuration
│   │   ├── hooks/
│   │   │   └── useContracts.ts        # Smart contract interactions
│   │   ├── pages/                     # Page components (if any)
│   │   ├── types/
│   │   │   └── index.ts               # TypeScript type definitions
│   │   ├── utils/                     # Utility functions
│   │   ├── App.tsx                    # Main application component
│   │   ├── App.css                    # Application styles
│   │   ├── index.css                  # Global styles with Tailwind
│   │   ├── main.tsx                   # Application entry point
│   │   └── vite-env.d.ts             # Vite type definitions
│   ├── public/                        # Static assets
│   ├── package.json                   # Frontend dependencies
│   ├── tsconfig.json                  # TypeScript configuration
│   ├── vite.config.ts                 # Vite build configuration
│   └── eslint.config.js              # ESLint configuration
│
├── .gitignore                         # Git ignore rules
└── README.md                          # This documentation
```

## Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS v4** for utility-first styling
- **Web3Auth** for social authentication (Google, Twitter, Discord)
- **Biconomy SDK** for account abstraction and gasless transactions
- **ethers.js v5/v6** for blockchain interactions
- **Socket.io-client** for real-time features

### Smart Contracts
- **Solidity ^0.8.0** for contract development
- **Hardhat** as development environment
- **OpenZeppelin** contracts for security standards
- **Ethers.js** for contract deployment and testing

### Blockchain Infrastructure
- **Network**: Somnia Testnet
- **Chain ID**: 50312
- **RPC URL**: https://dream-rpc.somnia.network
- **Explorer**: https://shannon-explorer.somnia.network
- **Native Token**: STT (Somnia Test Token)

## Smart Contract Architecture

### UserProgress.sol
**Purpose**: Manages user registration, learning progress, and scoring system.

**Key Functions**:
- `registerUser(string username)` - Register new users with unique usernames
- `completeModule(uint256 moduleId, uint256 score)` - Record module completion
- `getUserDetails(address user)` - Retrieve user profile and progress
- `isUsernameAvailable(string username)` - Check username availability

**Storage**:
- User profiles with username, total score, level, join date
- Module completion tracking
- Level progression based on score thresholds

### RewardSystem.sol
**Purpose**: Handles NFT badge creation, minting, and reward distribution.

**Key Functions**:
- `createBadge(string name, string description, string imageURI)` - Create new badge types
- `mintBadge(address recipient, uint256 badgeId)` - Mint badges to users
- `checkEligibleBadges(address user, uint256 score, uint256 level)` - Check earned badges
- `getUserBadges(address user)` - Get user's earned badges

**Features**:
- ERC721-based NFT badges
- Automatic eligibility checking
- Badge metadata with IPFS support

## Deployed Contract Addresses

- **UserProgress**: `0x7f228c7A5708b4d4F7BACe7A6A585C2f3C9495Aa`
- **RewardSystem**: `0x0A816c723128D70fBd68bC6433a64271D512D02A`

## Core Features Implemented

### 1. Account Abstraction & Social Login
- **Web3Auth Integration**: Google, Twitter, Discord authentication
- **Biconomy Account Abstraction**: Gasless transactions for users
- **Smart Wallet Creation**: Automatic wallet generation behind the scenes
- **Seamless UX**: No initial MetaMask requirement

### 2. Progressive Web3 Disclosure System
- **Phase 1** (100+ points): Reveals "digital points" are actually tokens
- **Phase 2** (Level 3+): Explains blockchain as "permanent storage"
- **Phase 3** (200+ points): Full Web3 revelation and terminology
- **Adaptive UI**: Changes language based on user understanding level

### 3. Gamified Learning Platform
- **Interactive Quizzes**: Multiple choice questions with explanations
- **Real-time Scoring**: Immediate feedback and point calculation
- **Level Progression**: XP-based advancement system
- **Module Tracking**: On-chain completion records

### 4. NFT Badge Reward System
- **Automatic Minting**: Badges awarded based on achievements
- **Achievement Tracking**: Progress towards unlocking badges
- **Visual Display**: Badge showcase in user dashboard
- **Blockchain Proof**: Permanent ownership records

### 5. Real-Time Social Features
- **Community Chat**: Live messaging with other learners
- **STT Micropayments**: Tip other users for helpful content
- **Live Challenges**: Real-time competitions and quizzes
- **Activity Feed**: Community progress and achievements
- **Leaderboards**: Competitive ranking system

### 6. Comprehensive Dashboard
- **Tabbed Interface**: Overview, Community, Challenges sections
- **Progress Visualization**: Level bars, statistics, achievements
- **Real-time Updates**: Live data from blockchain and social features
- **Responsive Design**: Mobile and desktop optimized

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Git version control
- MetaMask wallet (for development/testing)
- Access to Somnia Testnet

### Environment Setup

#### Frontend Environment Variables
Create `frontend/.env`:
```
VITE_WEB3AUTH_CLIENT_ID=BHpUlVNYAfjGgba0cmuK-55jVU8cAFU60xParRRahhLfGu6T5NlQuTAsBBR2x
VITE_USER_PROGRESS_ADDRESS=0x7f228c7A5708b4d4F7BACe7A6A585C2f3C9495Aa
VITE_REWARD_SYSTEM_ADDRESS=0x0A816c723128D70fBd68bC6433a64271D512D02A
VITE_SOMNIA_RPC_URL=https://dream-rpc.somnia.network
VITE_CHAIN_ID=50312
```

#### Contracts Environment Variables
Create `contracts/.env`:
```
PRIVATE_KEY=your_wallet_private_key_here
SOMNIA_RPC_URL=https://dream-rpc.somnia.network
ETHERSCAN_API_KEY=your_api_key_if_available
```

### Quick Start

```bash
# Clone the repository
git clone [repository-url]
cd SomniaConnect

# Setup smart contracts
cd contracts
npm install
npx hardhat compile
npx hardhat test

# Deploy contracts (if needed)
npx hardhat run scripts/deploy.ts --network somnia

# Setup frontend
cd ../frontend
npm install

# Install additional Web3 dependencies
npm install @web3auth/modal @web3auth/base @web3auth/ethereum-provider
npm install @biconomy/account @biconomy/bundler @biconomy/common @biconomy/core-types @biconomy/paymaster
npm install socket.io-client
npm install @types/socket.io-client --save-dev

# Start development server
npm run dev
```

### Web3Auth Configuration

1. Visit https://dashboard.web3auth.io
2. Create new project: "Somnia-Connect"
3. Environment: Sapphire Devnet
4. Add whitelisted URLs:
   - http://localhost:3000
   - http://localhost:5173
5. Select Product: "Plug and Play"
6. Platform: "Web"
7. Chain: "EVM Based Chain"

## Component Descriptions

### Frontend Components

#### SocialAuth.tsx
- Handles Google, Twitter, Discord authentication via Web3Auth
- Creates Biconomy smart accounts for gasless transactions
- Provides loading states and error handling
- Manages user session state

#### UserRegistration.tsx
- Username availability checking
- On-chain user registration
- Profile creation with social login data
- Real-time validation feedback

#### UserDashboard.tsx
- Main application interface with tabbed navigation
- Progressive terminology that adapts to user understanding
- Real-time progress tracking and statistics
- Badge showcase and achievement display

#### LearningModules.tsx
- Interactive quiz system with multiple choice questions
- Real-time scoring and feedback
- On-chain progress recording
- Badge minting integration

#### CommunityChat.tsx
- Real-time messaging between users
- STT token tipping functionality
- Online user presence indicators
- Message history and moderation

#### LiveChallenges.tsx
- Real-time competitive challenges
- Leaderboard integration
- Prize pool management
- Auto-updating countdown timers

#### ProgressiveDisclosure.tsx
- Manages the gradual revelation of Web3 concepts
- Triggered by user progress milestones
- Educational modals with clear explanations
- Terminology adaptation system

### Configuration Files

#### web3auth.ts
- Web3Auth modal configuration
- Chain configuration for Somnia Testnet
- Provider setup and initialization
- Social login provider configuration

#### biconomy.ts
- Account abstraction setup
- Paymaster configuration for gasless transactions
- Bundler service configuration
- Smart account creation logic

#### useContracts.ts
- Smart contract interaction hooks
- Error handling for blockchain operations
- Transaction status management
- Real-time data fetching

## User Experience Flow

### Complete Onboarding Journey

1. **Initial Landing**: User sees familiar "sign in" interface
2. **Social Login**: Choose Google, Twitter, or Discord
3. **Profile Creation**: Select username (no blockchain terminology)
4. **Learning Start**: Begin with "digital learning modules"
5. **Progress Tracking**: Earn "points" and "achievements"
6. **Progressive Disclosure**: 
   - 100+ points: "These are actually digital tokens!"
   - Level 3+: "Your progress is stored permanently on blockchain"
   - 200+ points: "Welcome to Web3! You own these assets"
7. **Full Feature Access**: Chat, challenges, advanced features unlocked

### Key UX Principles

- **Zero Blockchain Jargon Initially**: Start with familiar terminology
- **Gradual Complexity**: Introduce concepts as users are ready
- **Immediate Gratification**: Instant feedback and rewards
- **Social Engagement**: Community features encourage retention
- **Error Prevention**: Gasless transactions prevent failed experiences

## Testing Strategy

### Automated Testing

```bash
# Smart contract tests
cd contracts
npx hardhat test

# Frontend component tests (if implemented)
cd frontend
npm run test
```

### Manual Testing Checklist

#### Core Functionality
- [ ] Social login completes successfully (Google, Twitter, Discord)
- [ ] Username registration works and checks availability
- [ ] Learning modules award correct points
- [ ] Badges mint automatically at milestones
- [ ] Dashboard displays real on-chain data
- [ ] Progressive disclosure triggers at correct thresholds

#### Real-time Features
- [ ] Chat messages send and receive instantly
- [ ] Tip functionality transfers STT tokens
- [ ] Live challenges update in real-time
- [ ] Online user status updates correctly

#### Error Handling
- [ ] Network errors show appropriate messages
- [ ] Failed transactions don't break the UI
- [ ] Loading states prevent multiple submissions
- [ ] Validation prevents invalid inputs

#### Responsive Design
- [ ] Mobile interface works properly
- [ ] Tablet layout adapts correctly
- [ ] Desktop experience is optimal

## Deployment Guide

### Frontend Deployment

#### Vercel (Recommended)
```bash
npm install -g vercel
cd frontend
npm run build
vercel --prod
```

#### Netlify Alternative
```bash
cd frontend
npm run build
npx netlify-cli deploy --prod --dir=dist
```

### Contract Deployment
```bash
cd contracts
npx hardhat run scripts/deploy.ts --network somnia
```

## Troubleshooting Guide

### Common Issues

#### Web3Auth Connection Fails
- Check client ID is correct
- Verify URLs are whitelisted
- Ensure environment variables are set
- Check browser console for specific errors

#### Contract Interaction Errors
- Verify contract addresses are correct
- Check if contracts are deployed on correct network
- Ensure user has sufficient gas (for testing)
- Verify ABI matches deployed contracts

#### Build Errors
- Delete node_modules and reinstall dependencies
- Check TypeScript version compatibility
- Verify all environment variables are set
- Update dependency versions if needed

#### Real-time Features Not Working
- Check Socket.IO server configuration
- Verify WebSocket connections are allowed
- Test with different browsers
- Check network firewall settings

## Hackathon Submission Details

### Track: Dev Tooling Apps

### Value Proposition
SomniaConnect solves the fundamental Web3 adoption problem by removing all initial barriers while providing a genuine pathway to blockchain understanding and engagement.

### Competitive Advantages
1. **True Seamlessness**: Users don't realize they're using blockchain initially
2. **Educational Focus**: Builds long-term understanding, not just usage
3. **Account Abstraction**: Removes gas fee complexity completely
4. **Real-time Features**: Showcases Somnia's speed capabilities
5. **Progressive Disclosure**: Novel approach to Web3 education

### Technical Innovation
- First platform to combine account abstraction with educational progressive disclosure
- Novel use of social authentication to create blockchain wallets
- Real-time social features demonstrating Somnia's performance
- Adaptive UI that changes terminology based on user readiness

### Demo Video Script

**[0-30s] Problem Statement**
"Web3 adoption is stuck at 1% because the onboarding experience is too complex. Users are overwhelmed by wallets, gas fees, and technical jargon."

**[30s-1:30] Solution Overview**
"SomniaConnect solves this by starting with familiar social login, then gradually revealing blockchain concepts as users are ready to understand them."

**[1:30-4:00] Live Demo**
- Social login with Google
- Username creation (no blockchain terms)
- Complete learning module earning "points"
- Progressive disclosure revealing Web3 concepts
- Real-time chat and tipping features
- Badge earning and NFT revelation

**[4:00-4:30] Technical Innovation**
"Built with account abstraction for gasless transactions, Web3Auth for seamless login, and progressive disclosure for education."

**[4:30-5:00] Impact**
"This approach successfully converts Web2 users into blockchain participants by removing barriers and building understanding gradually."

## Future Development Roadmap

### Phase 1 (Post-Hackathon)
- Advanced learning modules on DeFi, NFTs, DAOs
- Improved real-time infrastructure with dedicated servers
- Mobile app development
- Multi-language support

### Phase 2 (3-6 months)
- Integration with other blockchain networks
- Advanced social features (groups, private messaging)
- Marketplace for educational content
- Creator monetization tools

### Phase 3 (6-12 months)
- Enterprise integration for companies wanting to onboard employees
- White-label solutions for other projects
- Advanced analytics and reporting
- AI-powered personalized learning paths

## Contributing Guidelines

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes and test thoroughly
4. Commit with descriptive messages
5. Push to feature branch
6. Create pull request with detailed description

### Code Standards
- Use TypeScript for type safety
- Follow React best practices
- Write comprehensive tests for new features
- Document all new components and functions
- Ensure responsive design for all UI changes

### Security Considerations
- Never commit private keys or sensitive data
- Validate all user inputs
- Use secure communication for real-time features
- Regular dependency updates for security patches
- Smart contract audits before mainnet deployment

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact & Support

- **Project Lead**: [Your Name]
- **Email**: [Your Email]
- **GitHub**: [Repository URL]
- **Demo**: [Live Demo URL]
- **Video**: [Demo Video URL]

---

Built with ❤️ for the Somnia DeFi Mini Hackathon