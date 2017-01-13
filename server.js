//EXPRESS is a library
var express = require('express');

//require few libraries to log all the request from the user
var morgan = require('morgan');

//require mongoose library
var mongoose = require('mongoose');

//require bodyparser
var bodyParser = require('body-parser');

//require ejs
var ejs = require('ejs');
var engine = require('ejs-mate');

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

//now knows that is for static files
app.use(express.static(__dirname + '/public'));
//add a middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//another middleware to use ejs
//engine means what kind of engine you want to use
//set means what engine you want to set in
app.engine('ejs', engine);
app.set('view engine', 'ejs');

// requiring main route
var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');

app.use(mainRoutes);
app.use(userRoutes);
//run the server
//adds validation to the server

//callback function to run app smoothly
app.listen(3000, function(err) {
  if (err) throw err;
  console.log("Server is Running on port 3000")
});
