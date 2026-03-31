// ========================== Game Constants ==========================
const canvas = document.getElementById("Canvas");
const ctx = canvas.getContext("2d");
const GRID_WIDTH = 32;
const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 800;
const e = 2.718;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
// FOOD_TYPE: [HEALTH, IMMUNITY, RELATIVE PROBABILITY, IMAGE SOURCE]
const FOOD = new Map([
  ["APPLE", [1, 0, 0.4, "../assets/apple.png"]],
  ["CARROT", [1, 0, 0.3, "../assets/carrot.png"]],
  ["PUMPKIN_PIE", [4, 0, 0.18, "../assets/pumpkin_pie.png"]],
  ["GOLDEN_CARROT", [5, 5, 0.09, "../assets/golden_carrot.png"]],
  ["GOLDEN_APPLE", [5, 7, 0.029, "../assets/golden_apple.png"]],
  ["ENCHANTED_APPLE", [10, 10, 0.401, "../assets/enchanted_apple.png"]],
]);
// All the IMAGES from assets folder load and get stored here
const IMAGES = new Map();
// =====================================================================
let Running = false;

// ========================== Game Variables ==========================
let curDir = 1;
let snakeLength = 1;
let snakeHealth = 1;
let inStateOfEating = false; // True when the snake head coincides with a food item

// Generate a random number from 0 to (CANVAS_WIDTH/GRID_WIDTH)-1
let snake_row = Math.floor((Math.random() * CANVAS_WIDTH) / GRID_WIDTH);
let snake_column = Math.floor((Math.random() * CANVAS_HEIGHT) / GRID_WIDTH);

let Food_cells = []; // [ { x:row, y:column,type: "FOOD_NAME" },... ]
let Snake_cells = [{ x: snake_row, y: snake_column }]; // [ { x:row, y:column },... ]
// =====================================================================

// Updates the Canvas Including the grid and the background
function UpdateCanvas() {
  ctx.fillStyle = "#7fbf4d";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Drawing the vertical lines
  for (let i = 1; i <= CANVAS_WIDTH / GRID_WIDTH; i++) {
    ctx.beginPath();
    ctx.moveTo(i * GRID_WIDTH, 0);
    ctx.lineTo(i * GRID_WIDTH, CANVAS_HEIGHT);
    ctx.strokeStyle = "#5a3e2b";
    ctx.stroke();
  }

  // Drawing the horizontal lines
  for (let i = 1; i <= CANVAS_HEIGHT / GRID_WIDTH; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * GRID_WIDTH);
    ctx.lineTo(CANVAS_WIDTH, i * GRID_WIDTH);
    ctx.strokeStyle = "#5a3e2b";
    ctx.stroke();
  }
}

// Changes the Snake_cells array based on the movement and eating of food
function UpdateSnake() {
  if (!inStateOfEating) Snake_cells.pop(); // removes the last cell if not eating food
  Snake_cells.unshift({ x: snake_row, y: snake_column }); // adds the current snake head at the front to the list
  // Draws all the snake cells
  Snake_cells.forEach((snakeCell, index) => {
    if (index === 0) {
      //head
      ctx.drawImage(
        IMAGES.get("SNAKE_HEAD"),
        snakeCell.x * GRID_WIDTH,
        snakeCell.y * GRID_WIDTH,
        GRID_WIDTH,
        GRID_WIDTH,
      );
    } else {
      //body
      ctx.drawImage(
        IMAGES.get("SNAKE_BODY"),
        snakeCell.x * GRID_WIDTH,
        snakeCell.y * GRID_WIDTH,
        GRID_WIDTH,
        GRID_WIDTH,
      );
    }
  });
}

// Spawning Food Logic
function FoodSpawns() {
  // The probability of food spawning set to be inversely proportional to the exponent of the present number of food slots.
  for (let i = 1; i <= CANVAS_WIDTH / GRID_WIDTH; i++)
    for (let j = 1; j <= CANVAS_HEIGHT / GRID_WIDTH; j++)
      for (let [food, value] of FOOD) {
        if (
          Math.random() <
          (0.5 * value[2]) / (e ** (Food_cells.length ** 1) * 6)
        )
          Food_cells[Food_cells.length] = { x: i, y: j, type: food };
      }

  // sorting the Food_cells
  Food_cells.sort((a, b) => a.x - b.x);

  // Drawing the Food cells
  for (const food of Food_cells) {
    ctx.drawImage(
      IMAGES.get(food.type),
      food.x * GRID_WIDTH,
      food.y * GRID_WIDTH,
      GRID_WIDTH,
      GRID_WIDTH,
    );
  }
}

function EatFood() {
  let found = false; // temporary variable to update inStateofEating
  for (let food of Food_cells) {
    if (snake_row == food.x && snake_column == food.y) {
      let index = Food_cells.findIndex(
        (obj) => obj.x == food.x && obj.y == food.y,
      );
      Food_cells.splice(index, 1); // Removes the first instance of the snake head in the array
      snakeHealth += FOOD.get(food.type)[0];
      snakeLength++;
      found = true;
    }
  }
  inStateOfEating = found; // update inStateOfEating
}

function UpdateScoreBoard() {
  ScoreCard = document.getElementById("ScoreBoard");
  ScoreCard.innerHTML =
    "<text class='header' style='color: red;'>Score:" + snakeHealth + "</text>"; // Display SnakeHealth
}

function LoadImages() {
  for (let [food, value] of FOOD) {
    let img = new Image();
    img.src = value[3];
    img.onload = () => {
      IMAGES.set(food, img);
    };
  }

  let SnakeBodyImg = new Image();
  SnakeBodyImg.src = "../assets/SnakeBody.png";
  let SnakeHeadImg = new Image();
  SnakeHeadImg.src = "../assets/SnakeHead.png";
  SnakeHeadImg.onload = () => {
    IMAGES.set("SNAKE_HEAD", SnakeHeadImg);
  };
  SnakeBodyImg.onload = () => {
    IMAGES.set("SNAKE_BODY", SnakeBodyImg);
  };
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
  else if (event.key == "Enter") {
    document.getElementById("overlay").style.setProperty("display", "none");
    Running = true;
  } else if (event.key == "Backspace") {
    document.getElementById("overlay").style.setProperty("display", "flex");
    Running = false;
  }
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
LoadImages();
setInterval(gameLoop, 100);
