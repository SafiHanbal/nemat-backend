const path = require('path');
const express = require('express');
const morgan = require('morgan');

const menuRouter = require('./routes/menu.route');
const userRouter = require('./routes/user.route');
const reviewRouter = require('./routes/review.route');
const bookingRouter = require('./routes/booking.route');

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.static());

app.use(express.json());

app.use('/api/v1/menu', menuRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/review', reviewRouter);
app.use('/api/v1/booking', bookingRouter);

app.use('*', (req, res, next) => {
  const url = `${req.protocol}//:${req.hostname}${req.originalUrl}`;
  const message = `${url} route is not defined!`;
  res.status(404).json({
    status: 'fail',
    message,
  });
});

module.exports = app;
