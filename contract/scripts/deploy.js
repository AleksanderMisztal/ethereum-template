const ethers = require('ethers');
require('dotenv').config();

const contractName = 'TicTacToe';
const url = process.env.ALCHEMY_RINKEBY_URL;
const privateKey = process.env.RINKEBY_PRIVATE_KEY;

async function main() {
  let artifacts = await hre.artifacts.readArtifact(contractName);
  const provider = new ethers.providers.JsonRpcProvider(url);
  const wallet = new ethers.Wallet(privateKey, provider);
  const factory = new ethers.ContractFactory(
    artifacts.abi,
    artifacts.bytecode,
    wallet
  );
  const contract = await factory.deploy();
  await contract.deployed();
  console.log('Contract address:', contract.address);
  console.log(contract);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
