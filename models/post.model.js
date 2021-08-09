const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: String,
  title: String,
  description: String,
  scoreBoard: Array,
  scoreFormat: String,
  trophy: String,
  date: Date
});

const Post = mongoose.model('Post', postSchema, 'posts');

module.exports = Post;