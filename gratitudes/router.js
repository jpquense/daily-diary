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
// Get all gratitudes for one user
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
   // Get one gratitude with _id 
router.get('/gratitudes/:id', jwtAuth, (req, res) => {
  Gratitude
    .findById(req.params.id)
    .then(gratitude => res.json(gratitude))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Unable to find gratitude, contact Internal server manager' });
    });
});
// Create new gratitude
router.post('/gratitudes', jwtAuth, requiredFields('gratitude'), (req, res) => {
  Gratitude
    .create({
      gratitude: req.body.gratitude,
      author: req.user._id
    })
    .then(gratitude => res.status(201).json(gratitude))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error, unable to post new gratitude' });
    });
});
// Change existing gratitude with _id
router.put('/gratitudes/:id', jwtAuth, (req, res) => {
  Gratitude
  .findByIdAndUpdate(req.params.id, {$set: { gratitude: `${req.body.gratitude}`}})
  .then(updatedGratitude => res.json(updatedGratitude))
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});
// Delete existing goal with _id
router.delete('/gratitudes/:id', jwtAuth, (req, res) => {
  Gratitude
    .findByIdAndRemove(req.params.id)
    .then(gratitude => {
      console.log(`Deleted gratitude with id \`${req.params.id}\``);
      res.status(204).json({ message: 'success' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error, unable to delet gratitude' });
    });
});

module.exports = { router };