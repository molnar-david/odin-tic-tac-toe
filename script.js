const Player = (marker) => {
    const getMarker = () => marker;

    return {
        getMarker,
    }
};

const TicTacToe = (() => {
    let gameboard = [];
    let gameboardGrid = document.getElementById("gameboard");
    const numberOfRows = 3;
    const numberOfCols = 3;
    const markersToWin = 3;
    const winningScore = 10;

    const player = Player("X");
    const computer = Player("O");
    let currentPlayer = player;                 // player starts by default
    let infoBoard = document.getElementById("info-board");

    const isDraw = () => {
        return gameboard.every((row) => !row.includes(null));
    }

    const isWinningMove = () => {
        // check rows
        let rowCount = 0;
        for (let i = 0; i < numberOfRows; i++) {
            for (let j = 0; j < numberOfCols; j++) {
                if (gameboard[i][j] === currentPlayer.getMarker()) rowCount++;
                if (rowCount === markersToWin) return true;
            }
            rowCount = 0;
        }

        // check columns
        let colCount = 0;
        for (let j = 0; j < numberOfCols; j++) {
            for (let i = 0; i < numberOfRows; i++) {
                if (gameboard[i][j] === currentPlayer.getMarker()) colCount++;
                if (colCount === markersToWin) return true;
            }
            colCount = 0;
        }

        // check diagonals - only works on 3x3 board
        if (gameboard[0][0] === currentPlayer.getMarker() &&
            gameboard[1][1] === currentPlayer.getMarker() &&
            gameboard[2][2] === currentPlayer.getMarker() ||
            gameboard[2][0] === currentPlayer.getMarker() &&
            gameboard[1][1] === currentPlayer.getMarker() &&
            gameboard[0][2] === currentPlayer.getMarker()) return true;

        return false;
    }

    const gameOver = () => {
        switch (currentPlayer) {
            case null:
                infoBoard.textContent = "Tie!";
                break;
            case player:
                infoBoard.textContent = "Player wins! Congratulations!";
                break;
            case computer:
                infoBoard.textContent = "Computer wins! Too bad...";
                break;
        }

        currentPlayer = null;
        document.getElementById("play-again").classList.toggle("hidden");
    }

    const minimax = (nextPlayer = currentPlayer) => {
        if (isWinningMove()) {
            return { score: currentPlayer === computer ? winningScore : -winningScore };
        } else if (isDraw()) {
            return { score: 0 };
        } 

        let legalMoves = [];
        for (let i = 0; i < numberOfRows; i++) {
            for (let j = 0; j < numberOfCols; j++) {
                if (gameboard[i][j] === null) {
                    gameboard[i][j] = nextPlayer.getMarker();
                    currentPlayer = nextPlayer;             // because our winning conditions are tied to currentPlayer
                    const nextNextPlayer = nextPlayer === computer ? player : computer;
                    legalMoves.push({ row: i, col: j, score: minimax(nextNextPlayer).score });

                    // revert back to previous state
                    gameboard[i][j] = null;
                }
            }
        }

        let bestMove = {};
        if (nextPlayer === computer) {
            bestMove.score = -(winningScore + 1);
            for (const move of legalMoves) {
                if (move.score > bestMove.score) bestMove = move;
            }
        } else {
            bestMove.score = winningScore + 1;
            for (const move of legalMoves) {
                if (move.score < bestMove.score) bestMove = move;
            }
        }
        return bestMove;
    }

    const computerTurn = () => {
        // // computer chooses a random legal move
        // let legalMoves = [];
        // for (let i = 0; i < numberOfRows; i++) {
        //     for (let j = 0; j < numberOfCols; j++) {
        //         if (gameboard[i][j] === null) legalMoves.push({row: i, col: j});
        //     }
        // }

        // if (legalMoves.length) {
        //     let {row, col} = legalMoves[Math.floor(Math.random() * legalMoves.length)];
        //     gameboard[row][col] = computer.getMarker();
        //     document.querySelector(`button[data-row="${row}"][data-col="${col}"]`).textContent = computer.getMarker();
        // }

        // computer chooses the best possible legal move
        const {row, col, score} = minimax();
        currentPlayer = computer;
        gameboard[row][col] = computer.getMarker();
        document.querySelector(`button[data-row="${row}"][data-col="${col}"]`).textContent = computer.getMarker();

        if (isWinningMove()) {
            gameOver();
        } else if (isDraw()) {
            currentPlayer = null;
            gameOver();
        } else {
            currentPlayer = player;
            infoBoard.textContent = "Player's turn";
        }
    }

    const playerTurn = (event) => {
        if (currentPlayer === player && event.target.textContent === "") {
            event.target.textContent = player.getMarker();
            gameboard[event.target.dataset.row][event.target.dataset.col] = player.getMarker();

            if (isWinningMove()) {
                gameOver();
            } else if (isDraw()) {
                currentPlayer = null;
                gameOver();
            } else {
                currentPlayer = computer;
                infoBoard.textContent = "Computer's turn";
                setTimeout(computerTurn, 1000);
            }
        }
    }

    const init = () => {
        gameboard = new Array(numberOfRows).fill(null).map(() => new Array(numberOfCols).fill(null));

        gameboardGrid.textContent = "";
        for (let i = 0; i < numberOfRows; i++) {
            for (let j = 0; j < numberOfCols; j++) {
                let btn = document.createElement("button");
                btn.dataset.row = i;
                btn.dataset.col = j;
                btn.addEventListener("click", playerTurn);
                gameboardGrid.appendChild(btn);
            }
        }
        infoBoard.textContent = "";

        currentPlayer = player;                 // player starts always
        infoBoard.textContent = "Player's turn";
        document.getElementById("play-again").classList.add("hidden");
    };

    const displayConsole = () => {
        console.table(gameboard);
    };

    const play = () => {
        init();
    }

    document.getElementById("restart-btn").addEventListener("click", init);

    return {
        play,
    }
})();

TicTacToe.play();
