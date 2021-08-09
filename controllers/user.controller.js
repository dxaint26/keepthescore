const User = require('../models/user.model');
const Post = require('../models/post.model');
 
module.exports = {
  index: async (req, res) => {
    const userId = req.params.userId;
    const myPosts = await Post.find({ userId: userId });
    res.render('users/index', {
      posts: myPosts
    })
  },
  search: async (req, res) => {
    const q = req.query.q;
    const users = await User.find();
    const matchedUsers = users.filter((user) => {
      return user.username.indexOf(q.toLocaleLowerCase()) !== -1;
    });
    res.render('users/index', {
      users: matchedUsers,
      q: q
    });
  },
  create: (req, res) => {
    res.render('users/create');
  },
  postCreate: (req, res) => {
    const user = req.body;
    users.push(user);
    res.redirect('/users');
  }
}