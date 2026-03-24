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

## Implementation Plan (Frontend)

The Frontend of the game's logic is managed by Javascript.

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
