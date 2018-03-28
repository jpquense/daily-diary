'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const requiredFields = require('../middleware/requiredFields');

mongoose.Promise = global.Promise;

const { Goal } = require('./models');

const jwtAuth = passport.authenticate('jwt', {session: false});
// Create API group routes

router.get('/goals', jwtAuth, (req, res) => {
    Goal
    .find({author: req.user._id})
    .sort({createdAt: 'desc'})
    .then(goals => res.json(goals))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
  });
  
router.get('/goals/:id', jwtAuth, (req, res) => {
  Goal
    .findById(req.params.id)
    .then(goal => res.json(goal.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went horribly awry' });
    });
});

router.post('/goals', jwtAuth, requiredFields('goal', 'date'), (req, res) => {
  Goal
    .create({
      goal: req.body.goal,
      date: req.body.date
    })
    .then(goal => res.status(201).json(goal))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

router.put('/goals/:id', jwtAuth, (req, res) => {
  const toUpdate = {};
  const updateableFields = ['goal', 'date'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Goal
    .findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(updatedGoal => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

router.delete('/goals/:id', jwtAuth, (req, res) => {
  Goal
    .findByIdAndRemove(req.params.id)
    .then(goal => {
      console.log(`Deleted goal with id \`${req.params.id}\``);
      res.status(204).json({ message: 'success' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

module.exports = { router };