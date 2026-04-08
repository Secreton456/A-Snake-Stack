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
// ========================== Game Classes ============================
class Food {
  constructor(name, health, immunity, probability, img_src) {
    this.name = name;
    this.health = health;
    this.immunity = immunity;
    this.probability = probability;
    this.img_src = img_src;
  }
  load_img() {
    let img = new Image();
    img.src = this.img_src;
    img.onload = () => {
      IMAGES.set(this.name, img);
    };
  }
}

class Obstacle {
  constructor(name, row, column) {
    this.name = name;
    this.img_src = IMAGES.get(name);
    this.row = row;
    this.column = column;
    this.eatable = true;
  }
  draw() {
    ctx.drawImage(
      this.img_src,
      this.row * GRID_WIDTH,
      this.column * GRID_WIDTH,
      GRID_WIDTH,
      GRID_WIDTH,
    );
  }
  isActive(Snake_cells) {
    if (Snake_cells[0].x == this.row && Snake_cells[0].y == this.column)
      return true;
  }
  isPassiveActive(Snake_cells) {
    for (let cell of Snake_cells) {
      if (cell.x == this.row && cell.y == this.column) return true;
    }
    return false;
  }
  effect() {}
}

class RottenFlesh extends Obstacle {
  constructor(name, row, column, damage_per_frame) {
    super(name, row, column);
    this.damage_per_frame = damage_per_frame;
  }
  draw() {
    super.draw();
  }
  isActive(Snake_cells) {
    return super.isActive(Snake_cells);
  }
  isPassiveActive(Snake_cells) {
    return false;
  }
  effect() {}
}

class Lava extends Obstacle {
  constructor(name, row, column) {
    super(name, row, column);
    this.eatable = false;
  }
  draw() {
    super.draw();
  }
  isActive(Snake_cells) {
    return super.isActive(Snake_cells);
  }
  isPassiveActive(Snake_cells) {
    return false;
  }
  effect() {}
}

class Magma extends Obstacle {
  constructor(name, row, column, damage_per_frame, time_left = 10) {
    super(name, row, column);
    this.damage_per_frame = damage_per_frame;
    this.eatable = false;
    this.time_left = time_left;
  }
  draw() {
    super.draw();
  }
  isActive() {
    return false;
  }
  isPassiveActive(Snake_cells) {
    return super.isPassiveActive(Snake_cells);
  }
  effect() {}
  updateTimer() {}
}

class SoulSand extends Obstacle {
  constructor(name, row, column, speedbuff, time_left = 10) {
    super(name, row, column);
    this.speedbuff = speedbuff;
    this.eatable = false;
    this.time_left = time_left;
  }
  draw() {
    super.draw();
  }
  isActive() {
    return false;
  }
  isPassiveActive(Snake_cells) {
    return super.isPassiveActive(Snake_cells);
  }
  effect() {}
  updateTimer() {}
}

class BlueIce extends Obstacle {
  constructor(name, row, column, speedbuff, time_left = 10) {
    super(name, row, column);
    this.speedbuff = speedbuff;
    this.eatable = false;
    this.time_left = time_left;
  }
  draw() {
    super.draw();
  }
  isActive() {
    return false;
  }
  isPassiveActive(Snake_cells) {
    return super.isPassiveActive(Snake_cells);
  }
  effect() {}
  updateTimer() {}
}
// ====================================================================

// FOOD_TYPE: [HEALTH, IMMUNITY(in ms), RELATIVE PROBABILITY, IMAGE SOURCE]
// prettier-ignore
const FOOD_ITEMS = new Map([
  ["APPLE", new Food("APPLE", 1, 0, 0.4, "/static/assets/apple.png")],
  ["CARROT", new Food("CARROT", 1, 0, 0.3, "/static/assets/carrot.png")],
  ["PUMPKIN_PIE", new Food("PUMPKIN_PIE", 4, 0, 0.18, "/static/assets/pumpkin_pie.png")],
  ["GOLDEN_CARROT",new Food("GOLDEN_CARROT", 5, 5000, 0.09, "/static/assets/golden_carrot.png")],
  ["GOLDEN_APPLE",new Food("GOLDEN_APPLE", 5, 7000, 0.029, "/static/assets/golden_apple.png")],
  ["ENCHANTED_APPLE",new Food("ENCHANTED_APPLE",10,10000,0.001,"/static/assets/enchanted_apple.png")],
]);

