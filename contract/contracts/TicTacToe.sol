//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import 'hardhat/console.sol';

contract TicTacToe {
    enum Cell {Empty, Circle, Cross}
    Cell[3][3] board;
    address pCross = address(0);
    address pCircle;
    bool circleNext = true;
    bool ended = false;
    event Move(Cell symbol, uint8 x, uint8 y);
    event Win(address player);

    constructor() payable {
        pCircle = msg.sender;
    }

    function join() external payable {
        require(pCross == address(0), "Can't join, game alrady full.");
        // msg.value has alrady been added to contract balance!
        require(2*msg.value == address(this).balance, "Have to match the stake!");
        pCross = msg.sender;
    }

    function getCell(uint8 x, uint8 y) public view returns (Cell) {
        return board[x][y];
    }

    function getBoard() public view returns (Cell[3][3] memory) {
        return board;
    }

    function move(uint8 x, uint8 y) external {
        require(board[x][y] == Cell.Empty, "Can't play there!");
        require(!ended, "Game has ended!");
        if (circleNext) {
            require(msg.sender == pCircle, "Not your move!");
            board[x][y] = Cell.Circle;
            circleNext = false;
            emit Move(Cell.Circle, x, y);
            if (checkWin(Cell.Circle)) win(pCircle);
        }
        else {
            require(msg.sender == pCross, "Not your move!");
            board[x][y] = Cell.Cross;
            circleNext = true;
            emit Move(Cell.Cross, x, y);
            if (checkWin(Cell.Cross)) win(pCross);
        }
    }

    function checkWin(Cell s) public view returns(bool) {
        if (board[0][0] == s && board[0][1] == s && board[0][2] == s) return true;
        if (board[1][0] == s && board[1][1] == s && board[1][2] == s) return true;
        if (board[2][0] == s && board[2][1] == s && board[2][2] == s) return true;
        
        if (board[0][0] == s && board[1][0] == s && board[2][0] == s) return true;
        if (board[0][1] == s && board[1][1] == s && board[2][1] == s) return true;
        if (board[0][2] == s && board[1][2] == s && board[2][2] == s) return true;

        if (board[0][0] == s && board[1][1] == s && board[2][2] == s) return true;
        if (board[0][2] == s && board[1][1] == s && board[2][0] == s) return true;

        return false;
    }

    function win(address player) private {
        ended = true;
        player.call{value: address(this).balance}("");
        emit Win(player);
    }
}
