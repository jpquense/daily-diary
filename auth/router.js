'use strict';

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');
const router = express.Router();
const disableWithToken = require('../middleware/disableWithToken').disableWithToken;
const requiredFields = require('../middleware/requiredFields');
const { localStrategy, jwtStrategy } = require('./');

const createAuthToken = user => {
  return jwt.sign({
    user: {
      _id: user._id,
      username: user.username,
      firstName: user.firstName,
      email: user.email,
    }
  }, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', { session: false });

// Get jwt token at login in exhange for username and password using local authentication
router.post('/login', disableWithToken, requiredFields('username', 'password'), localAuth, (req,res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});

const jwtAuth = passport.authenticate('jwt', {session: false});

router.get('/info', jwtAuth, (req, res) => {
  console.log(req.user);
  res.json({})
})

router.post('/refresh', jwtAuth, (req,res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});

module.exports = { router };