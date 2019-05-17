document.addEventListener('DOMContentLoaded', () => {
    flaskDictionary()
});

function flaskDictionary() {
    
    // TODO: The following disables the submit button unless both fields have user input AND they are not only whitespaces. Initially the submit button for channel form is set to disabled
    document.querySelector('#channelSubmit').disabled = true;
    disableButton('#channelItem');
    disableButton('#channelInput');

    // Call an initial request to get the contents from the server
    dictRequest();

    // Call the request again when server is updated
    document.querySelector('#channel').onsubmit = () => {
        dictRequest();
        return false;
    }

}

// Function that disables a specific button. The id is the USER INPUT and not the button's id
function disableButton(id) {
    document.querySelector(id).onkeyup = () => {

        let channelInput = document.querySelector('#channelInput').value;
        let channelItem = document.querySelector('#channelItem').value;

        // Remove the spaces to prevent an only whitespace input
        channelInput = channelInput.replace(/\s+/g, '');
        channelItem = channelItem.replace(/\s+/g, '');

        console.log("is enabled: " + (channelInput.length > 0 && channelItem.length > 0))
        if (channelInput.length > 0 && channelItem.length > 0) {
            document.querySelector('#channelSubmit').disabled = false;
        } else {
            document.querySelector('#channelSubmit').disabled = true;
        }
    }

}

// Function that handles the Ajax request
function dictRequest() {
    let channelInput = document.querySelector('#channelInput').value;
    let channelItem = document.querySelector('#channelItem').value;

    const request = new XMLHttpRequest();
    request.open('POST', '/dict-memory');
    
    request.onload = () => {
        const data = JSON.parse(request.responseText);

        //Extract channel names as chn
        var channelNames = data["chn"];
        // Show the channel by using 'btn' on submit. The function accepts a array of object and the HTML id. The HTML element gets updated dynamically.
        showChannels(channelNames, "channels");
        showChannels(channelNames, "channelNames");
        
        document.querySelector('#showChannel').onsubmit = () => {
            // When showChannel is submitted, display the contents in "#items" list. Extract the channel name from '#channelNames'.
            console.log("si")
            let chn = document.querySelector('#channelNames').value;
            let items = data[chn]

            // Call the function appendList that updates the dynamically
            appendList(items, "items")

            // Return false to prevent form from submitting
            return false;
        }
    }

    // Send the data to server
    const data = new FormData();
    if (channel.length !== 0 && channelItem.length !== 0) {
        data.append('channelInput', channelInput);
        data.append('channelItem', channelItem);
    }
    request.send(data);

    return false;
}

// The following function dynamically shows the list of channels stored from the server
function showChannels(objList, elmName) {
    // Clear previous child elements if content is updated
    let channelsNode = document.getElementById(elmName);
    while (channelsNode.firstChild) {
        channelsNode.removeChild(channelsNode.firstChild);
    }

    objList.forEach(function(obj) {
        let node = document.createElement('option');
        let textNode = document.createTextNode(obj);
        node.append(textNode);
        node.setAttribute("value", obj);
        document.getElementById(elmName).appendChild(node);
    });
}

// Although it's possible to integrate the following function with the showChannels function, 
//I separated the two to show how updating a list does not need to specify value
function appendList(objList, elmName) {
    // Clear previous child elements if content is updated
    let listNode = document.getElementById(elmName);
    while(listNode.firstChild) {
        listNode.removeChild(listNode.firstChild);
    }

    objList.forEach(function(obj) {
        let node = document.createElement('li');
        let textNode = document.createTextNode(obj);
        node.append(textNode);
        document.getElementById(elmName).appendChild(node);
    });
}