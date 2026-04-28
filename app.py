from flask import Flask, request, send_from_directory
import csv

"""
Initialize the Flask application used to handle API requests
for game data (e.g., scores and user information).
"""
app = Flask(__name__)

history = "history.txt"


"""
Serve `index.html` in the root directory URL(/)
"""
@app.route("/")
def serve_index():
    return send_from_directory("static", "index.html")


"""
Parses incoming JSON data about the session details after the player's death into a dictionary and
logs it to `history.txt` using the format:
'DD/MM/YY, HH:MM:SS | USERNAME | SCORE | CAUSE | TIME_SURVIVED s'. 

Incoming data format:
{username: username,score: snakeHealth,cause: cause,timeofDeath: timeofDeath,duration:duration }

Returns a confirmation message:
{"message": "received"}
"""
@app.route("/save_score", methods=["POST", "GET"])
def get_score():
    data = request.get_json()
    print(data)
    with open(history, "a") as file:
        file.write(
            f'{data["timeofDeath"]}|{data["username"]}|{data["score"]}|{data["cause"]}|{data["duration"]}s\n'
        )
    return {"message": "received"}


"""
Parses incoming JSON data about the session details after the players death when the webpage loads
into a dictionary.

Incoming data format:
{highscore: Globalhighscore, username: username}

Uses a csv reader to parse the log files in `history.txt` and iterate over all logs to find the 
user with the highest score and compare with the received data and returns the updated score in 
a json format.
{status: status, highscore: new highscore, username: username}
"""
@app.route("/highscore.json", methods=["POST", "GET"])
def get_highscore():
    current_highscore = request.get_json()
    print(current_highscore)
    highscore_changed = False
    with open(history, "r") as file:
        csvreader = csv.reader(file, delimiter="|")
        for row in csvreader:
            if float(row[2]) > float(current_highscore["highscore"]):
                current_highscore["highscore"] = row[2]
                current_highscore["username"] = row[1]
                highscore_changed = True

    if highscore_changed:
        return {
            "status": "highscore_updated",
            "highscore": current_highscore["highscore"],
            "username": current_highscore["username"],
        }
    return {
        "status": "highscore_unchanged",
        "highscore": current_highscore["highscore"],
        "username": current_highscore["username"],
    }


if __name__ == "__main__":
    app.run(debug=True)
