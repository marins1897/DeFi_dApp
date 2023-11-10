/** @type import('hardhat/config').HardhatUserConfig */
require('@nomiclabs/hardhat-waffle'); 
require('@nomiclabs/hardhat-ethers');
require('dotenv').config();

const ALCHEMY_GOERLI_URL=process.env.API_URL;
const PRIVATE_KEY=process.env.METAMASK_KEY;

module.exports = {
  solidity: "0.8.0",
  networks : {
    goerli : {
      url : ALCHEMY_GOERLI_URL,
      accounts : [PRIVATE_KEY],
      // accounts: [`0x${PRIVATE_KEY}`]
    }
  }
};
