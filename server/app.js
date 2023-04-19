const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
// const logger = require('morgan');
const logger = require('./config/logger');
const { sequelize } = require('./models');
require('express-async-errors'); // controller에서 async로 메소드 구현할 때 express-async-errors를 사용하지 않을 경우 에러가 발생했을 때 앱이 종료될 수도 있다. 

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');

const app = express();

logger.info(`${path.basename(__filename)} [INIT] Farmdora Server Start`);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


sequelize.sync({ alter: true })
.then(() => {
  logger.info(`${path.basename(__filename)} [INIT] DataBase Connected`);
})
.catch((err) => {
  logger.info(err);
});

module.exports = app;
