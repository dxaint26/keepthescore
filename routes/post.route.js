const express = require('express');
const router = express.Router();
const controller = require('../controllers/post.controller');

router.get('/index/:userId', controller.index);

router.get('/configure/:scoreBoardId', controller.configure);

router.post('/configure/:scoreBoardId', controller.postConfigure);

router.get('/add-player/:scoreBoardId', controller.addPlayer);

router.post('/add-player/:scoreBoardId', controller.postAddPlayer);

router.get('/edit-player/:scoreBoardId/:player', controller.editPlayer);

router.post('/edit-player/:scoreBoardId/:player', controller.postEditPlayer);

router.post('/delete-player/:scoreBoardId/:player', controller.deletePlayer);

router.post('/delete-round/:scoreBoardId/:round', controller.deleteRound);

router.get('/edit-round/:scoreBoardId/:round', controller.editRound);

router.post('/edit-round/:scoreBoardId/:round', controller.postEditRound);

router.get('/reset/:scoreBoardId', controller.reset);

router.get('/delete/:scoreBoardId', controller.delete);

router.get('/:scoreBoardId', controller.scoreBoard);

router.get('/add-score/:scoreBoardId', controller.addScore);

router.post('/add-score/:scoreBoardId', controller.postAddScore);

router.get('/create/:userId', controller.create);

router.post('/create/:userId', controller.postCreate);

router.get('/create/player/:userId', controller.createPlayer);

router.post('/create/player/:userId', controller.postCreatePlayer);

module.exports = router;