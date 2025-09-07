// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract RewardSystem is ERC721, Ownable, ReentrancyGuard {
    uint256 private _tokenIds;

    struct Badge {
        string name;
        string description;
        string imageURI;
        uint256 requiredScore;
        uint256 requiredLevel;
        bool isActive;
        uint256 createdAt;
    }

    struct UserReward {
        uint256 totalPoints;
        uint256 totalBadges;
        uint256[] ownedBadges;
        mapping(uint256 => bool) hasBadge;
    }

    mapping(uint256 => Badge) public badges;
    mapping(address => UserReward) public userRewards;
    mapping(uint256 => uint256) public tokenToBadge; // tokenId => badgeId
    mapping(uint256 => address) public tokenToOwner;

    uint256 public totalBadges;
    address public userProgressContract;

    event BadgeCreated(uint256 badgeId, string name, uint256 requiredScore);
    event BadgeMinted(address indexed user, uint256 tokenId, uint256 badgeId);
    event PointsAwarded(address indexed user, uint256 points);

    modifier onlyUserProgressContract() {
        require(
            msg.sender == userProgressContract,
            "Only UserProgress contract can call this"
        );
        _;
    }

    constructor() ERC721("SomniaConnect Badges", "SCB") Ownable(msg.sender) {
        // Initialize default badges
        _createBadge(
            "First Steps",
            "Completed your first learning module",
            "",
            50,
            1
        );
        _createBadge("Knowledge Seeker", "Reached level 5", "", 500, 5);
        _createBadge(
            "Web3 Expert",
            "Completed all basic modules",
            "",
            1000,
            10
        );
    }

    function setUserProgressContract(
        address _userProgressContract
    ) external onlyOwner {
        userProgressContract = _userProgressContract;
    }

    function createBadge(
        string memory _name,
        string memory _description,
        string memory _imageURI,
        uint256 _requiredScore,
        uint256 _requiredLevel
    ) external onlyOwner {
        _createBadge(
            _name,
            _description,
            _imageURI,
            _requiredScore,
            _requiredLevel
        );
    }

    function _createBadge(
        string memory _name,
        string memory _description,
        string memory _imageURI,
        uint256 _requiredScore,
        uint256 _requiredLevel
    ) internal {
        badges[totalBadges] = Badge({
            name: _name,
            description: _description,
            imageURI: _imageURI,
            requiredScore: _requiredScore,
            requiredLevel: _requiredLevel,
            isActive: true,
            createdAt: block.timestamp
        });

        emit BadgeCreated(totalBadges, _name, _requiredScore);
        totalBadges++;
    }

    function awardPoints(
        address _user,
        uint256 _points
    ) external onlyUserProgressContract {
        userRewards[_user].totalPoints += _points;
        emit PointsAwarded(_user, _points);
    }

    function mintBadge(
        address _user,
        uint256 _badgeId
    ) external onlyUserProgressContract nonReentrant {
        require(_badgeId < totalBadges, "Badge does not exist");
        require(badges[_badgeId].isActive, "Badge is not active");
        require(
            !userRewards[_user].hasBadge[_badgeId],
            "User already has this badge"
        );

        _tokenIds++;
        uint256 tokenId = _tokenIds;

        _safeMint(_user, tokenId);

        tokenToBadge[tokenId] = _badgeId;
        tokenToOwner[tokenId] = _user;
        userRewards[_user].hasBadge[_badgeId] = true;
        userRewards[_user].ownedBadges.push(_badgeId);
        userRewards[_user].totalBadges++;

        emit BadgeMinted(_user, tokenId, _badgeId);
    }

    function checkEligibleBadges(
        address _user,
        uint256 _userScore,
        uint256 _userLevel
    ) external view returns (uint256[] memory) {
        uint256[] memory eligible = new uint256[](totalBadges);
        uint256 count = 0;

        for (uint256 i = 0; i < totalBadges; i++) {
            if (
                badges[i].isActive &&
                !userRewards[_user].hasBadge[i] &&
                _userScore >= badges[i].requiredScore &&
                _userLevel >= badges[i].requiredLevel
            ) {
                eligible[count] = i;
                count++;
            }
        }

        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = eligible[i];
        }

        return result;
    }

    function getUserBadges(
        address _user
    ) external view returns (uint256[] memory) {
        return userRewards[_user].ownedBadges;
    }

    function getUserRewardInfo(
        address _user
    ) external view returns (uint256, uint256) {
        return (userRewards[_user].totalPoints, userRewards[_user].totalBadges);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");

        uint256 badgeId = tokenToBadge[tokenId];
        Badge memory badge = badges[badgeId];

        // Return IPFS URI or base64 encoded JSON metadata
        return badge.imageURI;
    }

    function getBadgeDetails(
        uint256 _badgeId
    ) external view returns (Badge memory) {
        require(_badgeId < totalBadges, "Badge does not exist");
        return badges[_badgeId];
    }
}
