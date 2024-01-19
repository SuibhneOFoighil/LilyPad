from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/python-api/items/knn')
def get_items_knn():
    return "hey!"