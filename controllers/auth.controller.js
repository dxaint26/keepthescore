const User = require('../models/user.model');
const md5 = require('md5');

module.exports = {
  signup: (req, res) => {
    res.render('auth/signup');
  },
  postSignup: async (req, res) => {
    let errors = [];
    const email = req.body.email;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;
    const checkEmailExist = await User.find({ email: email });
    if (!email) {
      errors.push('Email is require');
      res.render('auth/signup', {
        errors: errors,
        values: req.body
      })
    } else if (!password) {
      errors.push('Password is require');
      res.render('auth/signup', {
        errors: errors,
        values: req.body
      })
    } else if (!confirmpassword) {
      errors.push('Confirm password is require');
      res.render('auth/signup', {
        errors: errors,
        values: req.body
      })
    } else if (checkEmailExist.length !== 0) {
      errors.push('Email already exists');
      res.render('auth/signup', {
        errors: errors,
        values: req.body
      })
    } else if (password.length < 8) {
      errors.push('Password is 8 characters mininum');
      res.render('auth/signup', {
        errors: errors,
        values: req.body
      })
    } else if (confirmpassword !== password) {
      errors.push('Confirm password incorrect');
      res.render('auth/signup', {
        errors: errors,
        values: req.body
      })
    } else {
      const user = new User({ email: email, password: md5(password) });
      user.save((err) => {
        if (err) return err;
        res.redirect('login');
      });
    }
  },
  login: (req, res) => {
    res.render('auth/login');
  },
  postLogin: async (req, res) => {
    let errors = [];
    if (!req.body.email) {
      errors.push('Email is require');
      res.render('auth/login', {
        errors: errors,
        values: req.body
      })
    }
    if (!req.body.password) {
      errors.push('Password is require');
      res.render('auth/login', {
        errors: errors,
        values: req.body
      })
    }
    const user = await User.find({ email: req.body.email });
    if (user.length === 0) {
      errors.push('Email does not exist.');
      res.render('auth/login', {
        errors: errors,
        values: req.body
      })
    }
    const hashPassword = md5(req.body.password);
    if (user[0].password !== hashPassword) {
      errors.push('Wrong password.');
      res.render('auth/login', {
        errors: errors,
        email: req.body.email
      })
    }
  
    res.cookie('userId', user[0]._id);
    res.redirect(`/posts/index/${user[0]._id}`); 
  },
  logout: (req, res) => {
    res.clearCookie("userId");
    res.redirect('login');
  }
}