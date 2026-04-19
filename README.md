# Project Description

## A Snake Stack

### Description

A browser-based Snake game with a full three-layer architecture: a JavaScript frontend that the player interacts with, and a Bash administration script for inspecting and managing stored data from the terminal.

Each layer has a single, well-defined responsibility and does not reach into the concerns of
another layer. JavaScript does not know how scores are saved. The Bash script does not know
how the game works. Flask sits in between and connects them.

### Installation and Running

Run the following commands in your terminal if you have Python 3.10.x installed.
In case you do not have Python 3.10 installed, install it first before running these commands.

```bash
git clone https://github.com/Secreton456/A-Snake-Stack.git A_Snake_Stack
cd A_Snake_Stack
python3.10 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python3 app.py
```

Now open your browser and head over to http://127.0.0.1:5000/

You can now play the game on your browser now.

### Administration

In the root directory of this project open a terminal and run

```bash
bash admin.sh
```

Once you enter the above command, you will be asked to enter the username of the player you want to search for.

you can exit the administration by prompting `exit`.

### Format of Logs

All the log files are stored in `history.txt` in root directory.

Each log file is store in the format

`Date and time of Death|Username|Score|Cause of Death|Time survived`

For example

`16/04/2026, 20:54:28|Lokesh|0|ZERO_HEALTH|2.50s`
