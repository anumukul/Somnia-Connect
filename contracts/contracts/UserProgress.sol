// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract UserProgress is Ownable, ReentrancyGuard {
    struct User {
        address userAddress;
        string username;
        uint256 totalScore;
        uint256 level;
        uint256 joinedAt;
        bool isActive;
    }

    struct LearningModule {
        string title;
        string description;
        uint256 requiredScore;
        bool isActive;
        uint256 createdAt;
    }

    struct UserModuleProgress {
        bool completed;
        uint256 score;
        uint256 completedAt;
        uint256 attempts;
    }

    mapping(address => User) public users;
    mapping(uint256 => LearningModule) public modules;
    mapping(address => mapping(uint256 => UserModuleProgress))
        public userProgress;
    mapping(string => address) public usernameToAddress;

    uint256 public totalUsers;
    uint256 public totalModules;
    uint256 public constant LEVEL_MULTIPLIER = 100;

    event UserRegistered(address indexed user, string username);
    event ModuleCompleted(
        address indexed user,
        uint256 moduleId,
        uint256 score
    );
    event LevelUp(address indexed user, uint256 newLevel);
    event ModuleCreated(uint256 moduleId, string title);

    constructor() Ownable(msg.sender) {
        // Initialize with first learning module
        _createModule(
            "Web3 Basics",
            "Introduction to blockchain and Web3 concepts",
            50
        );
    }

    function registerUser(string memory _username) external {
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(
            usernameToAddress[_username] == address(0),
            "Username already taken"
        );
        require(!users[msg.sender].isActive, "User already registered");

        users[msg.sender] = User({
            userAddress: msg.sender,
            username: _username,
            totalScore: 0,
            level: 1,
            joinedAt: block.timestamp,
            isActive: true
        });

        usernameToAddress[_username] = msg.sender;
        totalUsers++;

        emit UserRegistered(msg.sender, _username);
    }

    function completeModule(
        uint256 _moduleId,
        uint256 _score
    ) external nonReentrant {
        require(users[msg.sender].isActive, "User not registered");
        require(modules[_moduleId].isActive, "Module not active");
        require(_score <= 100, "Score cannot exceed 100");
        require(
            !userProgress[msg.sender][_moduleId].completed,
            "Module already completed"
        );

        userProgress[msg.sender][_moduleId] = UserModuleProgress({
            completed: true,
            score: _score,
            completedAt: block.timestamp,
            attempts: userProgress[msg.sender][_moduleId].attempts + 1
        });

        users[msg.sender].totalScore += _score;

        uint256 newLevel = (users[msg.sender].totalScore / LEVEL_MULTIPLIER) +
            1;
        if (newLevel > users[msg.sender].level) {
            users[msg.sender].level = newLevel;
            emit LevelUp(msg.sender, newLevel);
        }

        emit ModuleCompleted(msg.sender, _moduleId, _score);
    }

    function createModule(
        string memory _title,
        string memory _description,
        uint256 _requiredScore
    ) external onlyOwner {
        _createModule(_title, _description, _requiredScore);
    }

    function _createModule(
        string memory _title,
        string memory _description,
        uint256 _requiredScore
    ) internal {
        modules[totalModules] = LearningModule({
            title: _title,
            description: _description,
            requiredScore: _requiredScore,
            isActive: true,
            createdAt: block.timestamp
        });

        emit ModuleCreated(totalModules, _title);
        totalModules++;
    }

    function getUserDetails(address _user) external view returns (User memory) {
        return users[_user];
    }

    function getUserModuleProgress(
        address _user,
        uint256 _moduleId
    ) external view returns (UserModuleProgress memory) {
        return userProgress[_user][_moduleId];
    }

    function isUsernameAvailable(
        string memory _username
    ) external view returns (bool) {
        return usernameToAddress[_username] == address(0);
    }
}
