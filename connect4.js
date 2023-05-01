/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
  constructor(WIDTH, HEIGHT) {
    this.WIDTH = WIDTH;
    this.HEIGHT = HEIGHT;
    this.board = []; // array of rows, each row is array of cells  (board[y][x])
    this.currPlayer = players[0]; // active player: 1 or 2
    this.isOver = false;
    this.makeBoard();
  }

  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */

  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
    console.log(this.board);
    this.makeHtmlBoard();
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    const board = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick);

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!games[0].board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    if (this.currPlayer.color) {
      piece.style.backgroundColor = this.currPlayer.color;
    } else {
      piece.classList.add(`p${players.indexOf(games[0].currPlayer) + 1}`);
    }
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    this.isOver = true;
    setTimeout(() => {
      alert(msg);
    }, 500);
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    if (games[0].isOver) {
      alert('The game has ended, press start to go again!');
    } else {
      // get x from ID of clicked cell
      const x = +evt.target.id;

      // get next spot in column (if none, ignore click)
      const y = games[0].findSpotForCol(x);
      if (y === null) {
        return;
      }

      // place piece in board and add to HTML table
      games[0].board[y][x] = games[0].currPlayer;
      games[0].placeInTable(y, x);

      // check for win
      if (games[0].checkForWin()) {
        return games[0].endGame(
          `Player ${players.indexOf(games[0].currPlayer) + 1} won!`
        );
      }

      // check for tie
      if (games[0].board.every((row) => row.every((cell) => cell))) {
        return games[0].endGame('Tie!');
      }

      // switch players
      games[0].currPlayer =
        games[0].currPlayer === players[0] ? players[1] : players[0];
    }
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < games[0].HEIGHT &&
        x >= 0 &&
        x < games[0].WIDTH &&
        games[0].board[y][x] === games[0].currPlayer
    );
  }

  checkForWin() {
    for (let y = 0; y < games[0].HEIGHT; y++) {
      for (let x = 0; x < games[0].WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        // find winner (only checking each win-possibility as needed)
        if (
          games[0]._win(horiz) ||
          games[0]._win(vert) ||
          games[0]._win(diagDR) ||
          games[0]._win(diagDL)
        ) {
          return true;
        }
      }
    }
  }
}

class Player {
  constructor(color) {
    this.color = color;
  }
}

// Create game board when start button is clicked
let games = [];
let players = [];
document.querySelector('.start').addEventListener('click', createGame);

function createGame() {
  const board = document.querySelector('#board');
  if (board.rows.length === 0) {
    createPlayers();
    games.push(new Game(6, 7));
  } else {
    createPlayers();
    resetGame();
  }
}

function createPlayers() {
  const p1 = document.querySelector('input.p1Color').value;
  const p2 = document.querySelector('input.p2Color').value;

  players[0] = new Player(p1);
  players[1] = new Player(p2);
}

function resetGame() {
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }
  games.pop();
  games.push(new Game(6, 7));
}
