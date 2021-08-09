const express = require('express');
const { render } = require('pug');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/user.route');
const authRouter = require('./routes/auth.route');
const postRouter = require('./routes/post.route');
const mongoose = require('mongoose');
const authMiddleware = require('./middlewares/auth.middleware');

mongoose.connect('mongodb://localhost/express-test', { useNewUrlParser: true });
mongoose.set('useUnifiedTopology', true);

const app = express();

const port = 3000;

app.set('view engine', 'pug');
app.set('views', './views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/users', authMiddleware.requireAuth, userRouter);
app.use('/posts', authMiddleware.requireAuth, postRouter);
app.use('/auth', authRouter);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('auth/login');
});

app.listen(port, () => {
  console.log("App listenning on port ", port);
}); 
