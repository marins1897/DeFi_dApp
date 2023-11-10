import { ethers, Contract } from 'ethers';
import BuyMeACoffee from './BuyMeACoffee.json';

const getBlockchain = () =>
  // eslint-disable-next-line no-unused-vars
  new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
      if(window.ethereum) { // check if you can connect to ehtereum from browser
        await window.ethereum.enable(); // wait for wallet connection
        const provider = new ethers.providers.Web3Provider(window.ethereum); // connected wallet is provider
        const signer = provider.getSigner(); // get signer from connected wallet 
        const signerAddress = await signer.getAddress(); // get address of connected and choosen account
        const coffeeContract = new Contract( // instantiate new contract
          BuyMeACoffee.address,
          BuyMeACoffee.abi,
          signer
        );
        
        resolve({signerAddress, coffeeContract}); // return address of connected account and smart contract to interact with
      }
      resolve({signerAddress: undefined, token: undefined}); // error
    });
  });

export default getBlockchain;