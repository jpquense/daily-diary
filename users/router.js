'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const disableWithToken = require('../middleware/disableWithToken').disableWithToken;
const requiredFields = require('../middleware/requiredFields');


const { User } = require('./models');
const localStrategy = require('../auth/strategies');

const router = express.Router();

// Create new user
router.route('/users')
  .post(disableWithToken, requiredFields('firstName', 'lastName', 'username','email', 'password'), (req, res) => {
    console.log('route /api/users was reached with post request!');
    console.log(req.body);
    User
    .find({"email": req.body.email})
    .count()
    .then(count => {
      if (count > 0) {
        // return res.status(422).json({error: 'Email address is already taken please login or try a new email address'});
        Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'Username'
        });
        return res.status(422).json({error: 'Email address is already taken please login or try a new email address'});
      }
      return User.hashPassword(req.body.password);
    })
    .then(hash => {
      return User.create({
        username: req.body.username,
        email: req.body.email,
        lastName: req.body.lastName,
        password: hash,
        firstName: req.body.firstName
      })
      .then(user => {
        return res.status(201).json(user.serialize());
      })
      .catch(err => {
        console.log(err);
        if (err.reason === 'ValidationError') {
          return res.status(err.code).json(err);
        }
        res.status(500).json({code: 500, message: 'Internal server error!'});
      })
    })
  })

const jwtAuth = passport.authenticate('jwt', {session: false});

router.get('/users', jwtAuth, (req, res) => {
  User
  .find()
  .sort({createdAt: 'desc'})
  .then(users => res.json(users))
  .catch(err => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  });
});  

module.exports = {router};