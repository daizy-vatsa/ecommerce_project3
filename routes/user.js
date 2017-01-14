//login, usersignin, signup
var router = require('express').Router();
var User = require('../models/user');

router.get('/signup', function(req, res, next) {
  res.render('accounts/signup', {
    errors: req.flash('errors')
  });
});

router.post('/signup', function(req, res, next) {
var user = new User();

  user.profile.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;


  //one of the mongoose method
  User.findOne({ email: req.body.email }, function(err, existingUser) {

    if(existingUser) {
      req.flash('errors', 'Account will that email address already exits');
      return res.redirect('/signup');
    }else {
      user.save(function(err, user) {
        if (err) return next(err);

        return res.redirect('/');

      });
    }
  });
});


module.exports = router;