// PROBABLITY OF SPAWNING STORED
const OBSTACLE_ITEMS = new Map([
  ["LAVA", 0.1],
  ["MAGMA", 0.1],
  ["ROTTEN_FLESH", 0.1],
  ["SOUL_SAND", 0.1],
  ["BLUE_ICE", 0.1],
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
let Obstacle_cells = [];
let Obstacle_objects;
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
      for (let [food, value] of FOOD_ITEMS) {
        //prettier-ignore
        if (Math.random() < (0.5 * value.probability) / (e ** (Food_cells.length ** 1) * 6))
          if(Food_cells.find(cell => (cell.x == i && cell.y == j))===undefined)
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

function ObstacleSpawns() {
  //prettier-ignore
  for (let i = 1; i <= CANVAS_WIDTH / GRID_WIDTH; i++)
    for (let j = 1; j <= CANVAS_HEIGHT / GRID_WIDTH; j++)
      for (let [obstacle, value] of OBSTACLE_ITEMS) {
        if(Math.random() < (0.05 * value) / (e ** (Obstacle_cells.length ** 1) * 6))
          if(Obstacle_cells.find(cell => (cell.row == i && cell.column == j))===undefined){
            if(obstacle == "ROTTEN_FLESH")
              Obstacle_cells.push(new RottenFlesh(obstacle, i, j, 0.5));
            else if(obstacle == "LAVA")
              Obstacle_cells.push(new Lava(obstacle, i, j));
            else if(obstacle == "MAGMA")
              Obstacle_cells.push(new Magma(obstacle, i , j, 0.5, 10));
            else if(obstacle == "SOUL_SAND")
              Obstacle_cells.push(new SoulSand(obstacle, i , j, 2, 10));
            else if(obstacle == "BLUE_ICE")
              Obstacle_cells.push(new BlueIce(obstacle, i , j, 0.5, 10));
          } 
      }

  for (const obstacle of Obstacle_cells) {
    obstacle.draw();
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
      snakeHealth += FOOD_ITEMS.get(food.type).health;
      snakeLength++;
      immuneDuration = Math.max(
        immuneDuration,
        FOOD_ITEMS.get(food.type).immunity,
      );
      found = true;
    }
  }
  inStateOfEating = found; // update inStateOfEating
}
//----------------------------------------------------

function PassObstacles() {
  for (let obstacle of Obstacle_cells) {
    if (obstacle.isActive(Snake_cells)) {
      let index = Obstacle_cells.findIndex(
        (obj) => obj.row == obstacle.row && obj.column == obstacle.column,
      );
      obstacle.effect();
      Obstacle_cells.splice(index, 1);
    }
    if (obstacle.isPassiveActive(Snake_cells)) {
      obstacle.effect();
    }
  }
}

function UpdateScoreBoard() {
  ScoreCard = document.getElementById("ScoreBoard");
  ScoreCard.innerHTML =
    "<text class='header' style='color: red;'>Score:" + snakeHealth + "</text>"; // Display SnakeHealth
}

function LoadImages() {
  for (let [name, value] of FOOD_ITEMS) {
    value.load_img();
  }
  let obstaclefiles = [
    "blue_ice.png",
    "lava.jpeg",
    "magma.png",
    "rotten_flesh.png",
    "soul_sand.png",
  ];
  obstaclefiles.forEach((file) => {
    let name = file.split(".");
    let img = new Image();
    img.src = `/static/assets/${file}`;
    name = name[0].toUpperCase();
    img.onload = () => {
      IMAGES.set(name, img);
    };
  });
  let SnakeBodyImg = new Image();
  SnakeBodyImg.src = "/static/assets/SnakeBody.png";
  let SnakeHeadImg = new Image();
  SnakeHeadImg.src = "/static/assets/SnakeHead.png";
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

LoadImages();

function gameLoop() {
  if (Running) {
    start();
    updateImmunity();
    checkdeath();
    UpdateCanvas();
    FoodSpawns();
    ObstacleSpawns();
    UpdateSnake();
    SnakeMovement();
    EatFood();
    PassObstacles();
    UpdateScoreBoard();
  }
}

setInterval(gameLoop, 1000 / GAME_FRAME_RATE);
