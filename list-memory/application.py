import requests, json
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

currentInput = None
listMemory = ["this is an initial item stored in the flask memory"]
channels = {"chn":["channel 1", "channel 2"],"channel 1":["item 1", "item 2"], "channel 2":["item a", "item b"]}

@app.route("/")
def index():
    print("initial memory", listMemory)
    return render_template("index.html")

@app.route("/list-memory", methods=["POST"])
def list_memory():
    global listMemory

    addItem = request.form.get("userInput1")

    if addItem is not None:
        addItem = addItem.strip()
        listMemory.append(addItem)
    
    # When returning a List object through Flask, use the Jsonify method
    return jsonify(listMemory)

# This endpoint clears the listMemory
@app.route("/clear-list", methods=["POST", "GET"])
def clear_list():
    global listMemory

    listMemory.clear()
    return jsonify(listMemory)


    