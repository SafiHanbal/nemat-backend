const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');

const menuRouter = require('./routes/menu.route');
const userRouter = require('./routes/user.route');
const reviewRouter = require('./routes/review.route');
const orderRouter = require('./routes/order.route');
const globalErrorHandler = require('./controllers/error.controller');

const app = express();

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: ['ratingsAverage', 'ratingsCount', 'price', 'category'],
  })
);

if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requrest from this IP, please try again in an hour!',
});

app.use('/api', limiter);
app.use(express.json());
app.use(cors());

app.use('/api/v1/menu', menuRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/review', reviewRouter);
app.use('/api/v1/order', orderRouter);

app.use('*', (req, res, next) => {
  const url = `${req.protocol}//:${req.hostname}${req.originalUrl}`;
  const message = `${url} route is not defined!`;
  res.status(404).json({
    status: 'fail',
    message,
  });
});

app.use(globalErrorHandler);

module.exports = app;
