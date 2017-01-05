//EXPRESS is a library
var express = require('express');

//require few libraries to log all the request from the user
var morgan = require('morgan');

//require mongoose library
var mongoose = require('mongoose');

//require bodyparser
var bodyParser = require('body-parser');

//require User modal

var User = require('./models/user');

//app is referring an express object
var app = express();

//connect mongoose to the database
mongoose.connect('mongodb://root:abc123@ds151108.mlab.com:51108/ecommerce', function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to the database");
  }
});

//add a middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/create-user', function(req, res) {
  var user = new User();

  user.profile.name = req.body.name;
  user.password = req.body.password;
  user.email = req.body.email;

  user.save(function(err) {
    if (err) next(err);

    res.json('Successfully created a new user')

  });

});


//run the server
//adds validation to the server

//callback function to run app smoothly
app.listen(3000, function(err) {
  if (err) throw err;
  console.log("Server is Running on port 3000")
});
