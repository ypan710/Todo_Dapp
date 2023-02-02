const { ethers } = require("hardhat");

const main = async () => {
  const contractFactory = await ethers.getContractFactory("TaskContract");
  const contract = await contractFactory.deploy();
  await contract.deployed();
  console.log("Contract deployed to :", contract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

runMain();

// smart contract address: 0x83AE6e04aFa3ebB3939dB4B2a45DC42B1B62a970

// run "npx hardhat run scripts/deploy.js --network goerli" to deploy to Goerli network
