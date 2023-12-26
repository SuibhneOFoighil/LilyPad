from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/python", methods=["GET"])
def hello_world():
    return jsonify({"message": "Live from Python!"})

if __name__ == "__main__":
    app.run(debug=True)