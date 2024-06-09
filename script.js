const cellsContainer = document.querySelector(".cells");
      const currentTurnSpan = document.querySelector(".current-turn");
      const overlay = document.getElementById("overlay");
      const winnerMessage = document.getElementById("winner-message");
      const resultMessage = document.getElementById("result");
      const resetBtn = document.getElementById("reset-button");
      const newGameBtn = document.getElementById("new-game");
      const player1NameInput = document.getElementById("player1-name");
      const player2NameInput = document.getElementById("player2-name");
      const nameInputDiv = document.getElementById("name-input");
      const startGameBtn = document.getElementById("start-game");
      const gridSizeSelect = document.getElementById("grid-size");

      let currentPlayer = "Player 1";
      let player1Score = 0;
      let player2Score = 0;
      let draws = 0;
      let gameBoard = [];
      let player1Name = "Player 1";
      let player2Name = "Player 2";
      let gridSize = 3;

      const winningCombinations = (size) => {
        let combinations = [];

        // Rows
        for (let i = 0; i < size; i++) {
          let row = [];
          for (let j = 0; j < size; j++) {
            row.push(i * size + j);
          }
          combinations.push(row);
        }

        // Columns
        for (let i = 0; i < size; i++) {
          let column = [];
          for (let j = 0; j < size; j++) {
            column.push(i + size * j);
          }
          combinations.push(column);
        }

        // Diagonals
        let diagonal1 = [];
        let diagonal2 = [];
        for (let i = 0; i < size; i++) {
          diagonal1.push(i * (size + 1));
          diagonal2.push((i + 1) * (size - 1));
        }
        combinations.push(diagonal1);
        combinations.push(diagonal2);

        return combinations;
      };

      const checkWinner = () => {
        const combinations = winningCombinations(gridSize);
        for (let combination of combinations) {
          const [a, b, c, d, e] = combination;
          if (
            gameBoard[a] &&
            gameBoard[a] === gameBoard[b] &&
            gameBoard[a] === gameBoard[c] &&
            (gridSize === 3 ||
              (gameBoard[a] === gameBoard[d] &&
                (gridSize === 4 || gameBoard[a] === gameBoard[e])))
          ) {
            return gameBoard[a];
          }
        }
        return gameBoard.includes(null) ? null : "Draw";
      };

      const resetGame = () => {
        gameBoard = Array(gridSize * gridSize).fill(null);
        cellsContainer.innerHTML = "";
        cellsContainer.style.width = `${gridSize * 90 + (gridSize - 1) * 10}px`;
        for (let i = 0; i < gameBoard.length; i++) {
          const cell = document.createElement("div");
          cell.classList.add("cell");
          cell.setAttribute("data-index", i);
          cellsContainer.appendChild(cell);
          cell.addEventListener("click", handleCellClick);
        }
        currentPlayer = player1Name;
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
        e.target.textContent = currentPlayer === player1Name ? "X" : "O";

        const winner = checkWinner();
        if (winner) {
          if (winner === "Draw") {
            draws++;
            document.querySelector(".draw").textContent = draws;
            showOverlay("It's a ", "DRAW");
          } else {
            if (winner === player1Name) {
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
            currentPlayer === player1Name ? player2Name : player1Name;
          currentTurnSpan.textContent = `${currentPlayer}'s`;
        }
      };

      const startNewGame = () => {
        nameInputDiv.style.display = "flex";
        player1Score = 0;
        player2Score = 0;
        draws = 0;
        document.querySelector(".score1").textContent = player1Score;
        document.querySelector(".score2").textContent = player2Score;
        document.querySelector(".draw").textContent = draws;
      };

      const startGame = () => {
        player1Name = player1NameInput.value || "Player 1";
        player2Name = player2NameInput.value || "Player 2";
        gridSize = parseInt(gridSizeSelect.value);
        document.querySelectorAll(".player label")[0].textContent = player1Name;
        document.querySelectorAll(".player label")[1].textContent = player2Name;
        currentPlayer = player1Name;
        currentTurnSpan.textContent = `${currentPlayer}'s`;
        nameInputDiv.style.display = "none";
        resetGame();
      };

      window.onload = () => {
        nameInputDiv.style.display = "flex";
      };

      resetBtn.addEventListener("click", resetGame);
      newGameBtn.addEventListener("click", startNewGame);
      startGameBtn.addEventListener("click", startGame);