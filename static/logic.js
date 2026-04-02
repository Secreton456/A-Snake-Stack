// ========================== Game Constants ==========================
const canvas = document.getElementById("Canvas");
const ctx = canvas.getContext("2d");
const GRID_WIDTH = 32;
const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 800;
const GAME_FRAME_RATE = 10;
const e = 2.718;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
// FOOD_TYPE: [HEALTH, IMMUNITY(in ms), RELATIVE PROBABILITY, IMAGE SOURCE]
const FOOD = new Map([
  ["APPLE", [1, 0, 0.4, "../assets/apple.png"]],
  ["CARROT", [1, 0, 0.3, "../assets/carrot.png"]],
  ["PUMPKIN_PIE", [4, 0, 0.18, "../assets/pumpkin_pie.png"]],
  ["GOLDEN_CARROT", [5, 5000, 0.09, "../assets/golden_carrot.png"]],
  ["GOLDEN_APPLE", [5, 7000, 0.029, "../assets/golden_apple.png"]],
  ["ENCHANTED_APPLE", [10, 10000, 0.001, "../assets/enchanted_apple.png"]],
]);
// All the IMAGES from assets folder load and get stored here
const IMAGES = new Map();
// A  map of the death messages displayed after the game is over
const DEATH_MESSAGES = new Map([
  ["WALL", "Ouch, theres a wall for a reason man!"],
  ["BODY", "Ah! Having a long body has its own problems</text>"],
]);
// =====================================================================
let Running = false;
let Begin = true;
// ========================== Game Variables ==========================
let curDir = 1;
let snakeLength = 1;
let snakeHealth = 1;
let inStateOfEating = false; // True when the snake head coincides with a food item
let immuneDuration = 0; // in ms

// Generate a random number from 0 to (CANVAS_WIDTH/GRID_WIDTH)-1
let snake_row = Math.floor(CANVAS_WIDTH / (2 * GRID_WIDTH)) - 5;
let snake_column = Math.floor(CANVAS_HEIGHT / (2 * GRID_WIDTH));

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
      immuneDuration = Math.max(immuneDuration, FOOD.get(food.type)[1]);
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
    document
      .getElementById("overlay-homescreen")
      .style.setProperty("display", "none");
    document
      .getElementById("overlay-endscreen")
      .style.setProperty("display", "none");
    Running = true;
  } else if (event.key == "Backspace") {
    document
      .getElementById("overlay-homescreen")
      .style.setProperty("display", "flex");
    Running = false;
  }
});

function SnakeMovement() {
  if (curDir === 1) snake_column--;
  else if (curDir === 2) snake_column++;
  else if (curDir === 3) snake_row++;
  else snake_row--;
}

function updateImmunity() {
  if (immuneDuration >= 1000 / GAME_FRAME_RATE)
    immuneDuration -= 1000 / GAME_FRAME_RATE;
}

function start() {
  if (Begin) {
    curDir = 1;
    snakeHealth = 1;
    snakeLength = 1;
    inStateOfEating = false;
    snake_row = Math.floor(CANVAS_WIDTH / (2 * GRID_WIDTH)) - 5;
    snake_column = Math.floor(CANVAS_HEIGHT / (2 * GRID_WIDTH));
    Snake_cells = [{ x: snake_row, y: snake_column }];
    Food_cells = [];
    Begin = false;
  }
}

function checkdeath() {
  // Checks for death only when not immune
  if (immuneDuration == 0) {
    //checking for bumping with wall
    if (
      snake_row <= -1 ||
      snake_row >= CANVAS_WIDTH / GRID_WIDTH + 1 ||
      snake_column <= -1 ||
      snake_column >= CANVAS_HEIGHT / GRID_WIDTH + 1
    ) {
      EndScreen("WALL");
    }
    //checking for bumping with itself
    if (snakeLength > 1) {
      Snake_cells.forEach((snakeCell, index) => {
        if (
          index != 0 &&
          snakeCell.x === snake_row &&
          snakeCell.y === snake_column
        ) {
          EndScreen("BODY");
          return;
        }
      });
    }
  }
}

function EndScreen(cause) {
  Running = false;
  EndScore = document.getElementById("EndScore");
  EndScore.innerHTML =
    "<br>" +
    "<text class='header' style='color: aliceblue;'>" +
    DEATH_MESSAGES.get(cause) +
    "</text>";
  EndScore.innerHTML +=
    "<br>" +
    "<text class='header' style='color: aliceblue;'>Final Score:" +
    snakeHealth +
    "</text>";
  if (snakeHealth < 20) {
    EndScore.innerHTML +=
      "<br>" +
      "<text class='header' style='color: yellow;'>Status:Coughing baby</text>";
  } else if (snakeHealth > 100) {
    EndScore.innerHTML +=
      "<br>" +
      "<text class='header' style='color: purple;'>Status:Hydrogen Bomb</text>";
  } else {
    EndScore.innerHTML +=
      "<br>" +
      "<text class='header' style='color: blue;'>Status:Hydrogen Baby</text>";
  }
  document
    .getElementById("overlay-endscreen")
    .style.setProperty("display", "flex");
  Begin = true;
}

function gameLoop() {
  if (Running) {
    start();
    updateImmunity();
    checkdeath();
    UpdateCanvas();
    FoodSpawns();
    UpdateSnake();
    SnakeMovement();
    EatFood();
    UpdateScoreBoard();
  }
}

LoadImages();
setInterval(gameLoop, 1000 / GAME_FRAME_RATE);
