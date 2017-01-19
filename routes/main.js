//This file will handle
// home, products, cart


// require router
var router = require('express').Router();
var User = require('../models/user');
var Product = require('../models/product');
var Cart = require('../models/cart');
// REQUIRE STRIPE LIBRARY
var stripe = require('stripe') ('sk_test_gPOq20O01QRUNdQ2X5BBhsH5');
//This code is to map b/w product database and elastic search replica set
//so that it creates a bridge or a connection

//PAGINATION

//added pagination so that we dont need to render
//data at once, it will cause prb to mongodb database

//we use skip
//skip will skip amount of documents

//limit - how many to documents you want per documents
//skip certain docs and always limit 9 documents per query

//used Product.count, want to divide documnets divided by products per page
// CLICK 1 , WE GO TO PAGE 1, CLICK 9 , WE WILL GO TO PAGE 9

function paginate(req, res, next) {

  // declare variable called perPage. it has 9 items per page
  var perPage = 9;
  var page = req.params.page;

  Product
  .find()
  .skip ( perPage * page ) // 9 * 6 = 18
  .limit( perPage )
  .populate('category')
  .exec(function(err, products) {
    if (err) return next(err);
    Product.count().exec(function(err, count) {
    if (err) return next(err);
    res.render('main/product-main', {
      products: products,
      pages: count / perPage
    });
  });
  });

}

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

//close the data, count the entire document

stream.on('close', function() {
  console.log("Indexed " + count + " documents");
});

//show to the user an error

stream.on('error', function(err) {
  console.log(err);
});

// route for cart

router.get('/cart', function(req, res, next) {
  Cart
  .findOne({ owner: req.user._id })
  .populate('items.item')
  .exec(function(err, foundCart) {
    if (err) return next(err);
    res.render('main/cart', {
      foundCart: foundCart,
      message: req.flash('remove')
    });
  });
});


router.post('/product/:product_id', function(req, res, next) {
  // first we find the owner of the cart and if found
  //we will push all the items based on the req.values to the
  // array of items
    Cart.findOne({ owner: req.user._id }, function(err, cart) {
        cart.items.push({
          item: req.body.product_id,
          price: parseFloat(req.body.priceValue),
          quantity: parseInt(req.body.quantity)
        });

        // parse the value of req.body to the float and limit it to 2
        //so that saving to the database wont cause problem
        cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2);

        // finally save it to the cart
        cart.save(function(err) {
          if (err) return next(err);
          return res.redirect('/cart');
        });
      });
   });


//for remove from cart

router.post('/remove', function(req, res, next) {
  Cart.findOne({ owner: req.user._id }, function(err, foundCart) {
    foundCart.items.pull(String(req.body.item));

    foundCart.total = (foundCart.total - parseFloat(req.body.price)).toFixed(2);
    foundCart.save(function(err, found) {
      if (err) return next(err);
      req.flash('remove', 'Successfully removed');
      res.redirect('/cart');
    });
  });
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

router.get('/', function(req, res, next) {

  if (req.user) {
  paginate(req, res, next)
} else {
  res.render('main/home');
}

});

router.get('/page/:page', function(req, res, next) {
  paginate(req,res,next);
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

// route fot stripe payments

router.post('/payment', function(req, res, next) {

  // first we get token from client side
  var stripeToken = req.body.stripeToken;
  // multiply by 100 because stripe is in cents
  var currentCharges = Math.round(req.body.stripeMoney * 100);
  // use stripe mehod to create customers
  stripe.customers.create({
    source: stripeToken,
  }).then(function(customer) {
    return stripe.charges.create({
      amount: 'currentCharges',
      currency: 'usd',
      // we want to passin customer id
      customer: customer.id
    });
  });
});

module.exports = router;
