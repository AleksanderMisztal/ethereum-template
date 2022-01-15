import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import contractInfo from '../contracts/tictactoe.json';
import Board from '../components/board.js';

const address = '0x3E7122c1E87Fff1548eA6ba4D5F5b6FA4ABFb2C8';
const provider = new ethers.providers.EtherscanProvider(
  'rinkeby',
  'KKMPFTWZ61DA2QI966FMGZDINQS9TCTQKV'
);
let contract = new ethers.Contract(address, contractInfo.abi, provider);

export default function Home() {
  const [board, setBoard] = useState([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);
  const [stake, setStake] = useState(0);
  useEffect(() => {
    async function getGame() {
      setBoard(await contract.getBoard());
      const stake = await provider.getBalance(contract.address);
      setStake(stake);
    }

    async function getMetamask() {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        'rinkeby'
      );
      // Prompt user for account connections
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      contract = contract.connect(signer);
      console.log('Account:', await signer.getAddress());
    }

    getGame();
    getMetamask();
  }, []);

  const joinGame = async () => {
    const tx = await contract.join({ value: stake });
    await tx.wait();
    console.log('Succesfully joined');
  };

  const makeMove = async (x, y) => {
    const tx = await contract.move(x, y);
    await tx.wait();
    setBoard(await contract.getBoard());
    console.log('Succesfully made a move!');
  };

  const handleClick = async (row, col) => {
    console.log({ row, col });
    await makeMove(row, col);
  };

  return (
    <div className="text-center bg-slate-500 container mx-auto max-w-lg">
      <h1 className="bg-red-600">
        Hi haha. Stake: {ethers.utils.formatEther(stake)}
      </h1>
      <button className="m-3 bg-yellow-400" onClick={joinGame}>
        Join game
      </button>
      <Board board={board} />
      <Grid values={board} handleClick={handleClick} />
    </div>
  );
}

const Grid = ({ values, handleClick }) => {
  return (
    <div className="bg-slate-200">
      <Row row={0} values={values[0]} handleClick={handleClick} />
      <Row row={1} values={values[1]} handleClick={handleClick} />
      <Row row={2} values={values[2]} handleClick={handleClick} />
    </div>
  );
};

const Row = ({ row, values, handleClick }) => {
  return (
    <div className="flex flex-row justify-center">
      <Cell row={row} col={0} value={values[0]} handleClick={handleClick} />
      <Cell row={row} col={1} value={values[1]} handleClick={handleClick} />
      <Cell row={row} col={2} value={values[2]} handleClick={handleClick} />
    </div>
  );
};

const Cell = ({ row, col, value, handleClick }) => {
  return (
    <div
      className="p-4 bg-green-300 border-green-600 border-2"
      onClick={() => handleClick(row, col)}
    >
      {value}
    </div>
  );
};

// TODO craete game
// TODO join as one of the sides
// TODO get game by id
// TODO get stake
// TODO
// TODO check if game is full before allowing joining
// TODO send money back if draw
// TODO have many games in one contract
