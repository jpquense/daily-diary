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
router.route('/user')
  .post(disableWithToken, requiredFields('firstName', 'username', 'password', 'lastName', 'email'), (req, res) => {
    User.find({username: req.body.username})
    .count()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'Username'
        });
      }
      return User.hashPassword(req.body.password);
    })
    .then(hash => {
      return User.create({
        username: req.body.username,
        password: hash,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
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
      });
    });
  });


router.route('/user')
  .get(passport.authenticate('jwt', { session: false }), (req, res) => {
    res.status(200).json(req.user)
    .catch(err => res.status(500).json({message: 'Internal server error'}));
  });

module.exports = {router};