import requests, json
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

currentInput = None
listMemory = ["test"]

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/call-function", methods=["POST", "GET"])
def call_function():
    # Make the currentInput global function to store the value in Flask memory
    global currentInput

    # To get the user input, Flask requests the input field from the HTML's name attribute. A past mistake I've done was using an id attribute instead of a name attribue.
    # Request.form.get returns None if the methods are not specified. 
    input1 = request.form.get("userInput")  
    print(input1)
    if input1 is not None:
        currentInput = input1
        return render_template("input1.html", message=currentInput)    

    # If input1 has no value, renders a page with message
    return render_template("input1.html", message=currentInput)

@app.route("/list-memory", methods=["POST"])
def list_memory():
    global listMemory

    addItem = request.form.get("userInput1")
    print("current addItem:", addItem)

    if addItem is not None:
        listMemory.append(addItem)
    
    # When returning a List object through Flask, use the Jsonify method
    return jsonify(listMemory)


    