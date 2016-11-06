function executeGET()
{
    $.get("https://se3316a-lab3-kpate222.c9users.io/api/msgs", function(data, status) {
        console.log(data);
        //executeDELETEall(data);
        displayMessages(data);
        //setTimeout(executeGET(), 1000);
    });
}

function executePOST(userText)
{
    $.post("https://se3316a-lab3-kpate222.c9users.io/api/msgs",
    {
        key: userText.substring(1)
    });
}

function executeDELETE(msg_id)
{
    $.ajax({
        url: 'https://se3316a-lab3-kpate222.c9users.io/api/msgs/' + msg_id,
        type: 'DELETE',
        success: function(result) {
            console.log(result);
        }
    });
}

function getMsgId(key)
{
    $.get("https://se3316a-lab3-kpate222.c9users.io/api/msgs", function(data, status) {
        
        for (let i = 0; i < data.length; i++)
        {
            if (data[i].key == key)
            {
                return data[i]._id;
            }
        }
        
    });
}

function displayMessages(msgs)
{
    var endpoint = 0;
    if (msgs.length > 20)
    {
        endpoint = msgs.length - 20;
    }
    
    for (let i = msgs.length - 1; i >= endpoint; i--)
    {
        if (!document.body.contains(document.getElementById(msgs[i].key)))
        {
            var newMsg = document.createElement('div');
            
            newMsg.id = msgs[i].key;
            newMsg.className = 'text-center submittedText';
            newMsg.textContent = "#" + msgs[i].key;
            
            document.getElementById('messages').appendChild(newMsg);
        }
        else
        {
            document.getElementById(msgs[i].key).textContent = "#" + msgs[i].key;
        }
    }
}

function verifyMessage(userText) {
    if (userText.charAt(0) == '#' && (userText.length > 1 && userText.length <= 200))
    {
        // Also check for userText inside database; if it exists then delete old one and add again
        if (document.body.contains(document.getElementById(userText.substring(1))))
        {
            executeDELETE(getMsgId(userText.substring(1)));
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
    
    executeGET();
    
    $('#submitButton').click(function(e) {
        var userText = $('#userText').val();
        
        if (verifyMessage(userText))
        {
            executePOST(userText);
        }
        
        $('#userText').val("");
    });
    
    $('#userText').bind("enterKey",function(e) {
        
        var userText = $('#userText').val();
        
        if (verifyMessage(userText))
        {
            executePOST(userText);
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
    
    for (let i = 0; i < msgs.length; i++)
    {
        $.ajax({
            url: 'https://se3316a-lab3-kpate222.c9users.io/api/msgs/' + msgs[i]._id,
            type: 'DELETE',
            success: function(result) {
                console.log(result);
            }
        });
    }
}