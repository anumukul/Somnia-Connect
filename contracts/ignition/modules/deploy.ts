import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import UserProgressModule from "./UserProgress";
import RewardSystemModule from "./RewardSystem";

const DeployModule = buildModule("DeployModule", (m) => {
  const { userProgress } = m.useModule(UserProgressModule);
  const { rewardSystem } = m.useModule(RewardSystemModule);
  
  // Set the UserProgress contract address in RewardSystem
  m.call(rewardSystem, "setUserProgressContract", [userProgress]);
  
  return {
    userProgress,
    rewardSystem,
  };
});

export default DeployModule;