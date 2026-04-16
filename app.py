from flask import Flask, request, send_from_directory

app = Flask(__name__)


@app.route("/")
def serve_index():
    return send_from_directory("static", "index.html")


@app.route("/save_score", methods=["POST", "GET"])
def get_score():
    data = request.get_json()
    print(data)
    print(type(data))
    return {"message": "received"}


if __name__ == "__main__":
    app.run(debug=True)
