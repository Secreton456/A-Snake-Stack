// ========================== Game Constants ==========================
const canvas = document.getElementById("Canvas");
const ctx = canvas.getContext("2d");
let GRID_WIDTH = 32;
const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 832;
let GAME_FRAME_RATE = 10;
let basemovementrate = 1000 / GAME_FRAME_RATE;
let lastRenderTime = 0;
let lasttimerupdate = 0;
let snakemovementrate = basemovementrate;
const e = 2.718;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
let poisontime = 0;
let count = 0;
let gametime = 0;
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
  constructor(name, row, column, damage_per_frame, time_left = 10000) {
    super(name, row, column);
    this.damage_per_frame = damage_per_frame;
    this.time_left = time_left;
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
  effect(snakeHealth) {
    poisontime = Math.max(poisontime, 5000); //
    return snakeHealth;
  }
}

class Lava extends Obstacle {
  constructor(name, row, column, time_left = 10000) {
    super(name, row, column);
    this.time_left = time_left;
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
  effect(snakeHealth) {
    EndScreen("LAVA");
  }
}

class Magma extends Obstacle {
  constructor(name, row, column, damage_per_frame, time_left = 10000) {
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
  effect(snakeHealth) {
    snakeHealth -= Math.min(snakeHealth, this.damage_per_frame);
    return snakeHealth;
  }
}

class SoulSand extends Obstacle {
  constructor(name, row, column, speedbuff, time_left = 10000) {
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
}

class BlueIce extends Obstacle {
  constructor(name, row, column, speedbuff, time_left = 10000) {
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
  ["LAVA", "Ah! Lava is hot, who knew?"],
  ["ZERO_HEALTH", "I feel so weak, I just died of zero health!"],
]);

// =====================================================================

let Running = false;
let Begin = true;
let inEndScreen = false;
let inHomeScreen = true;
let Difficulty = "NONE";
let username = undefined;
let showRules = false;

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

function initiate_game_variables() {
  curDir = 1;
  snakeLength = 1;
  snakeHealth = 1;
  inStateOfEating = false; // True when the snake head coincides with a food item
  immuneDuration = 0; // in ms
  poisontime = 0;
  count = 0;
  gametime = 0;
  // Generate a random number from 0 to (CANVAS_WIDTH/GRID_WIDTH)-1
  snake_row = Math.floor(CANVAS_WIDTH / (2 * GRID_WIDTH)) - 5;
  snake_column = Math.floor(CANVAS_HEIGHT / (2 * GRID_WIDTH));
  Food_cells = []; // [ { x:row, y:column,type: "FOOD_NAME" },... ]
  Snake_cells = [{ x: snake_row, y: snake_column }]; // [ { x:row, y:column },... ]
  // =====================================================================
}

// Updates the Canvas Including the grid and the background
function UpdateCanvas() {
  ctx.fillStyle = "#7fbf4d";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Drawing the vertical lines
  for (let i = 0; i <= CANVAS_WIDTH / GRID_WIDTH; i++) {
    ctx.beginPath();
    ctx.moveTo(i * GRID_WIDTH, 0);
    ctx.lineTo(i * GRID_WIDTH, CANVAS_HEIGHT);
    ctx.strokeStyle = "#5a3e2b";
    ctx.stroke();
  }

  // Drawing the horizontal lines
  for (let i = 0; i <= CANVAS_HEIGHT / GRID_WIDTH; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * GRID_WIDTH);
    ctx.lineTo(CANVAS_WIDTH, i * GRID_WIDTH);
    ctx.strokeStyle = "#5a3e2b";
    ctx.stroke();
  }
}

// Changes the Snake_cells array based on the movement and eating of food
function MoveSnake() {
  if (!inStateOfEating) Snake_cells.pop(); // removes the last cell if not eating food
  Snake_cells.unshift({ x: snake_row, y: snake_column }); // adds the current snake head at the front to the list
}

function DrawSnake() {
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
  for (let i = 0; i < CANVAS_WIDTH / GRID_WIDTH; i++)
    for (let j = 0; j < CANVAS_HEIGHT / GRID_WIDTH; j++)
      for (let [food, value] of FOOD_ITEMS) {
        //prettier-ignore
        if (Math.random() < (0.5 * value.probability) / (e ** (Food_cells.length ** 1) * 6))
          if(Food_cells.find(cell => (cell.x == i && cell.y == j))===undefined
          && Snake_cells.find(cell => (cell.x == i  && cell.y == j))=== undefined
          && Obstacle_cells.find(cell => (cell.row == i && cell.column == j))===undefined)
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
  for (let i = 0; i < CANVAS_WIDTH / GRID_WIDTH; i++)
    for (let j = 0; j < CANVAS_HEIGHT / GRID_WIDTH; j++)
      for (let [obstacle, value] of OBSTACLE_ITEMS) {
        if(Math.random() < (0.05 * value) / (e ** (Obstacle_cells.length ** 1) * 6))
          if(Obstacle_cells.find(cell => (cell.row == i && cell.column == j))===undefined
          && Snake_cells.find(cell => (cell.x == i  && cell.y == j))=== undefined
          && Food_cells.find(cell => (cell.x == i && cell.y == j))===undefined){
            if(obstacle == "ROTTEN_FLESH")
              Obstacle_cells.push(new RottenFlesh(obstacle, i, j, 0.5, 5000 + 5000*Math.random()));
            else if(obstacle == "LAVA")
              Obstacle_cells.push(new Lava(obstacle, i, j,5000+5000*Math.random()));
            else if(obstacle == "MAGMA")
              Obstacle_cells.push(new Magma(obstacle, i , j, 0.5,5000+5000*Math.random()));
            else if(obstacle == "SOUL_SAND")
              Obstacle_cells.push(new SoulSand(obstacle, i , j, 0.5,5000+5000*Math.random()));
            else if(obstacle == "BLUE_ICE")
              Obstacle_cells.push(new BlueIce(obstacle, i , j, 2,5000+5000*Math.random()));
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

function PassObstacles_type1() {
  for (let obstacle of Obstacle_cells) {
    if (
      obstacle instanceof RottenFlesh ||
      obstacle instanceof Lava ||
      obstacle instanceof Magma
    ) {
      if (obstacle.isActive(Snake_cells)) {
        let index = Obstacle_cells.findIndex(
          (obj) => obj.row == obstacle.row && obj.column == obstacle.column,
        );
        if (obstacle instanceof RottenFlesh) {
          if (immuneDuration == 0) {
            snakeHealth = obstacle.effect(snakeHealth);
          }
        } else {
          if (immuneDuration == 0) {
            obstacle.effect(snakeHealth);
          }
        }
        Obstacle_cells.splice(index, 1);
      }
      if (obstacle.isPassiveActive(Snake_cells)) {
        if (immuneDuration == 0) {
          snakeHealth = obstacle.effect(snakeHealth);
        }
      }
    }
  }
}

function PassObstacles_type2() {
  let speedmultiplier = 1;
  for (let obstacle of Obstacle_cells) {
    if (obstacle instanceof SoulSand || obstacle instanceof BlueIce) {
      if (obstacle.isPassiveActive(Snake_cells)) {
        speedmultiplier = speedmultiplier * obstacle.speedbuff;
      }
    }
  }
  snakemovementrate = basemovementrate / speedmultiplier;
}

function UpdateScoreBoard() {
  ScoreCard = document.getElementById("ScoreBoard");
  ScoreCard.innerHTML =
    "<h1 class='header'>Score: " +
    snakeHealth.toString().padStart(3, "0") +
    " Immunity: " +
    (immuneDuration / 1000).toFixed(2) +
    "s" +
    "</h1>"; // Display SnakeHealth
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

function validateUserName() {
  username = document.getElementById("username").value;
  if (username == "") {
    document.getElementById("errormsg").textContent =
      "Username cannot be empty";
    document.getElementById("errormsg").classList.add("show");
  } else {
    document.getElementById("errormsg").classList.remove("show");
    start();
  }
}
document.getElementById("Easy").addEventListener("click", () => {
  Difficulty = "EASY";
  validateUserName();
});
document.getElementById("Difficult").addEventListener("click", () => {
  Difficulty = "HARD";
  validateUserName();
});
document.getElementById("Rules").addEventListener("click", () => {
  if (!showRules) {
    document
      .getElementById("rules-popup")
      .style.setProperty("display", "block");
    showRules = true;
  } else {
    document.getElementById("rules-popup").style.setProperty("display", "none");
    showRules = false;
  }
});

//prettier-ignore
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
  else if (event.key == "Enter" && Begin == false) {
    document.getElementById("overlay-homescreen").style.setProperty("display", "none");
    Running = true;
    requestAnimationFrame(gameLoop);
  } else if (event.key == "Enter" && inEndScreen == true) {
    start();
    inEndScreen = false;
  } else if ((event.key == "H" || event.key == "h") && inEndScreen == true) {
    home();
    inEndScreen = false;
  } else if (event.key == "Backspace" && inHomeScreen == false) {
    document.getElementById("Difficulty").style.setProperty("display", "none");
    document.getElementById("overlay-homescreen").style.setProperty("display", "flex");
    document.getElementById("username-text").style.display = "none";
    document.getElementById("resume-screen-instructions").style.display = "flex";
    Running = false;
  }
});

function SnakeMovement() {
  if (curDir === 1) snake_column--;
  else if (curDir === 2) snake_column++;
  else if (curDir === 3) snake_row++;
  else snake_row--;
}

function updateTimers() {
  gametime += 250;
  if (count < 4) {
    count++;
  } else {
    count = 0;
  }
  for (let obstacle of Obstacle_cells) {
    obstacle.time_left -= 250;
    if (obstacle.time_left <= 0) {
      let index = Obstacle_cells.findIndex(
        (obj) => obj.row == obstacle.row && obj.column == obstacle.column,
      );
      Obstacle_cells.splice(index, 1);
    }
  }
  immuneDuration -= 250;
  immuneDuration = Math.max(0, immuneDuration);
  if (poisontime > 0 && count == 0) {
    if (immuneDuration == 0) {
      snakeHealth -= 1;
    }
    snakeHealth = Math.max(0, snakeHealth);
    poisontime -= 1000;
    poisontime = Math.max(0, poisontime);
  }
}

function start() {
  document.getElementById("Canvas").style.display = "block";

  inEndScreen = false;
  if (Difficulty == "HARD") {
    GRID_WIDTH = 32;
    GAME_FRAME_RATE = 10;
  } else if (Difficulty == "EASY") {
    GRID_WIDTH = 64;
    GAME_FRAME_RATE = 5;
  }
  if (Difficulty != "NONE") {
    if (Begin) {
      basemovementrate = 1000 / GAME_FRAME_RATE;
      snakemovementrate = basemovementrate;
      initiate_game_variables();
      Begin = false;
      document
        .getElementById("overlay-homescreen")
        .style.setProperty("display", "none");
      document
        .getElementById("overlay-endscreen")
        .style.setProperty("display", "none");
      Running = true;
    }
    requestAnimationFrame(gameLoop);

    inHomeScreen = false;
  }
}

function checkdeath() {
  // Checks for death only when not immune
  if (snakeHealth <= 0) {
    EndScreen("ZERO_HEALTH");
    return;
  }
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
      for (let i = 1; i < Snake_cells.length; i++) {
        if (
          Snake_cells[i].x === snake_row &&
          Snake_cells[i].y === snake_column
        ) {
          EndScreen("BODY");
          return;
        }
      }
    }
  }
}

function EndScreen(cause) {
  inHomeScreen = false;
  inEndScreen = true;
  Running = false;
  EndScore = document.getElementById("EndScore");
  EndScore.innerHTML =
    "<br>" +
    "<text class='header' style='color: aliceblue;'>" +
    DEATH_MESSAGES.get(cause) +
    "</text>" +
    "<text class='header' style='color: aliceblue;'>cause: " +
    "<span style='color: red;'>" +
    cause +
    "</span>" +
    "</text>";
  EndScore.innerHTML +=
    "<br>" +
    "<text class='header' style='color: aliceblue;'>Final Score:" +
    snakeHealth +
    "</text>" +
    "<br>" +
    "<text class='header' style='color: aliceblue; font-size: 13px;'>Timestamp: " +
    new Date().toLocaleString() +
    "</text>" +
    "<br>" +
    "<text class='header' style='color: aliceblue;'>Time Survived: " +
    (gametime / 1000).toFixed(2) +
    "s</text>";
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

function gameLoop(timeStamp) {
  if (Running) {
    if (timeStamp - lasttimerupdate >= 250) {
      updateTimers();
      lasttimerupdate = timeStamp;
    }
    UpdateCanvas();
    if (timeStamp - lastRenderTime > snakemovementrate) {
      let prev_row = snake_row;
      let prev_column = snake_column;
      SnakeMovement();
      let hitwall =
        snake_row < 0 ||
        snake_row >= CANVAS_WIDTH / GRID_WIDTH ||
        snake_column < 0 ||
        snake_column >= CANVAS_HEIGHT / GRID_WIDTH;
      if (hitwall) {
        if (immuneDuration > 0) {
          snake_row = prev_row;
          snake_column = prev_column;
        } else {
          EndScreen("WALL");
          return;
        }
      }
      EatFood();
      if (!hitwall || immuneDuration <= 0) {
        MoveSnake();
      }
      PassObstacles_type1();
      lastRenderTime = timeStamp;
    }
    DrawSnake();
    ObstacleSpawns();
    FoodSpawns();

    PassObstacles_type2();
    UpdateScoreBoard();
    checkdeath();

    requestAnimationFrame(gameLoop);
  }
}
//prettier-ignore
function home() {
  inHomeScreen = true;
  document.getElementById("Canvas").style.setProperty("display", "none");
  document.getElementById("username").value = "";
  document.getElementById("overlay-endscreen").style.setProperty("display", "none");
  document.getElementById("resume-screen-instructions").style.display = "none";
  document.getElementById("Difficulty").style.setProperty("display", "flex");
  document.getElementById("overlay-homescreen").style.setProperty("display", "flex");
  document.getElementById("username-text").style.display = "flex";
  initiate_game_variables();
}
LoadImages();
