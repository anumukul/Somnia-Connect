import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const UserProgressModule = buildModule("UserProgressModule", (m) => {
  const userProgress = m.contract("UserProgress");
  
  return { userProgress };
});

export default UserProgressModule;