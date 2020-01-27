var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser')

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');
var authRouter = require('./routes/auth');

var compression = require('compression');

var app = express();

app.use(compression()); //Compress all routes
app.use(bodyParser.json())

app.use(cors())
//app.options(cors())
//app.post(cors())

/* app.use(function (req, res, next) {
  res.set('Access-Control-Allow-Origin', 'http://localhost:8081')
  next()
}) */

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

app.use('/api', apiRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next({status: 404, message: 'not found'});
  //next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  //res.status(err.status || 500);
  
  if ('status' in err === false) {
    err.status = 500
  }

  if (err.status === 500) {
    console.log(err.stack)
  }

  res.status(err.status)

  if (req.app.get('env') === 'development') {
    res.send({ status: 'error', error: err })
  } else {
    res.send({ status: 'error', error: { message: err.message } })
  }
});

module.exports = app;
