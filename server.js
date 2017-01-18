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

//expressjs uses cookie to store a session id
var session =  require('express-session');
var cookieParser =  require('cookie-parser');
var flash =  require('express-flash');
//require mongo connect
// MongoStore is specifically to store sessions on server-side
var MongoStore = require('connect-mongo/es5')(session);
// require passport library
var passport = require('passport');

//require secret.js
var secret = require('./config/secret');

//require User modal

var User = require('./models/user');

//require category schema

var Category = require('./models/category');

//require middleware from middleware folder
var cartLength = require('./middlewares/middlewares');

//app is referring an express object
var app = express();

//connect mongoose to the database
mongoose.connect(secret.database, function(err) {
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
//it force session to be save
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secret.secretKey,
  store: new MongoStore({ url: secret.database, autoReconnect: true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

//middlewares for middlware folder
app.use(cartLength);
//middleware for categories to find all the categories

app.use(function(req, res, next) {
  Category.find({}, function(err, categories) {
    if (err) return next(err);
    res.locals.categories = categories;
    next();
  });
});

//flash is dependent on session and cookie because
//we want to save the flash message in the session
//so that it can be use in amother request route

//another middleware to use ejs
//engine means what kind of engine you want to use
//set means what engine you want to set in
app.engine('ejs', engine);
app.set('view engine', 'ejs');

// requiring main route
var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
var adminRoutes = require('./routes/admin');
var apiRoutes = require('./api/api');

app.use(mainRoutes);
app.use(userRoutes);
app.use(adminRoutes);
app.use('/api', apiRoutes);
//run the server
//adds validation to the server

//callback function to run app smoothly
app.listen(secret.port, function(err) {
  if (err) throw err;
  console.log("Server is Running on port " + secret.port);
});
