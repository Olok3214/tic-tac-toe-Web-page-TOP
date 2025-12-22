const gameBoard = (() => {
  let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const isMovePosibble = (position) => {
    if (board[position] == 0) {
      return true;
    } else {
      return false;
    }
  };

  const changeBoard = (position, marker) => {
    board[position] = marker;
  };

  const getBoard = () => {
    return board;
  };

  const checkWin = (curentplayer) => {
    for (let i = 0; i < winCombos.length; i++) {
      const [a, b, c] = winCombos[i];
      // Check if all cells in the combo belong to the current player
      if (
        board[a] === curentplayer &&
        board[b] === curentplayer &&
        board[c] === curentplayer
      ) {
        return true; //curent player wins
      }
    }
    return false;
  };

  const resetBoard = () => {
    board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  };

  return { changeBoard, checkWin, resetBoard, isMovePosibble, getBoard };
})();

const Player = (() => {
  const playerOneMarker = "X";
  const playerTwoMarker = "Y";
  let currentPlayer = playerOneMarker;

  //Returns curent player and changes next player
  const getCurrentPlayer = () => {
    const prewPlayer = currentPlayer;
    currentPlayer =
      prewPlayer === playerOneMarker ? playerTwoMarker : playerOneMarker;
    return prewPlayer;
  };

  return { getCurrentPlayer };
})();

const gameLogic = (() => {
  const checkGameState = (curentplayer) => {
    if (gameBoard.checkWin(curentplayer) === true) {
      let message = "WON: " + curentplayer;
      DOMlogic.gameEndPopup(message);

      if (curentplayer === "X") {
        DOMlogic.scoreUpX();
      } else {
        DOMlogic.scoreUpY();
      }
    } else if (gameBoard.getBoard().indexOf(0) === -1) {
      DOMlogic.gameEndPopup("IT IS A DRAW");
    }
  };

  const playerMove = (position) => {
    //Gets current player (X or Y) and sets on console

    //Checks if the move is possible, if no does nothing
    if (gameBoard.isMovePosibble(position)) {
      let curentPlayer = Player.getCurrentPlayer();
      gameBoard.changeBoard(position, curentPlayer);
      checkGameState(curentPlayer);
    }
  };

  return { playerMove };
})();

const DOMlogic = ((doc) => {
  const buttons = doc.querySelectorAll('[id^="panel"]');
  const popUpPaned = doc.getElementById("GameEndPopUp");
  const restartBtn = doc.getElementById("restartbtn");
  const resultPanel = doc.getElementById("result");
  const scoreXPanel = doc.getElementById("scoreX");
  const scoreYPanel = doc.getElementById("scoreY");

  let scoreX = 0;
  let scoreY = 0;

  buttons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      gameLogic.playerMove(index);
      const board = gameBoard.getBoard();
      btn.textContent = board[index];
    });
  });

  restartBtn.addEventListener("click", () => {
    gameBoard.resetBoard();
    popUpPaned.style.display = "none";
    resetBtns();
  });

  const gameEndPopup = (message) => {
    popUpPaned.style.display = "block";
    resultPanel.textContent = message;
  };

  const resetBtns = () => {
    buttons.forEach((btn, index) => {
      btn.textContent = " ";
    });
  };

  const scoreUpX = () => {
    scoreX++;
    scoreXPanel.textContent = `X score: ${scoreX} `;
  };

  const scoreUpY = () => {
    scoreY++;
    scoreYPanel.textContent = `Y score: ${scoreY} `;
  };

  return { gameEndPopup, scoreUpX, scoreUpY };
})(document);
