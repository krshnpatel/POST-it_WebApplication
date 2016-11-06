function executeGET(call)
{
    $.ajax({
        url: 'https://se3316a-lab3-kpate222.c9users.io/api/msgs',
        type: 'GET',
        complete: function(result) {
            var data = JSON.parse(result.responseText);
            console.log("GET");
            console.log(data.length);
            
            if (call == "first")
            {
                displayMessages(data, "append");
            }
            else
            {
                deleteAllElements();
                displayMessages(data, "append");
            }
            
            //executeDELETEall(data);
            setTimeout(executeGET, 1000);
        }
    });
}

function executePOST(userText, afterDelete)
{
    $.ajax({
        url : "https://se3316a-lab3-kpate222.c9users.io/api/msgs",
        type: "POST",
        data: {key:userText.substring(1)},
        complete: function(result)
        {
            var data = JSON.parse(result.responseText);
            
            console.log("POST");
            console.log(data);
            
            deleteAllElements();
            displayMessages(data, "append");
        },
    });
}

function executeDELETE(msgID)
{
    console.log(msgID);
    var URL = 'https://se3316a-lab3-kpate222.c9users.io/api/msgs/' + msgID;
    
    $.ajax({
        url: URL.toString(),
        type: 'DELETE',
        complete: function(result) {
            console.log("DELETE");
            console.log(JSON.parse(result.responseText));
        }
    });
}

function getMsgId(key)
{
    $.ajax({
        url: 'https://se3316a-lab3-kpate222.c9users.io/api/msgs',
        type: 'GET',
        complete: function(result) {
            
            var data = JSON.parse(result.responseText);
            
            for (var i = 0; i < data.length; i++)
            {
                if (data[i].key == key)
                {
                    console.log("get id - " + data[i]._id);
                    executeDELETE(data[i]._id);
                }
            }
        }
    });
}

function displayMessages(msgs, sortMethod)
{
    var endpoint = 0;
    if (msgs.length > 20)
    {
        endpoint = msgs.length - 20;
    }
    
    console.log(endpoint);
    
    for (var i = msgs.length - 1; i >= endpoint; i--)
    {
        if (!document.body.contains(document.getElementById(msgs[i].key)))
        {
            var newMsg = document.createElement('div');
            
            newMsg.id = msgs[i].key;
            newMsg.className = 'text-center submittedText';
            newMsg.textContent = "#" + msgs[i].key;
            
            console.log("adding element");
            
            if (sortMethod == "append")
            {
                document.getElementById('messages').appendChild(newMsg);
            }
            else if (sortMethod == "insert")
            {
                document.getElementById('messages').insertBefore(newMsg, document.getElementById('messages').childNodes.item(0));
            }
        }
    }
}

function deleteAllElements()
{
    var messages = document.getElementById('messages');
    
    while (messages.firstChild)
    {
        messages.removeChild(messages.firstChild);
    }
}

function verifyMessage(userText) {
    if (userText.charAt(0) == '#' && (userText.length > 1 && userText.length <= 200))
    {
        if (document.body.contains(document.getElementById(userText.substring(1))))
        {
            getMsgId(userText.substring(1));
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
    
    $('#submitButton').click(function(e) {
        var userText = $('#userText').val();
        
        if (verifyMessage(userText))
        {
            executePOST(userText, false);
        }
        
        $('#userText').val("");
    });
    
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

function executeDELETEall(msgs) {
    
    for (var i = 0; i < msgs.length; i++)
    {
        $.ajax({
            url: 'https://se3316a-lab3-kpate222.c9users.io/api/msgs/' + msgs[i]._id,
            type: 'DELETE',
            success: function(result) {
                console.log("deleted");
            }
        });
    }
}