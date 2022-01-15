//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


contract TicTacToe {
    enum Cell {Empty, Circle, Cross}
    event Move(uint gameId, Cell symbol, uint8 x, uint8 y);
    event Win(uint gameId, Cell player);

    struct Game {
        uint stake;
        address pCircle;
        address pCross;
        Cell[3][3] board;
        bool crossNext;
        bool ended;
    }

    uint public gameCount;
    mapping (uint => Game) games;

    function createGame(uint gameId, uint stake) external {
        require(gameId == gameCount, "Invalid game id. Try again.");
        Cell[3][3] memory board;
        games[gameCount] = Game({
            stake: stake,
            pCircle: address(0),
            pCross: address(0),
            board: board,
            crossNext: false,
            ended: false
        });
        games[gameCount].stake = stake;
        gameCount++;
    }

    function getGame(uint gameId) external view returns (Game memory) {
        return games[gameId];
    }

    function join(uint gameId, bool asCircle) external payable {
        require(gameId < gameCount, "This game does not exists!");
        Game storage game = games[gameId];
        require(msg.value == game.stake, "Pay the stake!");
        if (asCircle) {
            require(game.pCircle == address(0), "Can't join, this seat has been taken.");
            game.pCircle = msg.sender;
        }
        else {
            require(game.pCross == address(0), "Can't join, this seat has been taken.");
            game.pCross = msg.sender;
        }
    }

    function getBoard(uint gameId) public view returns (Cell[3][3] memory) {
        return games[gameId].board;
    }

    function move(uint gameId, uint8 x, uint8 y) external {
        Game storage game = games[gameId];
        require(game.board[x][y] == Cell.Empty, "This cell is not empty!");
        require(!game.ended, "Game has ended!");

        address expectedPlayer = game.crossNext ? game.pCross : game.pCircle;
        require(msg.sender == expectedPlayer, "Not your move!");
        
        Cell symbol = game.crossNext ? Cell.Cross : Cell.Circle;
        game.board[x][y] = symbol;
        game.crossNext = !game.crossNext;
        emit Move(gameId, symbol, x, y);
        if (checkWin(game.board, symbol)) win(gameId, symbol);
    }

    function checkWin(Cell[3][3] memory board, Cell s) private pure returns(bool) {
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

    function win(uint gameId, Cell player) private {
        Game storage game = games[gameId];
        game.ended = true;
        if (player == Cell.Empty) {
            game.pCircle.call{value: game.stake}("");
            game.pCross.call{value: game.stake}("");
        } else {
            address winner = player == Cell.Circle ? game.pCircle : game.pCross;
            winner.call{value: 2 * game.stake}("");
        }
        emit Win(gameId, player);
    }
}
