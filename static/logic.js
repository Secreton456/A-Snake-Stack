// ========================== Game Constants ==========================
const canvas = document.getElementById("Canvas");
const ctx = canvas.getContext("2d");
let GRID_WIDTH = 32;
const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 832;
let GAME_FRAME_RATE = 10;
let basemovementrate = 1000 / GAME_FRAME_RATE;
const e = 2.718;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
// ========================== Game Classes ============================

class Food {
  /**
   * The Food class implements various food types in the snake game
   * It has various parameters in its constructor as listed below with description.
   *
   *          @datatype    @var             @description
   * @param   {string}     name             The name of the food type passed as a string.
   * @param   {float}      health           The change in @var snakeHealth after passing through the object.
   * @param   {float}      immunity         @var immuneDuration is set to this value once
   *                                        the player passes through the object.
   * @param   {float}      probability      The relative probability of spawn in a cell of the object.
   *                                        Refer to the {@link FoodSpawns} documentation for more info.
   * @param   {string}     img_src          The relative path of the image source to be used with respect to
   *                                        the project's root directory.
   *
   * @function load_img    @returns {void}  Loads the image source and stores it in a map @var IMAGES for reusability i.e. prevent
   *                                        reloading the source file everytime an object is blitted on the screen.
   *
   * @example FoodItem = new Food("Apple", 1, 0, 0.4, "/static/assets/apple.png")
   * @notice  img_src must be a given as a string containing the relative path of
   *          the image relative to the root directory of the project folder.
   */
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
  /**
   *          @datatype     @var            @description
   * @param   {string}      name            The name of the obstacle passed on as a string.
   * @param   {int}         row             The row number of the obstacle in the grid.
   * @param   {int}         column          The column number of the obstacle in the grid.
   * @param   {string}      img_src         The relative path of the image source to be used with respect to
   *                                        the project's root directory.
   *
   * @function draw             @returns {void}     Draws the obstacle object on the grid at its row, column.
   * @function isActive         @returns {boolean}  Checks if snakeHead is coinciding with the object.
   * @function isPassiveActive  @returns {boolean}  Checks if any cell of the snake coincides with the object.
   * @function effect           @returns {unknown}  Each sub-class has a different effect and the logic is written here.
   *
   */

  constructor(name, row, column) {
    this.name = name;
    this.img_src = IMAGES.get(name);
    this.row = row;
    this.column = column;
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
  /**
   * @constructor refer to {@link Obstacle}
   *
   *         @datatype    @var                  @description
   * @param  {float}      damage_per_frame      Reduction in @var snakeHealth per frame of the game.
   * @param  {float}      time_left             Time left for the object to despawn in milliseconds.
   *
   * @function isActive         inherited from {@link Obstacle.isActive}
   * @function isPassiveActive  always set to false i.e. RottenFlesh is effective only when Active.
   * @function effect           refer to {@link effect}
   */

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

  effect() {
    /**
     *  @returns {void}   sets poisontime to max(poisontime, 5s) i.e. the effect is active for 5s
     *  refer to {@link PassObstaclesOfFirstType} for how it is called
     *  Refer to @var poisontime in {@link updateTimers} for more details
     */
    poisontime = Math.max(poisontime, 5000); //
  }
}

class Lava extends Obstacle {
  /**
   * @constructor refer to {@link Obstacle}
   *
   * @param {float}   time_left Time left for the object to despawn in milliseconds.
   *
   * @function isActive         inherited from {@link Obstacle.isActive}
   * @function isPassiveActive  always set to false i.e. Lava is effective only when Active.
   * @function effect           refer to {@link effect}
   */

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

  effect() {
    /**
     * Calls the {@link EndScreen} function, refer to it for more explanation.
     * refer to {@link PassObstaclesOfFirstType} for how it is called
     */
    EndScreen("LAVA");
  }
}

class Magma extends Obstacle {
  /**
   * @constructor refer to {@link Obstacle}
   *
   *         @datatype    @var                  @description
   * @param  {float}      damage_per_frame      Reduction in @var snakeHealth per frame of the game.
   * @param  {float}      time_left             Time left for the object to despawn in milliseconds.
   *
   * @function isActive         always set to false i.e. Magma is effective only when PassiveActive.
   * @function isPassiveActive  inherited from {@link Obstacle.isPassiveActive}
   * @function effect           refer to {@link effect}
   */

