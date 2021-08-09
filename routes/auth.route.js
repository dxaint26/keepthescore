const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');

router.get('/signup', controller.signup); 

router.post('/signup', controller.postSignup); 

router.get('/login', controller.login);

router.post('/login', controller.postLogin);

router.get('/logout', controller.logout); 

module.exports = router;