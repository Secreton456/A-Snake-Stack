from flask import Flask, request, send_from_directory
import csv


app = Flask(__name__)
history = "history.txt"


@app.route("/")
def serve_index():
    return send_from_directory("static", "index.html")


@app.route("/save_score", methods=["POST", "GET"])
def get_score():
    data = request.get_json()
    print(data)
    with open(history, "a") as file:
        file.write(
            f'{data["timeofDeath"]}|{data["username"]}|{data["score"]}|{data["cause"]}|{data["duration"]}s\n'
        )
    return {"message": "received"}


@app.route("/highscore.json", methods=["POST", "GET"])
def get_highscore():
    current_highscore = request.get_json()
    print(current_highscore)
    highscore_changed = False
    with open(history, "r") as file:
        csvreader = csv.reader(file, delimiter="|")
        for row in csvreader:
            if float(row[2]) > int(current_highscore["highscore"]):
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
