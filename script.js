const cells = document.querySelectorAll(".cell");
const currentTurnSpan = document.querySelector(".current-turn");
const overlay = document.getElementById("overlay");
const winnerMessage = document.getElementById("winner-message");
const resultMessage = document.getElementById("result");
const resetBtn = document.getElementById("reset-button");

let currentPlayer = "Player 1";
let player1Score = 0;
let player2Score = 0;
let draws = 0;
let gameBoard = Array(9).fill(null);

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const checkWinner = () => {
  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    if (
      gameBoard[a] &&
      gameBoard[a] === gameBoard[b] &&
      gameBoard[a] === gameBoard[c]
    ) {
      return gameBoard[a];
    }
  }
  return gameBoard.includes(null) ? null : "Draw";
};

const resetGame = () => {
  gameBoard.fill(null);
  cells.forEach((cell) => {
    cell.textContent = "";
  });
  currentPlayer = "Player 1";
  currentTurnSpan.textContent = `${currentPlayer}'s`;
};

const showOverlay = (message, result) => {
  winnerMessage.textContent = message;
  resultMessage.textContent = result;
  overlay.style.display = "flex";
  setTimeout(() => {
    overlay.style.display = "none";
    resetGame();
  }, 2000);
};

const handleCellClick = (e) => {
  const index = e.target.getAttribute("data-index");
  if (gameBoard[index] || checkWinner()) return;
  gameBoard[index] = currentPlayer;
  e.target.textContent = currentPlayer === "Player 1" ? "X" : "O";

  const winner = checkWinner();
  if (winner) {
    if (winner === "Draw") {
      draws++;
      document.querySelector(".draw").textContent = draws;
      showOverlay("It's a ", "DRAW");
    } else {
      if (winner === "Player 1") {
        player1Score++;
        document.querySelector(".score1").textContent = player1Score;
      } else {
        player2Score++;
        document.querySelector(".score2").textContent = player2Score;
      }
      showOverlay(`${winner} is the `, "WINNER");
    }
  } else {
    currentPlayer =
      currentPlayer === "Player 1" ? "Player 2" : "Player 1";
    currentTurnSpan.textContent = `${currentPlayer}'s`;
  }
};

cells.forEach((cell) => {
  cell.addEventListener("click", handleCellClick);
});

resetBtn.addEventListener("click", resetGame);