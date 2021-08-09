const Post = require('../models/post.model');
const User = require('../models/user.model');
 
module.exports = {
  index: async (req, res) => {
    const userId = req.params.userId;
    let scoreBoards = await Post.find( {userId: userId} );
    const date = [];
    scoreBoards.forEach((scoreboard) => {
      date.push(scoreboard.date.getFullYear() + '-' +
                (parseInt(scoreboard.date.getMonth()) + 1) + '-' +
                scoreboard.date.getDate())
    })
    res.render('users/index', {
      userId: userId,
      date: date,
      scoreBoards: scoreBoards
    })
  },
  create: async (req, res) => {
    const userId = req.params.userId;
    res.render('posts/create', {
      userId: userId
    });
  },
  createPlayer: async (req, res) => {
    const userId = req.params.userId;
    res.render('posts/create', {
      userId: userId
    });
  },
  postCreate: async (req, res) => {
    const userId = req.params.userId;
    const create = req.body;
    res.render('posts/create-player', {
      userId: userId,
      nop: create.nop,
      title: create.title, 
      description: create.description,
      scoreFormat: create.score_format,
      trophy: create.trophy
    });
  },
  postCreatePlayer: async (req, res) => {
    const userId = req.params.userId;
    const create = req.body;
    const namePlayers = [];
    for (let i = 0; i < create.nop; i++) {
      namePlayers.push(create[`player${i+1}`]);
    }
    let errors = '';
    for (let i = 0; i < namePlayers.length; i++) {
      for (let j = i+1; j < namePlayers.length; j++)
        if (namePlayers[i] === namePlayers[j]) {
          errors = 'Players must be unique';
        }
    }
    if (errors !== '') {
      res.render('posts/create-player', {
        errors: errors,
        values: namePlayers,
        userId: userId,
        nop: create.nop,
        title: create.title, 
        description: create.description,
        scoreFormat: create.score_format,
        trophy: create.trophy
      })
    } else {
      let scoreBoard = [];
      const initScore = 0;
      let format = 0;
      if (create.score_format === '1_DP') {
        format = 1;
      }
      if (create.score_format === '2_DP') {
        format = 2;
      }
      for (let i = 0; i < create.nop; i++) {
        scoreBoard.push([]);
        scoreBoard[i][0] = create[`player${i+1}`];
        scoreBoard[i].push(initScore.toFixed(format));
      }
      var newdate = new Date();
      const board = new Post({ userId: userId,
                              title: create.title, 
                              description: create.description,
                              scoreFormat: create.score_format,
                              scoreBoard: scoreBoard,
                              trophy: create.trophy,
                              date: newdate
      });
      board.save((err, scoreBoard) => {
        if (err) return err;
        res.redirect(`/posts/${scoreBoard._id}`); 
      });
    }
  },
  scoreBoard: async (req, res) => {
    const scoreBoardId = req.params.scoreBoardId;
    const scoreBoard = await Post.find( {_id: scoreBoardId} );
    
    const totals = [];
    scoreBoard[0].scoreBoard.forEach((player) => {
      totals.push(player[1]);
    })
    for (let i = 1; i < totals.length; i++) {
      for (let j = 0; j < i; j++) {
        if (parseFloat(totals[i]) > parseFloat(totals[j])) {
          let x = scoreBoard[0].scoreBoard[i];
          scoreBoard[0].scoreBoard[i] = scoreBoard[0].scoreBoard[j];
          scoreBoard[0].scoreBoard[j] = x;
          let y = totals[i];
          totals[i] = totals[j];
          totals[j] = y;
        }
      }
    }
    if (scoreBoard[0].trophy === 'LOWEST') {
      totals.reverse();
      scoreBoard[0].scoreBoard.reverse();
    }
    totals.unshift('TOTALS');
    if ((parseFloat(totals[1]) !== 0)) {
      totals[1] = totals[1] + " 🏆"
    }
    const rounds = [];
    const name = [];
    for (let i = 2; i < scoreBoard[0].scoreBoard[0].length; i++) {
      rounds.push([]);
      name.push([]);
    }
    let format = 0;
    if (scoreBoard[0].scoreFormat === '1_DP') {
      format = 1
    } 
    if (scoreBoard[0].scoreFormat === '2_DP') {
      format = 2
    } 
    for (let i = 2; i < scoreBoard[0].scoreBoard[0].length; i++) {
      scoreBoard[0].scoreBoard.forEach((player) => {
        rounds[i-2].push(player[i].score.toFixed(format));
        name[i-2].push(player[i].nameRound);
      })
      rounds[i-2].unshift(name[i-2][0]);
    }
    const date = scoreBoard[0].date.getDate();
    const month = scoreBoard[0].date.getMonth() + 1;
    const year = scoreBoard[0].date.getFullYear();
    const createdAt = year + '-' + month + '-' + date
    res.render('posts/score-board', {
      createdAt: createdAt,
      rounds: rounds,
      totals: totals,
      scoreBoard: scoreBoard[0]
    })
  },
  addScore: async (req, res) => {
    const scoreBoardId = req.params.scoreBoardId;
    const scoreBoard = await Post.find( {_id: scoreBoardId} );
    res.render('posts/add-score', {
      scoreBoard: scoreBoard[0]
    })
  },
  postAddScore: async (req, res) => {
    const scoreBoardId = req.params.scoreBoardId;
    const input = req.body;
    const scoreBoard = await Post.find( {_id: scoreBoardId} );
    var scoreRound = [];
    let format = 0;
    if (scoreBoard[0].scoreFormat === '1_DP') {
      format = 1
    } 
    if (scoreBoard[0].scoreFormat === '2_DP') {
      format = 2
    } 
    Object.keys(input).forEach((key, index) => {
      if (index > 0) {
        scoreRound.push(parseFloat(input[key]).toFixed(format));
      } else {
        scoreRound.push(input[key]);
      }
    })
    for (let i = 1; i < scoreRound.length; i++) {
      scoreBoard[0].scoreBoard[i-1].push({
        nameRound: scoreRound[0],
        score: parseFloat(scoreRound[i])
      });
      scoreBoard[0].scoreBoard[i-1][1] = parseFloat(scoreBoard[0].scoreBoard[i-1][1])
      scoreBoard[0].scoreBoard[i-1][1] += parseFloat(scoreRound[i]);
      scoreBoard[0].scoreBoard[i-1][1] = scoreBoard[0].scoreBoard[i-1][1].toFixed(format);
    }
    Post.findByIdAndUpdate(scoreBoardId, { scoreBoard: scoreBoard[0].scoreBoard }, (err, scoreBoard) => {
      if (err) return err;
      res.redirect(`/posts/${scoreBoard._id}`); 
    })
  },
  configure: async (req, res) => {
    const scoreBoardId = req.params.scoreBoardId;
    const scoreBoard = await Post.find( {_id: scoreBoardId} );
    res.render('posts/configure', {
      scoreBoard: scoreBoard[0]
    })
  },
  postConfigure: async (req, res) => {
    const scoreBoardId = req.params.scoreBoardId;
    const scoreBoard = await Post.find( {_id: scoreBoardId} );
    const update = req.body;
    scoreBoard[0].title = update.title;
    scoreBoard[0].description = update.description;
    scoreBoard[0].scoreFormat = update.score_format;
    scoreBoard[0].trophy = update.trophy;
    scoreBoard[0].save((err, scoreBoard) => {
      if (err) return err;
      res.redirect(`/posts/${scoreBoard._id}`); 
    });
  },
  reset: async (req, res) => {
    const scoreBoardId = req.params.scoreBoardId;
    const scoreBoard = await Post.find( {_id: scoreBoardId} );
    let reset = [];
    const initScore = 0;
    let format = 0;
    if (scoreBoard[0].scoreFormat === '1_DP') {
      format = 1;
    }
    if (scoreBoard[0].scoreFormat === '2_DP') {
      format = 2;
    }
    for (let i = 0; i < scoreBoard[0].scoreBoard.length; i++) {
      reset.push([]);
      reset[i][0] = scoreBoard[0].scoreBoard[i][0];
      reset[i].push(initScore.toFixed(format));
    }
    scoreBoard[0].scoreBoard = reset;
    scoreBoard[0].save((err, scoreBoard) => {
      if (err) return err;
      res.redirect(`/posts/${scoreBoard._id}`); 
    });
  },
  addPlayer: async (req, res) => {
    const scoreBoardId = req.params.scoreBoardId;
    const scoreBoard = await Post.find( {_id: scoreBoardId} );
    res.render('posts/add-player', {
      scoreBoard: scoreBoard[0]
    })
  },
  postAddPlayer: async (req, res) => {
    const scoreBoardId = req.params.scoreBoardId;
    const scoreBoard = await Post.find( {_id: scoreBoardId} );
    const nameNewPlayer = req.body.name;
    const errors = [];
    scoreBoard[0].scoreBoard.forEach((player) => {
      if (player[0] === nameNewPlayer) {
        errors.push('Player name already exists');
      }
    })
    if (errors.length === 0) {
      const newPlayer = scoreBoard[0].scoreBoard[0];
      for (let i = 2; i < newPlayer.length; i++) {
        newPlayer[i].score = 0;
      }
      newPlayer[0] = nameNewPlayer;
      newPlayer[1] = 0.0;

      scoreBoard[0].scoreBoard.push(newPlayer);
      scoreBoard[0].save((err, scoreBoard) => {
      if (err) return err;
        res.redirect(`/posts/${scoreBoard._id}`); 
      });
    } else {
      res.render('posts/add-player', {
        scoreBoard: scoreBoard[0],
        errors: errors,
        values: nameNewPlayer
      })
    }
  },
  editPlayer: async (req, res) => {
    const scoreBoardId = req.params.scoreBoardId;
    const player = req.params.player;
    const scoreBoard = await Post.find( {_id: scoreBoardId} );
    res.render('posts/edit-player', {
      scoreBoard: scoreBoard[0],
      player: player
    })
  },
  postEditPlayer: async (req, res) => {
    const scoreBoardId = req.params.scoreBoardId;
    const player = req.params.player;
    const scoreBoard = await Post.find( {_id: scoreBoardId} );
    const nameNewPlayer = req.body.name;
    const errors = [];
    scoreBoard[0].scoreBoard.forEach((p) => {
      const index = scoreBoard[0].scoreBoard.indexOf(p);
      if (index !== player - 1) {
        if (p[0] === nameNewPlayer) {
          errors.push('Player name already exists');
        }
      }
    })
    if (errors.length === 0) {
      scoreBoard[0].scoreBoard[player-1][0] = nameNewPlayer;
      Post.findByIdAndUpdate(scoreBoardId, { scoreBoard: scoreBoard[0].scoreBoard }, (err, scoreBoard) => {
        if (err) return err;
        res.redirect(`/posts/${scoreBoard._id}`); 
      })
    } else {
      res.render('posts/edit-player', {
        scoreBoard: scoreBoard[0],
        player: player,
        errors: errors,
        values: nameNewPlayer
      })
    }
  },
  deletePlayer: async (req, res) => {
    const scoreBoardId = req.params.scoreBoardId;
    const player = req.params.player;
    const scoreBoard = await Post.find( {_id: scoreBoardId} );
    scoreBoard[0].scoreBoard.splice(player - 1, 1);
    Post.findByIdAndUpdate(scoreBoardId, { scoreBoard: scoreBoard[0].scoreBoard }, (err, scoreBoard) => {
      if (err) return err;
      res.redirect(`/posts/${scoreBoard._id}`); 
    })
  },
  editRound: async (req, res) => {
    const scoreBoardId = req.params.scoreBoardId;
    const round = req.params.round;
    const scoreBoard = await Post.find( {_id: scoreBoardId} );
    res.render('posts/edit-round', {
      scoreBoard: scoreBoard[0],
      round: parseInt(round),
      nameRound: scoreBoard[0].scoreBoard[0][parseInt(round)+1].nameRound
    })
  },
  postEditRound: async (req, res) => {
    const scoreBoardId = req.params.scoreBoardId;
    const input = req.body;
    const scoreBoard = await Post.find( {_id: scoreBoardId} );
    const format = scoreBoard[0].scoreFormat;
    const round = parseInt(req.params.round);
    const scoreRound = [];
    Object.keys(input).forEach((key, index) => {
      if (index > 0) {
        scoreRound.push(parseFloat(input[key]).toFixed(format));
      } else {
        scoreRound.push(input[key]);
      }
    })
    let n = 1;
    scoreBoard[0].scoreBoard.forEach((player) => {
      player[round+1].nameRound = scoreRound[0];
      player[round+1].score = parseFloat(scoreRound[n]);
      n++;
    })
    scoreBoard[0].scoreBoard.forEach((player) => {
      player[1] = 0;
      for (let i = 2; i < player.length; i++) {
        player[1] += parseFloat(player[i].score);
      }
    })
    Post.findByIdAndUpdate(scoreBoardId, { scoreBoard: scoreBoard[0].scoreBoard }, (err, scoreBoard) => {
      if (err) return err;
      res.redirect(`/posts/${scoreBoard._id}`); 
    })
  },
  deleteRound: async (req, res) => {
    const scoreBoardId = req.params.scoreBoardId;
    const round = parseInt(req.params.round);
    const scoreBoard = await Post.find( {_id: scoreBoardId} );
    scoreBoard[0].scoreBoard.forEach((player) => {
      player.splice(round + 1, 1);
    })
    Post.findByIdAndUpdate(scoreBoardId, { scoreBoard: scoreBoard[0].scoreBoard }, (err, scoreBoard) => {
      if (err) return err;
      res.redirect(`/posts/${scoreBoard._id}`); 
    })
  },
  delete: async (req, res) => {
    const scoreBoardId = req.params.scoreBoardId;
    const scoreBoard = await Post.find( {_id: scoreBoardId} );
    const userId = scoreBoard[0].userId;
    Post.deleteOne({ _id: scoreBoardId }, (err) => {
      if (err) return err;
      res.redirect(`/posts/index/${userId}`); 
    })
  },
}