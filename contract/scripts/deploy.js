const ethers = require('ethers');
require('dotenv').config();

async function main() {
  const url = process.env.ALCHEMY_RINKEBY_URL;
  let artifacts = await hre.artifacts.readArtifact('Greeter');
  const provider = new ethers.providers.JsonRpcProvider(url);
  let privateKey = process.env.RINKEBY_PRIVATE_KEY;
  let wallet = new ethers.Wallet(privateKey, provider);
  let factory = new ethers.ContractFactory(
    artifacts.abi,
    artifacts.bytecode,
    wallet
  );
  let greeter = await factory.deploy('Hahaha');
  console.log('Greeter address:', greeter.address);
  await greeter.deployed();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
