import { Web3AuthModalPkg } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

const clientId = "BHpUIVNYAfjGgba0cmuK-55jVU8cAFU60xParRRahhLfGu6T5NlQuTAsBBR2xXh5dmEX4Usu1bxsSjeGeduKgz0"; 
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xC488", 
  rpcTarget: "https://dream-rpc.somnia.network",
  displayName: "Somnia Testnet",
  blockExplorer: "https://shannon-explorer.somnia.network",
  ticker: "STT",
  tickerName: "Somnia Test Token",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

export const web3auth = new Web3AuthModalPkg({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
});