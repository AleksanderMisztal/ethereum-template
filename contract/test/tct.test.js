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
  let p1;
  let p2;

  beforeEach(async function () {
    [p1, p2] = await ethers.getSigners();
    TicTacToe = await ethers.getContractFactory('TicTacToe', p1);
    tct1 = await TicTacToe.deploy({ value: one_eth });
    await tct1.deployed();
    tct2 = tct1.connect(p2);
    await tct2.join({ value: one_eth });
  });

  it('Should initialize with empties', async function () {
    for (let x = 0; x < 3; x++)
      for (let y = 0; y < 3; y++) {
        const cell = await tct1.getCell(x, y);
        expect(cell).to.equal(0);
      }
  });

  it('Should join and move', async function () {
    await tct1.move(0, 0);
    const cell1 = await tct1.getCell(0, 0);
    expect(cell1).to.equal(1);

    await tct2.move(1, 1);
    const cell2 = await tct1.getCell(1, 1);
    expect(cell2).to.equal(2);
  });

  it('Should win', async () => {
    let winner = undefined;
    tct1.on('Win', (_winner) => {
      console.log(`Win triggered! Winner: ${_winner}`);
      winner = _winner;
    });

    await tct1.move(0, 0);
    await tct2.move(1, 0);

    await tct1.move(0, 1);
    await tct2.move(1, 1);

    await tct1.move(0, 2);

    await sleep(10);

    expect(winner).to.equal(p1.address);
  });
});
