var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CartSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User'},
  //total price of the cart will be stored in total field
  total: { type: Number, default: 0},
    //Array of items
  items: [{
    item: { type: Schema.Types.ObjectId, ref: 'Product'},
    quantity: { type: Number, default: 1},
    price: { type: Number, default: 0},
  }]
});


module.exports = mongoose.model('Cart', CartSchema);
