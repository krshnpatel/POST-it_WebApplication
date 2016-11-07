// This function executes the HTTP GET request
function executeGET(call)
{
    $.ajax({
        url: 'https://se3316a-lab3-kpate222.c9users.io/api/msgs',
        type: 'GET',
        complete: function(result) {
            var data = JSON.parse(result.responseText);
            
            // If this function is called the first time then only display messages
            if (call == "first")
            {
                displayMessages(data);
            }
            else // Else, delete all elements on the screen and display them again
            {
                deleteAllElements();
                displayMessages(data);
            }
            
            //executeDELETEall(data);  //<-- DO NOT UNCOMMENT THIS LINE, it deletes all the entries from the database
            
            setTimeout(executeGET, 1000); // This calls the executeGET function every second
        }
    });
}

// This function executes the HTTP POST request
function executePOST(userText, afterDelete)
{
    $.ajax({
        url : "https://se3316a-lab3-kpate222.c9users.io/api/msgs",
        type: "POST",
        data: {key:userText.substring(1)}, // Stores the text after the hashtag as the key
        complete: function(result)
        {
            var data = JSON.parse(result.responseText); // Parses data into a JSON array
            
            deleteAllElements();
            displayMessages(data);
        },
    });
}

// This function executes the HTTP DELETE request on a specific message
function executeDELETE(msgID)
{
    var URL = 'https://se3316a-lab3-kpate222.c9users.io/api/msgs/' + msgID;
    
    $.ajax({
        url: URL.toString(),
        type: 'DELETE',
    });
}

// This function creates a DOM element for each message and adds it to the HTML document
function displayMessages(msgs)
{
    var endpoint = 0; // Endpoint is used so only the last 20 elements are displayed
    if (msgs.length > 20)
    {
        endpoint = msgs.length - 20; // Calculates the endpoint
    }
    
    for (var i = msgs.length - 1; i >= endpoint; i--)
    {
        if (!document.body.contains(document.getElementById(msgs[i].key))) // Checks if the specified element exists
        {
            // Creates a new div element
            var newMsg = document.createElement('div');
            
            // Adds an id, classes, and text content to the newly created element
            newMsg.id = msgs[i].key;
            newMsg.className = 'text-center submittedText';
            newMsg.textContent = "#" + msgs[i].key;
            
            // Appends the newly created element to the children of #messages element
            document.getElementById('messages').appendChild(newMsg);
        }
    }
}

// This function deletes all the children of the #messages element
function deleteAllElements()
{
    var messages = document.getElementById('messages');
    
    while (messages.firstChild)
    {
        messages.removeChild(messages.firstChild);
    }
}

// This function GETs the _id of the specified message and DELETEs it
function deleteMsgId(key)
{
    $.ajax({
        url: 'https://se3316a-lab3-kpate222.c9users.io/api/msgs',
        type: 'GET',
        complete: function(result) {
            var data = JSON.parse(result.responseText);
            
            // Find the message _id using its key
            for (var i = 0; i < data.length; i++)
            {
                if (data[i].key == key)
                {
                    executeDELETE(data[i]._id); // Delete the message with its _id
                    break;
                }
            }
        }
    });
}

// This function verifies the user entered text
function verifyMessage(userText)
{
    // Check if the user text starts with a # and has a length no more than 200 characters
    if (userText.charAt(0) == '#' && (userText.length > 1 && userText.length <= 200))
    {
        if (document.body.contains(document.getElementById(userText.substring(1))))
        {
            deleteMsgId(userText.substring(1));
            return true;
        }
        else
        {
            return true;
        }
    }
    else
    {
        alert("Please enter text following a # (max 200 characters)");
        return false;
    }
}

$(document).ready(function() {
    
    executeGET("first");
    
    // If the submit button is clicked then verify the message and POST it
    $('#submitButton').click(function(e) {
        var userText = $('#userText').val();
        
        if (verifyMessage(userText))
        {
            executePOST(userText, false);
        }
        
        $('#userText').val("");
    });
    
    // If the enter key is pressed in the text box then verify the message and POST it
    $('#userText').bind("enterKey",function(e) {
        
        var userText = $('#userText').val();
        
        if (verifyMessage(userText))
        {
            executePOST(userText, false);
        }
        
        $('#userText').val("");
    });
    
    $('#userText').keyup(function(e) {
        if(e.keyCode == 13)
        {
            $(this).trigger("enterKey");
        }
    });
});


// ===================================================================================
// This function is not used unless you want to delete all entries from the database
// This function can be used by uncommenting the line in executeGET function
function executeDELETEall(msgs)
{
    for (var i = 0; i < msgs.length; i++)
    {
        $.ajax({
            url: 'https://se3316a-lab3-kpate222.c9users.io/api/msgs/' + msgs[i]._id,
            type: 'DELETE',
        });
    }
}