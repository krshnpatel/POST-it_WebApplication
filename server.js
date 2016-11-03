// server.js

// BASE SETUP
// =============================================================================


// Call the packages we need
var express = require('express'); // Call express
var app = express(); // Define our app using express
var bodyParser = require('body-parser');

// Configure app to use bodyParser()
// This will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // Set our port

// Connecting to MongoDB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/msgs');

// Adding msg.js
var Msg = require('./app/models/msg');


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // Get an instance of the Express Router


// Middleware to use for all requests
router.use(function(req, res, next) {
    // Do logging
    console.log('Something is happening.');
    next(); // Make sure we go to the next routes and don't stop here
});


// Test route to make sure everything is working (accessed at GET https://se3316a-lab3-kpate222.c9users.io/api)
router.get('/', function(req, res) {
    res.json({ message: 'Hooray! Welcome to our API!'});
});


// More routes for our API will happen here

// On routes that end in /msgs
// ---------------------------------------------
router.route('/msgs')
    
    // Create a msg (accessed at POST https://se3316a-lab3-kpate222.c9users.io/api/msgs)
    .post(function(req, res) {
        
        var msg = new Msg(); // Create a new instance of the Msg model
        msg.name = req.body.name; // Set the msg's name (comes from the request)
        
        // Save the msg and check for errors
        msg.save(function(err) {
            if (err)
            {
                res.send(err);
            }
                
            res.json({ message: 'Msg created!' });
        });
    })
    
    // Get all the msgs (accessed at GET https://se3316a-lab3-kpate222.c9users.io/api/msgs)
    .get(function(req, res) {
        Msg.find(function(err, msgs) {
            if (err)
            {
                res.send(err);
            }
            
            res.json(msgs);
        });
    });
    
// On routes that end in /msgs/:msg_id
// ---------------------------------------------
router.route('/msgs/:msg_id')

    // Get the msg with the specified id (accessed at GET https://se3316a-lab3-kpate222.c9users.io/api/msgs/:msg_id)
    .get(function(req, res) {
        Msg.findById(req.params.msg_id, function(err, msg) {
            if (err)
            {
                res.send(err);
            }
                
            res.json(msg);
        });
    })
    
    // Update the msg with the specified id (accessed at PUT https://se3316a-lab3-kpate222.c9users.io/api/msgs/:msg_id)
    .put(function(req, res) {

        // Use our msg model to find the msg we want
        Msg.findById(req.params.msg_id, function(err, msg) {

            if (err)
            {
                res.send(err);
            }
            
            msg.name = req.body.name;  // Update the msg's info

            // Save the msg
            msg.save(function(err) {
                if (err) 
                {
                    res.send(err);
                }

                res.json({ message: 'Msg updated!' });
            });
        });
    })
    
    // Delete the msg with this id (accessed at DELETE https://se3316a-lab3-kpate222.c9users.io/api/msgs/:msg_id)
    .delete(function(req, res) {
        Msg.remove({
            _id: req.params.msg_id
        }, function(err, msg) {
            if (err) 
            {
                res.send(err);
            }

            res.json({ message: 'Successfully deleted' });
        });
    });
    

// REGISTER OUR ROUTES -------------------------
// All of our routes will be prefixed with /api
app.use('/api', router);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);



