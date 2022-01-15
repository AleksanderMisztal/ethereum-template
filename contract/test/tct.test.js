const { expect } = require('chai');
const { ethers } = require('hardhat');

function sleep(seconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000 * seconds);
  });
}

const one_eth = ethers.utils.parseEther('1');
describe('TicTacToe', function () {
  let TicTacToe;
  let tct1;
  let tct2;
  let gameId;
  let p1;
  let p2;

  beforeEach(async function () {
    [p1, p2] = await ethers.getSigners();
    TicTacToe = await ethers.getContractFactory('TicTacToe', p1);
    tct1 = await TicTacToe.deploy();
    await tct1.deployed();
    tct2 = tct1.connect(p2);

    gameId = await tct1.gameCount();

    await tct1.createGame(gameId, one_eth);
    await tct1.join(gameId, true, { value: one_eth });
    await tct2.join(gameId, false, { value: one_eth });
  });

  it('Should initialize with empties', async function () {
    const board = await tct1.getBoard(gameId);
    for (let x = 0; x < 3; x++)
      for (let y = 0; y < 3; y++) {
        expect(board[x][y]).to.equal(0);
      }
  });

  it('Should move', async function () {
    await tct1.move(gameId, 0, 0);
    await tct2.move(gameId, 1, 1);

    const board = await tct1.getBoard(gameId);

    expect(board[0][0]).to.equal(1);
    expect(board[1][1]).to.equal(2);
  });

  it('Should win', async () => {
    let winner = undefined;
    tct1.on('Win', (gid, _winner) => {
      console.log(`Win triggered! Winner: ${_winner}`);
      winner = _winner;
    });

    await tct1.move(gameId, 0, 0);
    await tct2.move(gameId, 1, 0);

    await tct1.move(gameId, 0, 1);
    await tct2.move(gameId, 1, 1);

    await tct1.move(gameId, 0, 2);
    await sleep(5);

    expect(winner).to.equal(1);
  });
});
