'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const requiredFields = require('../middleware/requiredFields');

mongoose.Promise = global.Promise;

const { Gratitude } = require('./models');

const jwtAuth = passport.authenticate('jwt', {session: false});
// Create API group routes

router.get('/gratitudes', jwtAuth, (req, res) => {
  Gratitude
    .find({author: req.user._id})
    .sort({createdAt: 'desc'})
    .then(gratitudes => res.json(gratitudes))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
  });
  
router.get('/gratitudes/:id', jwtAuth, (req, res) => {
  Gratitude
    .findById(req.params.id)
    .then(gratitude => res.json(gratitude.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went horribly awry' });
    });
});

router.post('/gratitudes', jwtAuth, requiredFields('gratitude', 'date'), (req, res) => {
  Gratitude
    .create({
      gratitude: req.body.gratitude,
      date: req.body.date
    })
    .then(gratitude => res.status(201).json(gratitude))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

router.put('/gratitudes/:id', jwtAuth, (req, res) => {
  const toUpdate = {};
  const updateableFields = ['gratitude', 'date'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Gratitude
    .findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(updatedgratitude => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

router.delete('/gratitudes/:id', jwtAuth, (req, res) => {
  Gratitude
    .findByIdAndRemove(req.params.id)
    .then(gratitude => {
      console.log(`Deleted gratitude with id \`${req.params.id}\``);
      res.status(204).json({ message: 'success' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

module.exports = { router };