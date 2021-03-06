import requests, json
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

currentInput = ""

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
    if input1 is not None:
        currentInput = input1.split()
        print(type(currentInput)) 
        # Since this method does not rely on JavaScript, Python will handle the case of user submitting whitespace
        if len(currentInput) == 0:
            currentInput = "no input submitted"
        return render_template("input1.html", message=currentInput) 

    print(type(input1))   

    # If input1 has no value, renders a page with message
    return render_template("input1.html", message="no input submitted")


    