  constructor(name, row, column, damage_per_frame, time_left = 10000) {
    super(name, row, column);
    this.damage_per_frame = damage_per_frame;
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
    /**
     * @returns {float}
     * Reduces the snakeHealth by damage_per_frame everytime its called.
     * refer to {@link PassObstaclesOfFirstType} for how it is called
     */
    snakeHealth -= Math.min(snakeHealth, this.damage_per_frame);
    return snakeHealth;
  }
}

class SoulSand extends Obstacle {
  /**
   * @constructor refer to {@link Obstacle}
   *
   * @param {float} speedbuff     The speed at which snake moves relative to when it was at base game.
   * @param {float} time_left     Time left for the object to despawn in milliseconds.
   *
   * @function isActive         always set to false i.e. SoulSand is effective only when PassiveActive.
   * @function isPassiveActive  inherited from {@link Obstacle.isPassiveActive}
   *
   *
   * Refer to {@link PassObstaclesOfSecondType} for its effects.
   */

  constructor(name, row, column, speedbuff, time_left = 10000) {
    super(name, row, column);
    this.speedbuff = speedbuff;
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
  /**
   * @constructor refer to {@link Obstacle}
   *
   * @param {float} speedbuff     The speed at which snake moves relative to when it was at base game.
   * @param {float} time_left     Time left for the object to despawn in milliseconds.
   *
   * @function isActive         always set to false i.e. BlueIce is effective only when PassiveActive.
   * @function isPassiveActive  inherited from {@link Obstacle.isPassiveActive}
   *
   *
   * Refer to {@link PassObstaclesOfSecondType} for its effects.
   */

  constructor(name, row, column, speedbuff, time_left = 10000) {
    super(name, row, column);
    this.speedbuff = speedbuff;
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

// =====================================================================

// prettier-ignore
const FOOD_ITEMS = new Map([
  /**
   * Stores all the food items for quick lookup instead of creating a new Object
   * Refer to {@link FoodSpawns} for more details on how this is used.
   * [NAME, new Food(NAME, HEALTH, IMMUNITY(in ms), RELATIVE PROBABILITY, IMAGE SOURCE)]
   */
  ["APPLE", new Food("APPLE", 1, 0, 0.4, "/static/assets/apple.png")],
  ["CARROT", new Food("CARROT", 1, 0, 0.3, "/static/assets/carrot.png")],
  ["PUMPKIN_PIE", new Food("PUMPKIN_PIE", 4, 0, 0.18, "/static/assets/pumpkin_pie.png")],
  ["GOLDEN_CARROT",new Food("GOLDEN_CARROT", 5, 5000, 0.09, "/static/assets/golden_carrot.png")],
  ["GOLDEN_APPLE",new Food("GOLDEN_APPLE", 5, 7000, 0.029, "/static/assets/golden_apple.png")],
  ["ENCHANTED_APPLE",new Food("ENCHANTED_APPLE",10,10000,0.001,"/static/assets/enchanted_apple.png")],
]);

const OBSTACLE_ITEMS = new Map([
  /**
   * Stores the relative probability of spawns of all the obstacles.
   * Refer to {@link ObstacleSpawns} for more details on how this is used.
   * [Name, RELATIVE_PROBABILITY]
   */
  ["LAVA", 0.1],
  ["MAGMA", 0.1],
  ["ROTTEN_FLESH", 0.1],
  ["SOUL_SAND", 0.1],
  ["BLUE_ICE", 0.1],
]);

/** All the IMAGES from assets folder load and get stored here after @function LoadImages() just after the webpage loads.*/
const IMAGES = new Map();

/**  A  map of the death messages displayed after the game is over. Refer to @function EndScreen(). */
const DEATH_MESSAGES = new Map([
  ["WALL", "Ouch, theres a wall for a reason man!"],
  ["BODY", "Ah! Having a long body has its own problems</text>"],
  ["LAVA", "Ah! Lava is hot, who knew?"],
  ["ZERO_HEALTH", "I feel so weak, I just died of zero health!"],
]);

// ========================== Game Variables ==========================

let Running = false; // True when the game is being played and false in homescreen, resumescreen and endscreen
let Begin = true; // True when the game has to begin i.e. endscreen, homescreen but not the rest

let inEndScreen = false; // True when in EndScreen
let inHomeScreen = true; // True when in HomeScreen

/**
 * Sets to the difficulty of the game through userinput.
 * Current Difficulties available "EASY", "HARD".
 */
let Difficulty = "NONE";
let username = "";
let showRules = false; // Displays rules section when set to true in homescreen.
let currentHighScore = 0;
let GlobalHighscore = 0;
let bestplayer = NaN;

async function initHighscore() {
  const init_response = await updateHighScore();
  GlobalHighscore = init_response.highscore;
  bestplayer = init_response.username;
}

/**
 *  @var curDir = 1 implies snake is moving upwards i.e. the last pressed key is W/UpArrow.
 *  @var curDir = 2 implies snake is moving downwards i.e. the last pressed key is S/DownArrow.
 *  @var curDir = 3 implies snake is moving rightwards i.e. the last pressed key is D/RightArrow.
 *  @var curDir = 4 implies snake is moving leftwards i.e. the last pressed key is A/LeftArrow.
 */
let curDir = 1;
let snakeLength = 1;
let snakeHealth = 1;
let inStateOfEating = false; // True when the snake head coincides with a food item.
let immuneDuration = 0; // Time for which the snake will be immune in milliseconds.

// Set the snake spawn to be the center of the grid with a slight offset
let snake_row = Math.floor(CANVAS_WIDTH / (2 * GRID_WIDTH)) - 5;
let snake_column = Math.floor(CANVAS_HEIGHT / (2 * GRID_WIDTH));

// Initialise arrays storing essential items
let Food_cells = []; // [ { x:row, y:column,type: "FOOD_NAME" },... ]
let Obstacle_cells = [];
let Snake_cells = [{ x: snake_row, y: snake_column }]; // [ { x:row, y:column },... ]

// lastRender
let lastRenderTime = 0;
let lasttimerupdate = 0;
let snakemovementrate = basemovementrate;

let poisontime = 0;
let count = 0;
let gametime = 0;

// =====================================================================

function initiate_game_variables() {
  /**
   * @returns {void}
   * Initiates primary game variables to default values whenever called.
   * Called in {@link start} and {@link home}
   */
  curDir = 1;
  snakeLength = 1;
  snakeHealth = 1;
  inStateOfEating = false;
  immuneDuration = 0;
  poisontime = 0;
  count = 0;
  gametime = 0;
  snake_row = Math.floor(CANVAS_WIDTH / (2 * GRID_WIDTH)) - 5;
  snake_column = Math.floor(CANVAS_HEIGHT / (2 * GRID_WIDTH));
  Food_cells = [];
  Snake_cells = [{ x: snake_row, y: snake_column }];
}

function UpdateCanvas() {
  /**
   * Updates the Canvas Including the grid and the background.
   * Called in {@link gameLoop}.
   * The background is drawn on screen along with all the lines everytime the @function gameLoop is run.
   */

  // fills the background
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
  /**
   * Draws Snake cells at required positions with one snakeHead and the rest snakeBody.
   * Called in {@link gameLoop}.
   * Snake cells are drawn on screen along with all the lines everytime the @function gameLoop is run.
   */
  Snake_cells.forEach((snakeCell, index) => {
    if (index === 0) {
      ctx.drawImage(
        IMAGES.get("SNAKE_HEAD"),
        snakeCell.x * GRID_WIDTH,
        snakeCell.y * GRID_WIDTH,
        GRID_WIDTH,
        GRID_WIDTH,
      );
    } else {
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

function FoodSpawns() {
  /**
   * Called in {@link gameLoop}.
   * Every call, an iteration happens over each cell of the grid and over each foodtype store in @var {Map} FOOD_ITEMS
   * and if a random number generated is less than a certain value, a food object spawns.
   *
   * This certain value is inversely proportional to the exponent of already present number food items on the grid.
   * and is proportional to the relative probability of the object as decided in @var {Map} FOOD_ITEMS.
   *
   * No new objects are created but only the cell numbers where the random number exceeds the probability during iteration
   * are appended to @var {array} Food_cells by referring to @var {Map} FOOD_ITEMS.
   *
   * It also ensures that no two food items spawn at the same position,
   * and that food items do not spawn on obstacles or on the snake.
   */
  for (let i = 0; i < CANVAS_WIDTH / GRID_WIDTH; i++)
    for (let j = 0; j < CANVAS_HEIGHT / GRID_WIDTH; j++)
      for (let [food_name, object] of FOOD_ITEMS) {
        //prettier-ignore
        if (Math.random() < (0.5 * object.probability) / (e ** (Food_cells.length ** 1) * 6))
          if(Food_cells.find(cell => (cell.x == i && cell.y == j))===undefined
          && Snake_cells.find(cell => (cell.x == i  && cell.y == j))=== undefined
          && Obstacle_cells.find(cell => (cell.row == i && cell.column == j))===undefined)
            Food_cells[Food_cells.length] = { x: i, y: j, type: food_name };
      }

  // Sorting array based on smaller x value
  Food_cells.sort((a, b) => a.x - b.x);

  // Drawing each of the Food cell present in Food_cells
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
  /**
   * Called in {@link gameLoop}.
   * Every call, an iteration happens over each cell of the grid and over each obstacle and if a
   * random number generated is less than a certain value, a certain obstacle object spawns.
   *
   * This certain value is inversely proportional to the exponent of already present number food items on the grid.
   * and is proportional to the relative probability of the object as decided in @var {Map} OBSTACLE_ITEMS.
   *
   * New objects are created whenever a random number exceeds the probability as decided above for a cell during iteration
   * and are added to @var {array} Obstacle_cells, with @var time_left varying between 5-10s
   *
   * It also ensures that no two obstacles spawn at the same position,
   * and that obstacles do not spawn on food items or on the snake.
   */
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
  /**
   * Called in {@link gameLoop}.
   *
   * iterates over all food items present in @var {array} Food_cells and checks if the snake head is
   * coinciding with the cell.
   *
   * In case a food cell is found it will be spliced off the array @var Food_cells hence will be discontinued from
   * being drawn and performing eat checks any further.
   * Furthermore the @var snakeHealth and @var immuneDuration changes depending on the food type.
   *
   * In the instance of snake head coinciding with a food cell @var inStateOfEating is set to false
   * and the last snakeCell isn't popped off the @var {array} Snake_cells.
   * Refer to {@link DrawSnake}.
   *
   */

  let foundCell = false; // temporary variable to update inStateofEating
  for (let food of Food_cells) {
    if (snake_row == food.x && snake_column == food.y) {
      let index = Food_cells.findIndex(
        (obj) => obj.x == food.x && obj.y == food.y,
      );
      Food_cells.splice(index, 1); // Remove the instance of the food cell coinciding with the snakeHead in the array.
      snakeHealth += FOOD_ITEMS.get(food.type).health;
      snakeLength++;
      immuneDuration = Math.max(
        immuneDuration,
        FOOD_ITEMS.get(food.type).immunity,
      );
      foundCell = true;
    }
  }
  inStateOfEating = foundCell; // update inStateOfEating
}

function PassObstaclesOfFirstType() {
  /**
   * Called in {@link gameLoop}
   *
   * This function handles the logic for 3 specific obstacles of the classes {@link RottenFlesh}, {@link Lava},
   * {@link Magma}, i.e. majorly Obstacles which do not affect the game Frame Rate.
   *
   * iterates over Obstacles in @var Obstacle_cells and checks for instance of the above classes,
   * In case of RottenFlesh, Lava {@link Obstacle.isActive()} is checked and {@link Obstacle.effect()} is called.
   * In case of Magma {@link Obstacle.isPassiveActive()} is checked and {@link Obstacle.effect(snakeHealth)} is called.
   */
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
        if (immuneDuration == 0) {
          obstacle.effect();
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

function PassObstaclesOfSecondType() {
  /**
   * Called in {@link gameLoop}
   * This function handles logic for two specific classes of obstacles {@link SoulSand}
   * {@link BlueIce}, i.e. the obstacles which change the game Frame Rate.
   *
   * @var snakemovementrate is changed accordingly when {@link Obstacle.isPassiveActive()}
   */
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

function UpdateScoreBoard(highscore, bestplayer) {
  /**
   * Called in {@link gameLoop}.
   * Displays the Score of the current user(@var snakeHealth), Immunity duration left(@var immuneDuration).
   * Also displays the overall highscore among all the users present in the server logs. Refer to {@link updateHighScore}
   */
  const ScoreCard = document.getElementById("ScoreBoard");

  ScoreCard.innerHTML = `
  <div class="scoreboard">
    <span class="item">Score: ${snakeHealth.toString().padStart(3, "0")}</span>
    <span class="item immunity">Immunity: ${(immuneDuration / 1000).toFixed(2)}s</span>
    <span class="item">Overall HighScore: ${highscore.toString().padStart(3, "0")}</span>
    <span class="item player">Best Player: ${bestplayer}</span>
  </div>
`;
}

async function updateHighScore() {
  /**
   * Called in {@link EndScreen} i.e. whenever the snake dies.
   * Sends a POST request to the Flask server at /highscore.json with the current game data.
   *
   * Request payload:
   * { highscore: GlobalHighscore, username: username }
   *
   * Awaits and returns a JSON response:
   * { status: status, highscore: GlobalHighscore, username: username }
   *
   * status is either highscore_updated or highscore_unchanged.
   * @var GlobalHighscore and @var bestplayer are respectively updated.
   */

  const url = "http://127.0.0.1:5000/highscore.json";
  const postJson = await fetch(url, {
    method: "POST",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify({
      highscore: GlobalHighscore,
      username: username,
    }),
  });
  const response = await postJson.json();
  console.log(response);
  GlobalHighscore = response.highscore;
  bestplayer = response.username;
  return response;
}

function LoadImages() {
  /**
   * Runs once whenever the webpage loads.
   * Loads all the assets required and stores it in @var {Map} IMAGES as ["name", img] for access.
   */
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
  /**
   * Called in the Event Listener of Difficulty buttons present in homescreen.
   * Eliminates usernames with any special characters to prevent parsing errors in the server.
   * Validates the username if it is non-empty.
   * Displays appropriate error messages for the above two cases.
   * Calls the @function start if username is validated to Start the game.
   */
  username = document.getElementById("username").value;

  // Regular Expression for testing the username, matches for a string containing only a-z, A-Z, 0-9.
  const userPattern = new RegExp("^[a-zA-Z0-9]*$");

  if (!username || username.trim().length == 0) {
    document.getElementById("errormsg").textContent =
      "Username cannot be empty";
    document.getElementById("errormsg").classList.add("show");
  } else if (!userPattern.test(username)) {
    document.getElementById("errormsg").textContent =
      "Username can contain only a-z,A-Z,0-9";
    document.getElementById("errormsg").classList.add("show");
  } else {
    document.getElementById("errormsg").classList.remove("show");
    start();
  }
}

/**
 * Attaches event listeners for the difficulty selection buttons in homescreen.
 * When a button is clicked, difficulty is set accordingly and {@link validateUserName} is called.
 */
document.getElementById("Easy").addEventListener("click", () => {
  Difficulty = "EASY";
  validateUserName();
});
document.getElementById("Difficult").addEventListener("click", () => {
  Difficulty = "HARD";
  validateUserName();
});

/**
 * Attaches event listener to the show rules button on homescreen/resumescreen.
 * Toggles @var showRules on button click to show or hide the rules section.
 */
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
/**
 * Attaches various event listeners to keyboard buttons during various stages of the game
 * WASD/Arrow keys in-game for snake movement.
 */
document.addEventListener("keydown", (event) => {
  if ((event.key == "ArrowUp" || event.key == "w" || event.key == "W") && curDir != 2)
    curDir = 1;
  else if ((event.key == "ArrowDown" || event.key == "s" || event.key == "S") && curDir != 1)
    curDir = 2;
  else if ((event.key == "ArrowRight" || event.key == "d" || event.key == "D") && curDir != 4)
    curDir = 3;
  else if ((event.key == "ArrowLeft" || event.key == "a" || event.key == "A") && curDir != 3)
    curDir = 4;

  // Resumes the game when Enter is pressed during pause.
  else if (event.key == "Enter" && Begin == false) {
    document.getElementById("overlay-homescreen").style.setProperty("display", "none");
    Running = true;
    requestAnimationFrame(gameLoop);
  }
  // Pauses the game when backspace is pressed during gameplay.
  else if (event.key == "Backspace" && inHomeScreen == false) {
    document.getElementById("Difficulty").style.setProperty("display", "none");
    document.getElementById("overlay-homescreen").style.setProperty("display", "flex");
    document.getElementById("username-text").style.display = "none";
    document.getElementById("resume-screen-instructions").style.display = "flex";
    Running = false;
  }

  // Continues the game with same difficulty and username when pressed Enter in EndScreen.
  else if (event.key == "Enter" && inEndScreen == true) {
    start();
    inEndScreen = false;
  }
  // Takes back to homescreen when pressed H in EndScreen.
  else if ((event.key == "H" || event.key == "h") && inEndScreen == true) {
    home();
    inEndScreen = false;
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
  /**
   * Invoked after username validation ({@link validateUserName}) or when Enter is pressed on the end screen.
   * Displays the canvas as a block, and toggles @var inEndScreen or @var inHomeScreen and chooses appropriate GRID_SIZE or
   * GAME_FRAME_RATE based off difficulty
   *
   * Sets @var snakemovementrate to @var basemovementrate and initiates game variables.
   * Set display style of HTML elements of endscreen and homescreen ovaerlays to none.
   */
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
      document.getElementById("overlay-homescreen").style.display = "none";
      document.getElementById("overlay-endscreen").style.display = "none";
      Running = true;
    }
    requestAnimationFrame(gameLoop);

    inHomeScreen = false;
  }
}

function checkdeath() {
  // Triggers snake death when health reaches zero.
  if (snakeHealth <= 0) {
    EndScreen("ZERO_HEALTH");
    return;
  }

  if (immuneDuration == 0) {
    // Collision detection with the wall.
    if (
      snake_row <= -1 ||
      snake_row >= CANVAS_WIDTH / GRID_WIDTH + 1 ||
      snake_column <= -1 ||
      snake_column >= CANVAS_HEIGHT / GRID_WIDTH + 1
    ) {
      EndScreen("WALL");
    }
    // Collision detection with its body.
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
  /**
   * Called whenever the snake dies.
   * Toggles @var inHomeScreen, @var inEndScreen, @var Running.
   * Updates @var currentHighScore to the maximum of its previous value and the current snake health.
   *
   * Displays a humorous death message, the cause of death, the Score of the user, Time the snake survived
   * and the user's personal best.
   */
  inHomeScreen = false;
  inEndScreen = true;
  Running = false;
  currentHighScore = Math.max(currentHighScore, snakeHealth);
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
    "</text>" +
    "<br>" +
    "<text class='header' style='color: aliceblue;'>Time Survived: " +
    (gametime / 1000).toFixed(2) +
    "s</text>" +
    "<text class='header' style='color: aliceblue;'> Personal Best: " +
    currentHighScore.toFixed(1);
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

  /**
   * Sends a POST request to the Flask server at /save_score with the current game data.
   *
   * Request payload:
   * {username: username,score: snakeHealth,cause: cause,timeofDeath: timeofDeath,duration:duration }
   *
   * Awaits a confirmation JSON response
   * { message: received}
   * Then calls {@link updateHighScore()} to update the global highscore.
   */
  fetch("http://127.0.0.1:5000/save_score", {
    method: "POST",
    body: JSON.stringify({
      username: username,
      score: snakeHealth,
      cause: cause,
      timeofDeath: new Date().toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "UTC",
      }),
      duration: (gametime / 1000).toFixed(2),
    }),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((response) => response.json())
    .then((json) => console.log(json))
    .then(() => updateHighScore());
  Begin = true;
}

LoadImages();
initHighscore();

function gameLoop(timeStamp) {
  /**
   *
   */
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
      PassObstaclesOfFirstType();
      lastRenderTime = timeStamp;
    }
    DrawSnake();
    ObstacleSpawns();
    FoodSpawns();

    PassObstaclesOfSecondType();
    UpdateScoreBoard(GlobalHighscore, bestplayer);
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
