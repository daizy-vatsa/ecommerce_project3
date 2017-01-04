//EXPRESS is a library
var express = require('express');

//app is referring an express object
var app = express();

//run the server
//adds validation to the server

//callback function to run app smoothly
app.listen(3000, function(err) {
  if (err) throw err;
  console.log("Server is Running on port 3000")
});
