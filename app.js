const express = require('express');
const path = require('path');
const favicon = require('static-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const database = require('./database/');
const usersRoutes = require('./routes/users');
const showsRoutes = require('./routes/shows');
const validationRoutes = require('./routes/validation');
const ordersRoutes = require('./routes/orders');

const app = express();

require('dotenv').config()

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

database.connect();

app.use('/users', usersRoutes);
app.use('/shows', showsRoutes);
app.use('/validation', validationRoutes);
app.use('/orders', ordersRoutes);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;
