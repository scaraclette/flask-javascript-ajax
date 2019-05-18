document.addEventListener('DOMContentLoaded', () => {
    flaskList();
});

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

// Helper function, will integrate to previous
function appendList(objList, elmName) {
    // Clear previous child elements first
    let list1Node = document.getElementById(elmName);
    while(list1Node.firstChild) {
        list1Node.removeChild(list1Node.firstChild);
    }

    objList.forEach(function(obj) {
        console.log("obj is... " + obj)
        let node = document.createElement('li');
        let itemNode = document.createTextNode(obj);
        node.append(itemNode);
        document.getElementById(elmName).appendChild(node);          
    });
}