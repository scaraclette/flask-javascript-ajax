import requests, json
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

# Variables stored in Flask memory
currentInput = ""
listMemory = ["this is an initial item stored in the flask memory"]
channels = {"chn":["channel 1", "channel 2"],"channel 1":["item 1", "item 2"], "channel 2":["item a", "item b"]}

@app.route("/")
def index():
    return render_template("index.html")

# **************************** CALL FLASK FUNCTION ************************************

# Call Flask Function -> endpoint that uses the magic of rendering template.
@app.route("/call-function", methods=["POST", "GET"])
def call_function():
    # Make the currentInput global function to store the value in Flask memory
    global currentInput

    # To get the user input, Flask requests the input field from the HTML's name attribute. A past mistake I've done was using an id attribute instead of a name attribue.
    # Request.form.get returns None if the methods are not specified. 
    input1 = request.form.get("userInput")  
    if input1 is not None:
        currentInput = input1.split()
        # Since this method does not rely on JavaScript, Python will handle the case of user submitting whitespace
        if len(currentInput) == 0:
            currentInput = "no input submitted"
        return render_template("input1.html", message=currentInput) 

    # If input1 has no value, renders a page with message
    return render_template("input1.html", message="no input submitted")


# **************************** LIST FLASK MEMORY ************************************

@app.route("/list-memory", methods=["POST"])
def list_memory():
    global listMemory

    addItem = request.form.get("userInput1")
    print("current addItem:", addItem)

    if addItem is not None:
        listMemory.append(addItem)
    
    # When returning a List object through Flask, use the Jsonify method
    return jsonify(listMemory)

# This endpoint clears the listMemory
@app.route("/clear-list", methods=["POST", "GET"])
def clear_list():
    global listMemory

    listMemory.clear()
    return jsonify(listMemory)


# **************************** DICTIONARY FLASK MEMORY ************************************

# This endpoint updates and sends the current channels dictionary
@app.route("/dict-memory", methods=["POST"])
def dict_memory():
    global channels

    # Data received: channelInput, channelItem
    channelInput = request.form.get('channelInput')
    channelItem = request.form.get('channelItem')

    if (channelInput is not None and channelItem is not None):
        channelInput = channelInput.strip()
        channelItem = channelItem.strip()
        # Channel already exists
        if channelInput in channels:
            channels[channelInput].append(channelItem)
        else:
            channels.update({channelInput:[channelItem]})
            # Channel name needs to be added in value for chn since it's the way for JavaScript to dynamically show the channel names
            channels["chn"].append(channelInput)
            print("CHANNEL ADDED")
    
    return jsonify(channels)


    