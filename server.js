//EXPRESS is a library
var express = require('express');

//require few libraries to log all the request from the user
var morgan = require('morgan');

//require mongoose library
var mongoose = require('mongoose');

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
app.use(morgan('dev'))

// route
app.get('/', function(req, res){
  var name = "Tanu";
  res.json("My name is " + name);
});

app.get('/catname', function (req, res) {
  res.json('batman');
})
//run the server
//adds validation to the server

//callback function to run app smoothly
app.listen(3000, function(err) {
  if (err) throw err;
  console.log("Server is Running on port 3000")
});
