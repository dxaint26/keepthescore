const User = require('../models/user.model');

module.exports.requireAuth = function(req, res, next) {
  console.log(req.cookies);
  if (!req.cookies.userId) {
    res.redirect('/auth/login');
    return;
  }

  const user = User.find({
    _id: req.cookies.userId
  });

  if (!user) {
    res.redirect('/auth/login');
    return;
  }
  next();
};