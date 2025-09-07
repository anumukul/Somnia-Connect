import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const RewardSystemModule = buildModule("RewardSystemModule", (m) => {
  const rewardSystem = m.contract("RewardSystem");
  
  return { rewardSystem };
});

export default RewardSystemModule;