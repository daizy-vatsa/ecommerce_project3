//require libraries first
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
//declare mongoose Schema
var Schema = mongoose.Schema;

// The user schema attributes / characteristics / fields

var UserSchema = new Schema({
  email: { type: String, unique: true, lowecase:true},
  password: String,

  profile: {
    name: { type: String, default: ''},
    picture: { type: String, default: ''}
  },

  address: String,
  history: [{
    paid: { type: Number, default: 0},
    item: { type: Schema.Types.ObjectId, ref: 'Product'}
  }]
});

// Hash the password before we even save it in the database
//.pre save it before we actually save it

UserSchema.pre('save', function(next) {
  // make a varibale and this refer to usre schema
  var user = this;
  if (!user.isModified('password')) return next();
  //if user not modifies
  //salt is just the random data created with saltgen
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);
    // function(err, hash) - passing anonymous function
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      // if error return a callback
      if (err) return next(err);
      user.password = hash;
      // run callback when whole method is done
      next();
    });
  });
});

//  compare password in the database and the one that user typed in

//create a custom method
//can create a custom like methods, but we have remenber it every time. Pre is mongoose methid

UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

//for profile avatar
UserSchema.methods.gravatar = function(size) {
  if (!this.size) size = 200;
  // API for following website
  if (!this.email) return 'https://gravatar.com/avatar/?s' + size + '&d=retro';
  // md5 for uniqueness of the particular person
  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
}


module.exports = mongoose.model('User', UserSchema);
