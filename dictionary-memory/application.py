import requests, json
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

currentInput = None
listMemory = ["this is an initial item stored in the flask memory"]
channels = {"chn":["channel 1", "channel 2"],"channel 1":["item 1", "item 2"], "channel 2":["item a", "item b"]}

@app.route("/")
def index():
    return render_template("index.html")

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
    