// Game Constants
const canvas = document.getElementById("Canvas");
const ctx = canvas.getContext("2d");
const GRID_WIDTH = 32;
const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 800;
const e = 2.718;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

let Running = false;

//<----- Game Variables----->
let curDir = 1;
let snakeLength = 1;
let snakeHealth = 1;
let inStateOfEating = false;
// Generate a random number from 0 to (CANVAS_WIDTH/GRID_WIDTH)-1
let snake_row = Math.floor((Math.random() * CANVAS_WIDTH) / GRID_WIDTH);
let snake_column = Math.floor((Math.random() * CANVAS_HEIGHT) / GRID_WIDTH);
let Food_cells = [];
let Snake_cells = [{ x: snake_row, y: snake_column }];
//<-------------------------->

// Updates the Canvas Including the grid and the background
function UpdateCanvas() {
  ctx.fillStyle = "#8F3C9E";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Drawing the vertical lines
  for (let i = 1; i <= CANVAS_WIDTH / GRID_WIDTH; i++) {
    ctx.beginPath();
    ctx.moveTo(i * GRID_WIDTH, 0);
    ctx.lineTo(i * GRID_WIDTH, CANVAS_HEIGHT);
    ctx.strokeStyle = "#140714";
    ctx.stroke();
  }

  // Drawing the horizontal lines
  for (let i = 1; i <= CANVAS_HEIGHT / GRID_WIDTH; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * GRID_WIDTH);
    ctx.lineTo(CANVAS_WIDTH, i * GRID_WIDTH);
    ctx.strokeStyle = "#140714";
    ctx.stroke();
  }
}

// Changes the Snake_cells array based on the movement and eating of food
function UpdateSnake() {
  if (!inStateOfEating) Snake_cells.pop();
  Snake_cells.unshift({ x: snake_row, y: snake_column });
  ctx.fillStyle = "#571F57";
  for (snakeCell of Snake_cells) {
    ctx.fillRect(
      snakeCell.x * GRID_WIDTH,
      snakeCell.y * GRID_WIDTH,
      GRID_WIDTH,
      GRID_WIDTH,
    );
  }
}

// Addition of one food till now
function FoodSpawns() {
  // The probability of food spawning set to be inversely proportional to the exponent of the present number of food slots.
  for (let i = 1; i <= CANVAS_WIDTH / GRID_WIDTH; i++)
    for (let j = 1; j <= CANVAS_HEIGHT / GRID_WIDTH; j++)
      if (Math.random() < 0.5 / e ** (Food_cells.length ** 1))
        Food_cells[Food_cells.length] = { x: i, y: j };

  Food_cells.sort((a, b) => a.x - b.x);

  for (const food of Food_cells) {
    ctx.fillStyle = "red";
    ctx.fillRect(
      food.x * GRID_WIDTH,
      food.y * GRID_WIDTH,
      GRID_WIDTH,
      GRID_WIDTH,
    );
  }
}

function EatFood() {
  let found = false;
  for (let food of Food_cells) {
    if (snake_row == food.x && snake_column == food.y) {
      let index = Food_cells.findIndex(
        (obj) => obj.x == food.x && obj.y == food.y,
      );
      Food_cells.splice(index, 1);
      snakeHealth++;
      snakeLength++;
      found = true;
    }
  }
  inStateOfEating = found;
}

function UpdateScoreBoard() {
  ScoreCard = document.getElementById("ScoreBoard");
  ScoreCard.innerHTML = "<text>Score:" + snakeHealth + "</text>";
}

document.addEventListener("keydown", (event) => {
  if (
    (event.key == "ArrowUp" || event.key == "w" || event.key == "W") &&
    curDir != 2
  )
    curDir = 1;
  else if (
    (event.key == "ArrowDown" || event.key == "s" || event.key == "S") &&
    curDir != 1
  )
    curDir = 2;
  else if (
    (event.key == "ArrowRight" || event.key == "d" || event.key == "D") &&
    curDir != 4
  )
    curDir = 3;
  else if (
    (event.key == "ArrowLeft" || event.key == "a" || event.key == "A") &&
    curDir != 3
  )
    curDir = 4;
  else if (event.key == "Enter") Running = true;
  else if (event.key == "Backspace") Running = false;
});

function SnakeMovement() {
  if (curDir === 1) snake_column--;
  else if (curDir === 2) snake_column++;
  else if (curDir === 3) snake_row++;
  else snake_row--;
}

function gameLoop() {
  if (Running) {
    UpdateCanvas();
    FoodSpawns();
    UpdateSnake();
    SnakeMovement();
    EatFood();
    UpdateScoreBoard();
  }
}
setInterval(gameLoop, 100);
