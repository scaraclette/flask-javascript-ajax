document.addEventListener('DOMContentLoaded', () => {
    flaskDictionary();
    flaskList();
});

/**
 *  DICTIONARY FLASK MEMORY
 */
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

/**
 *  LIST FLASK MEMORY
 */

function flaskList() {
    // Disable the submit button for #formList by default unless user input has something other than whitespace
    document.querySelector('#submitInput').disabled = true;
    document.querySelector("#userInput1").onkeyup = () => {
        let userInput1 = document.querySelector('#userInput1').value;

        // Remove the spaces to prevent an only whitespace input
        userInput1 = userInput1.replace(/\s+/g, '');

        if (userInput1.length > 0) {
            document.querySelector('#submitInput').disabled = false;
        } else {
            document.querySelector('#submitInput').disabled = true;
        }
    }

    // When the content is loaded, show the list by Ajax request
    requestList();

    // When the list is updated, call the requestList function again
    document.querySelector('#formList').onsubmit = () => {
        requestList();
        return false;
    }

    document.querySelector('#clearList').onsubmit = () => {
        clearList();
        return false;
    }
}


// This function clears the list within the server by calling the Flask method
function clearList() {
    const request = new XMLHttpRequest();
    request.open('POST', '/clear-list');

    request.onload = () => {
        const data = JSON.parse(request.responseText);
        // Clear previous child elements first
        let list1Node = document.getElementById("list1");
        while(list1Node.firstChild) {
            list1Node.removeChild(list1Node.firstChild);
        }
    }

    // const data = new FormData();
    request.send();
}

// This function gets the list from the server and updates its contents
function requestList() {
    // Create a request object and call Flask method
    const request = new XMLHttpRequest();
    request.open('POST', '/list-memory');

    let currentValue = document.querySelector('#userInput1').value;

    request.onload = () => {
        const data = JSON.parse(request.responseText);
        // Call helper function that updates the div 
        appendList(data, "list1");         
    }

    // Add data to send with request. NECESSARY or else Flask will get None value on request.form.get("userInput1")
    const data = new FormData();
    if (currentValue.length !== 0) {
        data.append('userInput1', currentValue);
    }
    request.send(data);
}

/** 
 * The following appendList function is used on both cases
*/
function appendList(objList, elmName) {
    // Clear previous child elements first
    let list1Node = document.getElementById(elmName);
    while(list1Node.firstChild) {
        list1Node.removeChild(list1Node.firstChild);
    }

    objList.forEach(function(obj) {
        let node = document.createElement('li');
        let textNode = document.createTextNode(obj);
        node.append(textNode);
        document.getElementById(elmName).appendChild(node);          
    });
}