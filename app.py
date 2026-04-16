from flask import Flask, request, send_from_directory
import json
import time

app = Flask(__name__)
history = "history.txt"


def convert_time(time):
    pass


@app.route("/")
def serve_index():
    return send_from_directory("static", "index.html")


@app.route("/save_score", methods=["POST", "GET"])
def get_score():
    data = request.get_json()
    print(data)
    with open(history, "a") as file:
        file.write(
            f'[ {data["timeofDeath"]} | {data["username"]} | {data["score"]} | {data["cause"]} | {data["duration"]}s ]\n'
        )
    return {"message": "received"}


if __name__ == "__main__":
    app.run(debug=True)
