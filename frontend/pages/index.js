import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import contractInfo from '../contract.json';

const address = '0xCA27c0ED2403682Ef82210fEA88d757a2BD63e36';
const provider = new ethers.providers.EtherscanProvider(
  'rinkeby',
  'KKMPFTWZ61DA2QI966FMGZDINQS9TCTQKV'
);
let greeter = new ethers.Contract(address, contractInfo.abi, provider);

export default function Home() {
  const [greeting, setGreeting] = useState('');
  const [signer, setSigner] = useState(undefined);
  useEffect(() => {
    async function getGreeting() {
      const res = await greeter.greet();
      setGreeting(res);
    }

    async function getMetamask() {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        'any'
      );
      // Prompt user for account connections
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      console.log('Account:', await signer.getAddress());
      greeter = greeter.connect(signer);
      console.log(greeter.signer);
    }

    getGreeting();
    getMetamask();
  }, []);
  return (
    <div className="text-center bg-slate-500">
      <h1 className="bg-red-600">Hi haha</h1>
      <button
        className="bg-red-700 border-2 rounded"
        onClick={() => console.log(ethers.utils.parseEther('42').toString())}
      >
        ethers
      </button>
      <h1>greeting: {greeting}</h1>
      <button onClick={() => greeter.setGreeting('hehehhehe')}>
        change greeting
      </button>
    </div>
  );
}
