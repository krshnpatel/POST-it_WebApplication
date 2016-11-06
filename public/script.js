function executeGET()
{
    $.get("https://se3316a-lab3-kpate222.c9users.io/api/msgs", function(data, status) {
        console.log(data);
        displayMessages(data);
        //executeDELETEall(data);
    });
}

function executePOST(userText)
{
    $.post("https://se3316a-lab3-kpate222.c9users.io/api/msgs",
    {
        key: userText.substring(1)
    },
    executeGET());
}

function displayMessages(msgs)
{
    for (let i = 0; i < msgs.length; i++)
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
    if (userText.charAt(0) == '#')
    {
        // Also check for userText inside database; if it exists then delete old one and add again
        console.log("Good");
        return true;
    }
    else
    {
        console.log("Start with a #");
        return false;
    }
}

$(document).ready(function() {
    
    executeGET();
    
    $('#submitButton').click(function(e) {
        if (verifyMessage($('#userText').val()))
        {
            executePOST($('#userText').val());
        }
    });
    
    $('#userText').bind("enterKey",function(e) {
        
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