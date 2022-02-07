import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import useToggle from '../hooks/useToggle';
import contractInfo from '../contracts/tictactoe.json';
import Button from '../components/Button';
import Grid from '../components/Grid';

const address = '0x9eb26aE40A3FED927081F5fd1016e3f8ca400BeB';
const provider = new ethers.providers.EtherscanProvider(
  'rinkeby',
  'KKMPFTWZ61DA2QI966FMGZDINQS9TCTQKV'
);
let contract = new ethers.Contract(address, contractInfo.abi, provider);

const cross = <i className="fas fa-times"></i>;
const circle = <i className="far fa-circle"></i>;

export default function Home() {
  const [address, setAddress] = useState('');
  const [gameId, setGameId] = useState(0);
  const [game, setGame] = useState(undefined);
  const [joinAsCircle, toggleJoinAsCircle] = useToggle();
  const [pendingTx, setPendingTx] = useState('');

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
      contract.on('Join', async (gameId, asCircle, player) => {
        console.log('Join event xd', { gameId, asCircle, player });
        setGame(await contract.getGame(gameId));
      });
      contract.on('Move', async (gameId, symbol, x, y) => {
        console.log('Move event haha', { gameId, symbol, x, y });
        setGame(await contract.getGame(gameId));
      });
      contract.on('Win', async (gameId, winner) => {
        console.log('Win event', { gameId, winner });
        setGame(await contract.getGame(gameId));
      });
    }

    async function getGame() {
      setGame(await contract.getGame(gameId));
    }

    getMetamask();
    getGame();
  }, []);

  const withToast = async (message, body) => {
    setPendingTx(message);
    try {
      await body();
    } catch (e) {
      console.error(e.error);
    }
    setPendingTx('');
  };

  const createGame = (stake) =>
    withToast('Creating game', async () => {
      const gameId = (await contract.gameCount()).toString();
      await (await contract.createGame(gameId, stake)).wait();
      await switchGame(gameId);
    });

  const switchGame = async (gameId) => {
    setGameId(gameId);
    const game = await contract.getGame(gameId);
    setGame(game);
  };

  const joinGame = () =>
    withToast(`Joining game ${gameId}`, async () => {
      await (
        await contract.join(gameId, joinAsCircle, {
          value: game.stake,
        })
      ).wait();
    });

  const makeMove = (x, y) =>
    withToast('Making a move', async () => {
      await (await contract.move(gameId, x, y)).wait();
      setGame(await contract.getGame(gameId));
    });

  return (
    <div className="container mx-auto max-w-lg">
      <div className="xl:absolute top-2 right-2 ">
        <div className="bg-green-400 rounded-lg px-2 text-gray-700 my-2 xl:my-0">
          Connected address: <br />
          {address}
        </div>
        {pendingTx && (
          <div className="bg-green-400 rounded-lg px-2 text-gray-700 my-2">
            Pending transaction: {pendingTx}. Please wait...
          </div>
        )}
      </div>
      <div className="text-center shadow-lg bg-slate-50 rounded-lg my-2 p-2">
        Current game id: {gameId} <br />
        {game && game.stake > 0 && (
          <>
            Stake: {ethers.utils.formatEther(game.stake)}
            <br />
            {circle}: {game.pCircle}
            <br />
            {cross}: {game.pCross}
            <br />
            {game.ended
              ? 'Game has ended'
              : 'Next move:' + (game.crossNext ? 'cross' : 'circle')}
          </>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createGame(e.target.stake.value);
            e.target.reset();
          }}
        >
          <input type="text" name="stake" id="stake" pattern="[0-9.]+" />
          <Button type="submit">Create game</Button>
        </form>
        <div>
          <Button onClick={joinGame}>Join game as</Button>
          <button onClick={toggleJoinAsCircle}>
            {joinAsCircle ? circle : cross}
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            switchGame(e.target.gameId.value);
            e.target.reset();
          }}
        >
          <input type="text" name="gameId" id="gameId" pattern="[0-9.]+" />
          <Button type="submit">Switch game</Button>
        </form>
        {game && game.stake != 0 && (
          <div className="bg-slate-200 mx-auto w-fit py-6 p-12 rounded">
            Next player: {game.crossNext ? cross : circle}
            <Grid
              values={game.board.map((row) =>
                row.map((c) => (c == 0 ? '' : c == 1 ? circle : cross))
              )}
              handleClick={makeMove}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// TODO connect wallet on button click
// TODO save gameId to storage
// TODO fuzz test
// TODO deploy the new backend
// TODO add tests
// TODO setup offline development
