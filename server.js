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
mongoose.connect('mongodb://localhost:27017/bears');

// Adding bear.js
var Bear = require('./app/models/bear');


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

// On routes that end in /bears
// ---------------------------------------------
router.route('/bears')
    
    // Create a bear (accessed at POST https://se3316a-lab3-kpate222.c9users.io/api/bears)
    .post(function(req, res) {
        
        var bear = new Bear(); // Create a new instance of the Bear model
        bear.name = req.body.name; // Set the bear's name (comes from the request)
        
        // Save the bear and check for errors
        bear.save(function(err) {
            if (err)
            {
                res.send(err);
            }
                
            res.json({ message: 'Bear created!' });
        });
    })
    
    // Get all the bears (accessed at GET https://se3316a-lab3-kpate222.c9users.io/api/bears)
    .get(function(req, res) {
        Bear.find(function(err, bears) {
            if (err)
            {
                res.send(err);
            }
            
            res.json(bears);
        });
    });
    
// On routes that end in /bears/:bear_id
// ---------------------------------------------
router.route('/bears/:bear_id')

    // Get the bear with the specified id (accessed at GET https://se3316a-lab3-kpate222.c9users.io/api/bears/:bear_id)
    .get(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err)
            {
                res.send(err);
            }
                
            res.json(bear);
        });
    })
    
    // Update the bear with the specified id (accessed at PUT https://se3316a-lab3-kpate222.c9users.io/api/bears/:bear_id)
    .put(function(req, res) {

        // Use our bear model to find the bear we want
        Bear.findById(req.params.bear_id, function(err, bear) {

            if (err)
            {
                res.send(err);
            }
            
            bear.name = req.body.name;  // Update the bear's info

            // Save the bear
            bear.save(function(err) {
                if (err) 
                {
                    res.send(err);
                }

                res.json({ message: 'Bear updated!' });
            });
        });
    })
    
    // Delete the bear with this id (accessed at DELETE https://se3316a-lab3-kpate222.c9users.io/api/bears/:bear_id)
    .delete(function(req, res) {
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear) {
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



