# Project Description

## A Snake Stack

**Description**

A browser-based Snake game with a full three-layer architecture: a JavaScript frontend that the player interacts with, and a Bash administration script for inspecting and managing stored data from the terminal.

Each layer has a single, well-defined responsibility and must not reach into the concerns of
another layer. JavaScript does not know how scores are saved. The Bash script does not know
how the game works. Flask sits in between and connects them.

### Layer 1 (Frontend - JavaScript + HTML5 Canvas)

The frontend is a single HTML file served by Flask. It is responsible for the entire game
experience and for reporting results when the game ends.

- Utilises a HTML5 Canvas element for the actual game window.
- Snake controlled by arrow keys or WASD.
- Food appears at random empty cells when the snake eats food.
- Different food types with different functions.

When the game ends, the frontend automatically sends the final score to the Flask server
using the fetch API. This happens without refreshing or navigating away from the page. The
request will be a POST to `/save_score` with a JSON body, for example:

```json
{ "name": "Steve", "score": 68, "cause": "BODY", "duration": 41 }
```

## Design Plan

- **Foodtypes**:
  |**Food** | **Health**|**Special Attributes**|
  |-----------------------|--------|------------------|
  |**Carrot** | 1 | NA|
  |**Apple** | 1 | NA|  
  |**Pumpkin Pie** | 3 |NA|
  |**Golden Carrot** | 2 |Gives invincibity for 5 seconds|
  |**Golden Apple** | 2 |Gives invincibity for 7 seconds|
  |**Rotten Flesh** | -1 |Gives Poison Effect reduces health by 1 every 1 second for 1 seconds|
  |**Enchanted Golden Apple** | 4 |Gives invincibility for 10 seconds|

- **Obstacles**:
  - **Bedrock**: Random grids inside the arena behave as a wall i.e. if the player makes contact with these grids when not invincible the game ends.
  - **Magma block**: Whenever a player passes through a grid containing this block, health reduces by a single unit every 3 frames of the game for 5 seconds.
  - **Soul Sand**: Slows down the player to 0.8 times the default speed.
  - **Blue Ice**: Speeds up the player to 1.25 times the default speed.

- **Scoreboard**:
  Display a scoreboard showing the health of the player which is equivalent to the length of the snake.

- **Simple Animations**:
  Implement simple animations using CSS.

## Implementation Plan (Frontend)

The Frontend of the game's logic is managed by Javascript.

**File Structure**

```.
├── admin.sh
├── app.py
├── assets
├── history.txt
├── README.md
└── static
    ├── index.html
    ├── logic.js
    └── styles.css
```

- `static/logic.js` handles all the logic for the frontend.
- `static/index.html` handles all the embedded elements in the game.
- `static/styles.css` handles all the styling.

All the images required for the game are stored in the `assets/` folder.

# Installation

To be able to run this project on your local machine, you must run the following commands on your terminal.

```bash
git clone https://github.com/Secreton456/A-Snake-Stack
cd A-Snake-Stack/
python3 -m venv .venv
source venv/bin/activate
pip install -r requirements.txt
```
