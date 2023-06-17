const Player = (marker) => {
    const getMarker = () => marker;

    return {
        getMarker,
    }
};

const TicTacToe = (() => {
    let gameboard = [];
    let gameboardGrid = document.getElementById("gameboard");

    const player = Player("x");
    const computer = Player("o");

    const computerTurn = () => {
        let legalMoves = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (gameboard[i][j] === null) legalMoves.push({row: i, col: j});
            }
        }

        if (legalMoves.length) {
            let {row, col} = legalMoves[Math.floor(Math.random() * legalMoves.length)];
            gameboard[row][col] = computer.getMarker();
            document.querySelector(`button[data-row="${row}"][data-col="${col}"]`).textContent = computer.getMarker();
        }
    }

    const playerTurn = (event) => {
        if (event.target.textContent === "") {
            event.target.textContent = player.getMarker();
            gameboard[event.target.dataset.row][event.target.dataset.col] = player.getMarker();

            computerTurn();
        }
    }

    const init = () => {
        gameboard = new Array(3).fill(null).map(() => new Array(3).fill(null));

        gameboardGrid.textContent = "";
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let btn = document.createElement("button");
                btn.dataset.row = i;
                btn.dataset.col = j;
                btn.addEventListener("click", playerTurn);
                gameboardGrid.appendChild(btn);
            }
        }
    };

    const displayConsole = () => {
        console.table(gameboard);
    };

    const play = () => {
        init();
    }

    return {
        play,
    }
})();

TicTacToe.play();
