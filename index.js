'use strict';

const config = require('./config');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const passport = require('passport');

const app = express();

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(passport.initialize());

if (config.isDevelopment) {
  const devMiddleware = require('./devMiddleware');

  devMiddleware(app); 
}

if (!config.isDevelopment) {
  app.use('/static', express.static(path.resolve(__dirname, 'static')));
}

app.use('/api', require('./server/api'));

app.use('/', function(req, res) {
  res.render('spa')
})

app.listen(config.port, function(error) {
  const port = config.port;
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})