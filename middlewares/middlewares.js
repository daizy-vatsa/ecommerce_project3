var Cart = require('../models/cart');


module.exports = function(req, res, next) {

  if (req.user) {
    var total = 0;
    // findOne is a mongoose function
    Cart.findOne({ owner: req.user._id }, function(err, cart) {
      if (cart) {
        for (var i = 0; i < cart.items.length; i++) {
          // increment by quantity of the product
          total += cart.items[i].quantity;
        }
        res.locals.cart = total;
      } else{
        res.locals.cart = 0;
      }
      next();
    })
  } else {
    next();
  }
}
