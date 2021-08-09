const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/search', controller.search);

router.get('/:userId', controller.index);

router.get('/create', controller.create);

router.post('/create', controller.postCreate);

module.exports = router;