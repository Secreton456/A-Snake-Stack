const canvas = document.getElementById("Canvas");
const ctx = canvas.getContext("2d");

const GRID_WIDTH = 32;
const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 800;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
function UpdateCanvas() {
  ctx.fillStyle = "#8F3C9E";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}
// Generate a random number from 0 to (CANVAS_WIDTH/GRID_WIDTH)-1
snake_row = Math.floor((Math.random() * CANVAS_WIDTH) / GRID_WIDTH);
snake_column = Math.floor((Math.random() * CANVAS_HEIGHT) / GRID_WIDTH);

function UpdateSnakeHead() {
  ctx.fillStyle = "#571F57";
  ctx.fillRect(
    snake_row * GRID_WIDTH,
    snake_column * GRID_WIDTH,
    GRID_WIDTH,
    GRID_WIDTH,
  );

  // Drawing the vertical lines
  for (let i = 1; i <= CANVAS_WIDTH / GRID_WIDTH; i++) {
    ctx.beginPath();
    ctx.moveTo(i * GRID_WIDTH, 0);
    ctx.lineTo(i * GRID_WIDTH, CANVAS_HEIGHT);
    ctx.strokestyle = "#140714";
    ctx.stroke();
  }

  // Drawing the horizontal lines
  for (let i = 1; i <= CANVAS_HEIGHT / GRID_WIDTH; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * GRID_WIDTH);
    ctx.lineTo(CANVAS_WIDTH, i * GRID_WIDTH);
    ctx.strokestyle = "#140714";
    ctx.stroke();
  }
}

cur_dir = 1;

document.addEventListener("keydown", (event) => {
  if (event.key == "ArrowUp" || event.key == "w" || event.key == "W")
    cur_dir = 1;
  else if (event.key == "ArrowDown" || event.key == "s" || event.key == "S")
    cur_dir = 2;
  else if (event.key == "ArrowRight" || event.key == "d" || event.key == "D")
    cur_dir = 3;
  else if (event.key == "ArrowLeft" || event.key == "a" || event.key == "A")
    cur_dir = 4;
});

function SnakeMovement() {
  if (cur_dir === 1) snake_column--;
  else if (cur_dir === 2) snake_column++;
  else if (cur_dir === 3) snake_row++;
  else snake_row--;
}

function gameLoop() {
  UpdateCanvas();
  UpdateSnakeHead();
  SnakeMovement();
}
setInterval(gameLoop, 100);
