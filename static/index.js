document.addEventListener('DOMContentLoaded', () => {

    let formList;

    document.querySelector('#formList').onsubmit = () => {
        
        // Create a request object and call Flask method
        const request = new XMLHttpRequest();
        request.open('POST', '/list-memory');

        let currentValue = document.querySelector('#userInput1').value;
        console.log("currentValue: " + currentValue);

        request.onload = () => {
            const data = JSON.parse(request.responseText);
            formList = data;

            // Clear previous child elements first
            let list1Node = document.getElementById("list1");
            while(list1Node.firstChild) {
                list1Node.removeChild(list1Node.firstChild);
            }

            data.forEach(function(obj) {
                let node = document.createElement('li');
                let itemNode = document.createTextNode(obj);
                node.append(itemNode);
                document.getElementById("list1").appendChild(node);          
            });           
        }

        // Add data to send with request. NECESSARY or else Flask will get None value on request.form.get("userInput1")
        const data = new FormData();
        data.append('userInput1', currentValue);
        request.send(data);

        // Returns false to prevent form from submitting, TODO: need further explanation
        return false;
    }
});