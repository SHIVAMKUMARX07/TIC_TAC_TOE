const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');
const modal = document.createElement('div'); // Create modal dynamically
modal.className = 'modal';

let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];

const winningConditions = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal
  [2, 4, 6]  // Diagonal
];

// Add stars to the background
function createStars() {
  const starCount = 100;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.top = `${Math.random() * 100}vh`;
    star.style.left = `${Math.random() * 100}vw`;
    star.style.animationDuration = `${Math.random() * 2 + 1}s`;
    document.body.appendChild(star);
  }
}

// Add rockets and asteroids to the background
function createSpaceObjects() {
  const objectCount = 10;
  for (let i = 0; i < objectCount; i++) {
    const object = document.createElement('div');
    object.className = Math.random() > 0.5 ? 'rocket' : 'asteroid';
    object.style.top = `${Math.random() * 100}vh`;
    object.style.left = `${Math.random() * 100}vw`;
    object.style.animationDuration = `${Math.random() * 10 + 5}s`;
    document.body.appendChild(object);
  }
}

createStars();
createSpaceObjects();

function handleCellClick(event) {
  const clickedCell = event.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

  if (gameState[clickedCellIndex] !== '' || !gameActive) {
    return;
  }

  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;
  clickedCell.setAttribute('data-mark', currentPlayer); // Add data-mark attribute

  checkForWinner();
}

function checkForWinner() {
  let roundWon = false;

  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
      continue;
    }
    if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    showWinPopup(`Player ${currentPlayer} wins!`);
    buzzBoard();
    return;
  }

  if (!gameState.includes('')) {
    statusText.textContent = 'Draw!';
    gameActive = false;
    showWinPopup('It\'s a draw!');
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function buzzBoard() {
  board.classList.add('buzz');
  setTimeout(() => {
    board.classList.remove('buzz');
  }, 600); // Remove buzz effect after 0.6 seconds
}

function showWinPopup(message) {
  modal.innerHTML = `
    <div class="modal-content">
      <h2>${message}</h2>
      <button onclick="closeModal()">Play Again</button>
    </div>
  `;
  document.body.appendChild(modal);
  modal.style.display = 'flex';
}

function closeModal() {
  modal.style.display = 'none';
  resetGame();
}

function resetGame() {
  gameState = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayer = 'X';
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.removeAttribute('data-mark');
  });
}
48
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);