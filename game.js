const gameBoard = (() => {
    let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    const winCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
        [0, 4, 8], [2, 4, 6],             // Diagonals
    ];

    const isMovePossible = (position) => board[position] === 0;
    const changeBoard = (position, marker) => { board[position] = marker; };
    const getBoard = () => [...board]; // Return a copy to protect the state
    const resetBoard = () => { board = [0, 0, 0, 0, 0, 0, 0, 0, 0]; };

    const checkWin = (marker) => {
        return winCombos.some(combo => 
            combo.every(index => board[index] === marker)
        );
    };

    return { changeBoard, checkWin, resetBoard, isMovePossible, getBoard };
})();

const Player = (() => {
    const markers = ["X", "O"];
    let turn = 0;

    const getCurrentPlayer = () => markers[turn % 2];
    const switchTurn = () => { turn++; };
    const resetTurn = () => { turn = 0; };

    return { getCurrentPlayer, switchTurn, resetTurn };
})();

const gameLogic = (() => {
    let active = true;

    const playerMove = (index) => {
        if (!active || !gameBoard.isMovePossible(index)) return;

        const currentPlayer = Player.getCurrentPlayer();
        gameBoard.changeBoard(index, currentPlayer);
        DOMlogic.render();

        if (gameBoard.checkWin(currentPlayer)) {
            active = false;
            DOMlogic.gameEndPopup(`WON: ${currentPlayer}`);
            currentPlayer === "X" ? DOMlogic.scoreUpX() : DOMlogic.scoreUpY();
        } else if (!gameBoard.getBoard().includes(0)) {
            active = false;
            DOMlogic.gameEndPopup("IT IS A DRAW");
        } else {
            Player.switchTurn();
        }
    };

    const restart = () => {
        active = true;
        gameBoard.resetBoard();
        Player.resetTurn();
        DOMlogic.render();
    };

    return { playerMove, restart };
})();

const DOMlogic = ((doc) => {
    const buttons = doc.querySelectorAll('[id^="panel"]');
    const popUpPanel = doc.getElementById("GameEndPopUp");
    const restartBtn = doc.getElementById("restartbtn");
    const resultPanel = doc.getElementById("result");
    const scoreXPanel = doc.getElementById("scoreX");
    const scoreYPanel = doc.getElementById("scoreY");

    let scoreX = 0;
    let scoreY = 0;

    const render = () => {
        const board = gameBoard.getBoard();
        buttons.forEach((btn, i) => {
            btn.textContent = board[i] === 0 ? "" : board[i];
        });
    };

    buttons.forEach((btn, index) => {
        btn.addEventListener("click", () => gameLogic.playerMove(index));
    });

    restartBtn.addEventListener("click", () => {
        gameLogic.restart();
        popUpPanel.style.display = "none";
    });

    const gameEndPopup = (message) => {
        popUpPanel.style.display = "block";
        resultPanel.textContent = message;
    };

    const scoreUpX = () => { scoreX++; scoreXPanel.textContent = `X score: ${scoreX}`; };
    const scoreUpY = () => { scoreY++; scoreYPanel.textContent = `O score: ${scoreY}`; };

    return { gameEndPopup, scoreUpX, scoreUpY, render };
})(document);