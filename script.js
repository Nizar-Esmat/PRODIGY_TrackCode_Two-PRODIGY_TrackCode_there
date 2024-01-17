let currentPlayer = "X";
let gameBoard = ['', '', '',
                '', '', '',
                '', '', ''];
let gameActive = false;
let isMultiplayer = true;

function startGameWithAI() {
    isMultiplayer = false;
    startGame();
    makeAIMove();
}

function startGameWithMultiplayer() {
    isMultiplayer = true;
    startGame();
}

function handleCellClick(index) {
    if (!gameActive || gameBoard[index] !== '') return;

    gameBoard[index] = currentPlayer;
    document.getElementById(`cell${index}`).innerText = currentPlayer;

    if (checkWin()) {
        displayMessage(`${currentPlayer} Wins`);
        gameActive = false;
    } else if (gameBoard.every(cell => cell !== '')) {
        displayMessage('It\'s a tie');
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

        if (currentPlayer === 'O' && !isMultiplayer && gameActive) {
            makeAIMove();
        } else {
            displayMessage(`Player ${currentPlayer}'s turn`);
        }
    }
}

function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return gameBoard[a] !== '' && gameBoard[a] === gameBoard[b] && gameBoard[b] === gameBoard[c];
    });
}

function displayMessage(message) {
    document.getElementById('message').innerText = message;
}

function startGame() {
    gameActive = true;
    document.getElementById('message').innerText = `Player ${currentPlayer}'s turn`;
}

function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = false;
    isMultiplayer = true;

    document.getElementById('message').innerText = 'Choose game mode:';
    for (let i = 0; i < 9; i++) {
        document.getElementById(`cell${i}`).innerText = '';
    }
}

function makeAIMove() {
    if (!isMultiplayer && gameActive) {
        const bestMove = minimax(gameBoard, 'O').index;

        gameBoard[bestMove] = 'O';
        document.getElementById(`cell${bestMove}`).innerText = 'O';

        if (checkWin()) {
            displayMessage('AI Wins');
            gameActive = false;
        } else if (gameBoard.every(cell => cell !== '')) {
            displayMessage('It\'s a tie');
            gameActive = false;
        } else {
            currentPlayer = 'X';
            displayMessage(`Player X's turn`);
        }
    }
}

function getEmptyCells(board) {
    const emptyCells = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            emptyCells.push(i);
        }
    }
    return emptyCells;
}

function minimax(board, player) {
    const availableMoves = getEmptyCells(board);

    if (checkWinning(board, 'X')) {
        return { score: -1 };
    } else if (checkWinning(board, 'O')) {
        return { score: 1 };
    } else if (availableMoves.length === 0) {
        return { score: 0 };
    }

    const moves = [];

    for (let i = 0; i < availableMoves.length; i++) {
        const move = {};
        move.index = availableMoves[i];

        board[availableMoves[i]] = player;

        if (player === 'O') {
            const result = minimax(board, 'X');
            move.score = result.score;
        } else {
            const result = minimax(board, 'O');
            move.score = result.score;
        }
        board[availableMoves[i]] = '';
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function checkWinning(board, player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return board[a] === player && board[b] === player && board[c] === player;
    });
}

const boardElement = document.getElementById('board');
for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.id = `cell${i}`;
    cell.addEventListener('click', () => handleCellClick(i));
    boardElement.appendChild(cell);
}

resetGame();
