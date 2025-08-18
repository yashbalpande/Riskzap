import "@nomiclabs/hardhat-ethers";
import "dotenv/config";

export default {
  solidity: "0.8.19",
  networks: {
    "shardeum-unstablenet": {
      url: "https://api-unstable.shardeum.org",
      chainId: 8080,
      accounts: process.env.PRIVATE_KEY ? [`0x${process.env.PRIVATE_KEY}`] : [],
    },
  },
};
