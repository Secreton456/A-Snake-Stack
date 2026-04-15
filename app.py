from flask import Flask, request, send_from_directory

app = Flask(__name__)

if __name__ == "__main__":
    app.run(debug=True)


@app.route("/")
def serve_index():
    return send_from_directory("static", "index.html")
