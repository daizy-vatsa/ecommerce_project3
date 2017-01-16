//This file will handle
// home, products, cart


// require router
var router = require('express').Router();
var User = require('../models/user');
var Product = require('../models/product');

//This code is to map b/w product database and elastic search replica set
//so that it creates a bridge or a connection
Product.createMapping(function(err, mapping) {
  if (err) {
    console.log("error creating mapping");
    console.log(err);
  } else {
    console.log("Mapping created");
    console.log(mapping);
  }
});


var stream = Product.synchronize();
var count = 0;

//count the data
stream.on('data', function() {
  count++;
});

//close th data, count the entire document

stream.on('close', function() {
  console.log("Indexed " + count + " documents");
});

//show to the user an error

stream.on('error', function(err) {
  console.log(err);
});

//redirect the  user to get route of search url
//go to the search route and dont forget to get the message
//re.body.q. '/search?q="joker"' is equivalent to req.res.q(joker)
router.post('/search', function(req, res, next) {
  res.redirect('/search?q=' + req.body.q);
});

router.get('/search', function(req, res, next) {
  if (req.query.q) {
    Product.search({
      query_string: { query: req.query.q}
    }, function(err, results) {
      results:
      if (err) return next(err);
      var data = results.hits.hits.map(function(hit) {
        return hit;
      });
      res.render('main/search-result', {
        query: req.query.q,
        data: data
      });
    });
  }
});

//router is sub path of certain route

router.get('/', function(req, res) {
  res.render('main/home');
});

router.get('/about', function(req, res) {
  res.render('main/about');
});

//':' dots are used for if we want to go to specific category for eg: foods, gadgets
router.get('/products/:id', function(req, res, next) {
  Product
  .find({ category: req.params.id })
  //populate in querying is used to access our category data
  .populate('category')
  // exec is like saying execute a function on all the methods
  .exec(function(err, products){
    if (err) return next(err);
    res.render('main/category', {
      products: products
    });
  });
});

//router for products
router.get('/product/:id', function(req, res, next) {
  Product.findById({ _id: req.params.id }, function(err, product) {
    if (err) return next(err);
    res.render('main/product', {
      product: product
    });
  });
});

module.exports = router;
