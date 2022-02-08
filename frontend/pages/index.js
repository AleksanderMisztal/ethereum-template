import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import contractInfo from '../contracts/NFT_ETF.json';
import Button from '../components/Button';

const address = '0x2FF843D40F5faaD71e078519522420F46E9e5139';
const provider = new ethers.providers.EtherscanProvider(
  'rinkeby',
  'KKMPFTWZ61DA2QI966FMGZDINQS9TCTQKV'
);
let contract = new ethers.Contract(address, contractInfo.abi, provider);

export default function Home() {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const [totalSupply, setTotalSupply] = useState(100);

  useEffect(() => {
    async function getMetamask() {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        'rinkeby'
      );
      // Prompt user for account connections
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      contract = contract.connect(signer);
      const address = await signer.getAddress();
      setAddress(address);

      setTotalSupply(await contract.totalSupply());
      const balance = await contract.balanceOf(address);
      setBalance(balance);
    }

    getMetamask();
  }, []);

  return (
    <div className="container mx-auto max-w-lg">
      <div className="xl:absolute top-2 right-2 ">
        <div className="bg-green-400 rounded-lg px-2 text-gray-700 my-2 xl:my-0">
          Connected address: <br />
          {address}
        </div>
      </div>
      <div className="text-center shadow-lg bg-slate-50 rounded-lg my-2 p-2">
        Your balance: {ethers.utils.formatEther(balance)} <br />
        Total supply: {ethers.utils.formatEther(totalSupply)} <br />
        {balance.eq(totalSupply) && 'You are the exclusive owner'}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log(e.target.gameId.value);
            e.target.reset();
          }}
        >
          <input type="text" name="gameId" id="gameId" pattern="[0-9.]+" />
          <Button type="submit">Log</Button>
        </form>
      </div>
    </div>
  );
}
