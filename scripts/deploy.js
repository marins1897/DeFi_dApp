const hre = require('hardhat');
const fs = require('fs');

async function main() {
    // Get the contract to deploy & Deploy
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log("BuyMeACoffee contract deployed to :", buyMeACoffee.address);

    const data = {
        address : buyMeACoffee.address,
        abi : JSON.parse(buyMeACoffee.interface.format('json'))
    };

    fs.writeFileSync('./client/src/BuyMeACoffee.json', JSON.stringify(data));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });