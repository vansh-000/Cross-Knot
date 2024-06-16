const cellsContainer = document.querySelector(".cells");
const resetButton = document.getElementById("reset-button");
const newGameButton = document.getElementById("new-game-button");
const overlay = document.getElementById("overlay");
const message = document.getElementById("message");
const winnerMessage = document.getElementById("winner-message");
const resultMessage = document.getElementById("result");
const currentTurnElement = document.querySelector(".current-turn");
const score1Element = document.querySelector(".score1");
const score2Element = document.querySelector(".score2");
const drawsElement = document.querySelector(".draws");
const nameModal = document.getElementById("name-modal");
const startGameButton = document.getElementById("start-game-button");
const player1NameInput = document.getElementById("player1-name");
const player2NameInput = document.getElementById("player2-name");
const gridSizeSelector = document.getElementById("grid-size");
const gameModeSelector = document.getElementById("game-mode");
const player1Label = document.getElementById("player1-label");
const player2Label = document.getElementById("player2-label");

const resetModal = document.getElementById("reset-modal");
const confirmResetButton = document.getElementById("confirm-reset-button");
const cancelResetButton = document.getElementById("cancel-reset-button");

let currentPlayer;
let player1Score = 0;
let player2Score = 0;
let draws = 0;
let gameBoard = [];
let gridSize = 3;
let player1Name = "Player 1";
let player2Name = "Player 2";
let gameMode = "2p";

function createBoard() {
  cellsContainer.innerHTML = "";
  gameBoard = [];
  for (let i = 0; i < gridSize; i++) {
    gameBoard.push(new Array(gridSize).fill(null));
  }
  cellsContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleCellClick);
    cellsContainer.appendChild(cell);
  }
  currentPlayer = player1Name;
  currentTurnElement.textContent = `${currentPlayer}'s`;
}

function handleCellClick(event) {
  const index = event.target.dataset.index;
  const row = Math.floor(index / gridSize);
  const col = index % gridSize;
  if (gameBoard[row][col] !== null) return;

  gameBoard[row][col] = currentPlayer;
  event.target.textContent = currentPlayer === player1Name ? "X" : "O";
  if (checkWin()) {
    if (currentPlayer === player1Name) {
      player1Score++;
      score1Element.textContent = player1Score;
    } else {
      player2Score++;
      score2Element.textContent = player2Score;
    }
    setTimeout(() => {
      displayWinner(`${currentPlayer} is the`);
    }, 300);
    return;
  }
  if (gameBoard.flat().every((cell) => cell !== null)) {
    draws++;
    drawsElement.textContent = draws;
    setTimeout(() => {
      displayWinner("It's a draw");
    }, 300);
    return;
  }

  currentPlayer = currentPlayer === player1Name ? player2Name : player1Name;
  currentTurnElement.textContent = `${currentPlayer}'s`;

  if (gameMode === "pc" && currentPlayer === player2Name) {
    setTimeout(pcMove, 300);
  }
}

function pcMove() {
  const emptyCells = [];
  for (let i = 0; i < gameBoard.length; i++) {
    for (let j = 0; j < gameBoard[i].length; j++) {
      if (gameBoard[i][j] === null) {
        emptyCells.push({ row: i, col: j });
      }
    }
  }

  if (emptyCells.length === 0) return;

  const { row, col } =
    emptyCells[Math.floor(Math.random() * emptyCells.length)];
  gameBoard[row][col] = player2Name;
  const cell = cellsContainer.querySelector(
    `[data-index="${row * gridSize + col}"]`
  );
  cell.textContent = "O";

  if (checkWin()) {
    player2Score++;
    score2Element.textContent = player2Score;
    setTimeout(() => {
      displayWinner(`${player2Name} is the`);
    }, 300);
    return;
  }

  if (gameBoard.flat().every((cell) => cell !== null)) {
    draws++;
    drawsElement.textContent = draws;
    setTimeout(() => {
      displayWinner("It's a draw");
    }, 300);
    return;
  }

  currentPlayer = player1Name;
  currentTurnElement.textContent = `${currentPlayer}'s`;
}

function checkWin() {
  const winningCombinations = [
    ...gameBoard,
    ...gameBoard[0].map((_, colIndex) => gameBoard.map((row) => row[colIndex])),
    gameBoard.map((row, index) => row[index]),
    gameBoard.map((row, index) => row[gridSize - 1 - index]),
  ];
  return winningCombinations.some((combination) =>
    combination.every((cell) => cell === currentPlayer)
  );
}

function displayWinner(message) {
  const isDraw = message.toLowerCase().includes("draw");

  resultMessage.textContent = isDraw ? "DRAW" : "WINNER";
  winnerMessage.textContent = isDraw ? "It's a" : message;

  overlay.style.display = "flex";

  setTimeout(() => {
    overlay.style.display = "none";
    resetBoard();
  }, 2000);
}

function resetBoard() {
  gameBoard = gameBoard.map((row) => row.map(() => null));
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.textContent = "";
  });
  currentPlayer = player1Name;
  currentTurnElement.textContent = `${currentPlayer}'s`;
}

resetButton.addEventListener("click", () => {
  resetModal.style.display = "flex";
});

confirmResetButton.addEventListener("click", () => {
  resetModal.style.display = "none";
  resetBoard();
});

cancelResetButton.addEventListener("click", () => {
  resetModal.style.display = "none";
});

newGameButton.addEventListener("click", () => {
  nameModal.style.display = "flex";
});

startGameButton.addEventListener("click", () => {
  player1Name = player1NameInput.value || "Player 1";
  player2Name = player2NameInput.value || "Player 2";
  player2Name =
    gameModeSelector.value === "pc"
      ? "Computer"
      : player2NameInput.value || "Player 2";
  gridSize = parseInt(gridSizeSelector.value);
  gameMode = gameModeSelector.value;
  player1Label.textContent = player1Name;
  player1Score = 0;
  player2Score = 0;
  draws = 0;
  player2Label.textContent = player2Name;
  score1Element.textContent = player1Score;
  score2Element.textContent = player2Score;
  drawsElement.textContent = draws;

  currentTurnElement.textContent = `${player1Name}'s`;
  nameModal.style.display = "none";
  createBoard();
});

window.addEventListener("load", () => {
  nameModal.style.display = "flex";
  createBoard();
});
