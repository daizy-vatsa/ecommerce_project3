//This file will handle
// home, products, cart


// require router
var router = require('express').Router();

//router is sub path of certain route

router.get('/', function(req, res) {
  res.render('main/home');
});

router.get('/about', function(req, res) {
  res.render('main/about');
});


module.exports = router;
