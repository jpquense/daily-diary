'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');

const { router: usersRouter } = require('..routers/users/users.router');
const { router: authRouter, localStrategy, jwtStrategy } = require('./routers/auth.routers');
const gratitudesRouter = require('./routers/gratitudes.router');
const goalsRouter = require('./routers/goals.router');

const app = express();

mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require('./config/config');

app.use(morgan('common'));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Logging
app.use(morgan('common'));

// Static Files
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login/login.html');
});

passport.use(localStrategy);
passport.use(jwtStrategy);

// Routes
app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);
app.use('/api', gratitudesRouter);
app.use('/api', goalsRouter);

// A protected endpoint which needs a valid JWT to access it
app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'rosebud'
  });
});

// if endpoint does not exist
app.use('*', function (req, res) {
    res.status(404).json({ message: 'Not Found' });
  });

// Referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object
let server;

function runServer() {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, { useMongoClient: true }, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(PORT, () => {
          console.log(`Your app is listening on port ${PORT}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };