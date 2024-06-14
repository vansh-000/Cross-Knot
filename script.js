const cellsContainer = document.querySelector('.cells');
    const resetButton = document.getElementById('reset-button');
    const newGameButton = document.getElementById('new-game-button');
    const overlay = document.getElementById('overlay');
    const message = document.getElementById('message');
    const winnerMessage = document.getElementById('winner-message');
    const resultMessage = document.getElementById('result');
    const currentTurnElement = document.querySelector('.current-turn');
    const score1Element = document.querySelector('.score1');
    const score2Element = document.querySelector('.score2');
    const drawsElement = document.querySelector('.draws');
    const nameModal = document.getElementById('name-modal');
    const startGameButton = document.getElementById('start-game-button');
    const player1NameInput = document.getElementById('player1-name');
    const player2NameInput = document.getElementById('player2-name');
    const gridSizeSelector = document.getElementById('grid-size');
    const gameModeSelector = document.getElementById('game-mode');

    let currentPlayer = 'Player 1';
    let player1Score = 0;
    let player2Score = 0;
    let draws = 0;
    let gameBoard = [];
    let gridSize = 3;
    let player1Name = 'Player 1';
    let player2Name = 'Player 2';
    let gameMode = '2p';

    function createBoard() {
      cellsContainer.innerHTML = '';
      gameBoard = [];
      for (let i = 0; i < gridSize; i++) {
        gameBoard.push(new Array(gridSize).fill(null));
      }
      cellsContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
      for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        cellsContainer.appendChild(cell);
      }
    }

    function handleCellClick(event) {
      const index = event.target.dataset.index;
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      if (gameBoard[row][col] !== null) return;

      gameBoard[row][col] = currentPlayer;
      event.target.textContent = currentPlayer === 'Player 1' ? 'X' : 'O';
      if (checkWin()) {
        if (currentPlayer === 'Player 1') {
          player1Score++;
          score1Element.textContent = player1Score;
        } else {
          player2Score++;
          score2Element.textContent = player2Score;
        }
        setTimeout(() => {
          displayWinner(`${currentPlayer} Wins!`);
        }, 300);
        return;
      }

      if (gameBoard.flat().every(cell => cell !== null)) {
        draws++;
        drawsElement.textContent = draws;
        setTimeout(() => {
          displayWinner('It\'s a Draw!');
        }, 300);
        return;
      }

      currentPlayer = currentPlayer === 'Player 1' ? 'Player 2' : 'Player 1';
      currentTurnElement.textContent = `${currentPlayer}'s turn`;

      if (gameMode === 'pc' && currentPlayer === 'Player 2') {
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

      const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      gameBoard[row][col] = 'Player 2';
      const cell = cellsContainer.querySelector(`[data-index="${row * gridSize + col}"]`);
      cell.textContent = 'O';

      if (checkWin()) {
        player2Score++;
        score2Element.textContent = player2Score;
        setTimeout(() => {
          displayWinner('Player 2 Wins!');
        }, 300);
        return;
      }

      if (gameBoard.flat().every(cell => cell !== null)) {
        draws++;
        drawsElement.textContent = draws;
        setTimeout(() => {
          displayWinner('It\'s a Draw!');
        }, 300);
        return;
      }

      currentPlayer = 'Player 1';
      currentTurnElement.textContent = `${currentPlayer}'s turn`;
    }

    function checkWin() {
      const winningCombinations = [
        ...gameBoard,
        ...gameBoard[0].map((_, colIndex) => gameBoard.map(row => row[colIndex])),
        gameBoard.map((row, index) => row[index]),
        gameBoard.map((row, index) => row[gridSize - 1 - index])
      ];
      return winningCombinations.some(combination => combination.every(cell => cell === currentPlayer));
    }

    function displayWinner(message) {
      winnerMessage.textContent = message;
      resultMessage.textContent = message.includes('Draw') ? 'DRAW' : 'WINNER';
      overlay.style.display = 'flex';
      setTimeout(() => {
        overlay.style.display = 'none';
        createBoard();
      }, 2000);
    }

    resetButton.addEventListener('click', () => {
      createBoard();
    });

    newGameButton.addEventListener('click', () => {
      nameModal.style.display = 'flex';
    });

    startGameButton.addEventListener('click', () => {
      player1Name = player1NameInput.value || 'Player 1';
      player2Name = player2NameInput.value || 'Player 2';
      gridSize = parseInt(gridSizeSelector.value);
      gameMode = gameModeSelector.value;
      currentTurnElement.textContent = `${player1Name}'s turn`;
      nameModal.style.display = 'none';
      createBoard();
    });

    createBoard();