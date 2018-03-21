const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { Goals } = require('../models/goals.models');

// Create API group routes

router.get('/goals', (req, res) => {
  console.log('get goals endpoint connected');
    Goals
      .find()
      .then(goals => {
        res.json(goals.map(goal => goal.serialize()));
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
      });
  });
  
router.get('/goals/:id', (req, res) => {
  goals
    .findById(req.params.id)
    .then(goal => res.json(goal.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went horribly awry' });
    });
});

router.post('/goals', (req, res) => {
  const requiredFields = ['content', 'date'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Goals
    .create({
      content: req.body.content,
      date: req.body.date
    })
    .then(Goals => res.status(201).json(Goals.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });

});


router.delete('/goals/:id', (req, res) => {
  Goals
    .findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleted goal with id \`${req.params.id}\``);
      res.status(204).json({ message: 'success' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

router.put('/goals/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({ message: message });
  }
  const toUpdate = {};
  const updateableFields = ['content', 'date'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Goals
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(goal => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

module.exports = router;