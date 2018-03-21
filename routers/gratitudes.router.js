const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { Gratitudes } = require('../models/gratitudes.models');

// Create API group routes

router.get('/gratitudes', (req, res) => {
  console.log('get gratitudes endpoint connected');
    Gratitudes
      .find()
      .then(gratitudes => {
        res.json(gratitudes.map(gratitude => gratitude.serialize()));
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
      });
  });
  
router.get('/gratitudes/:id', (req, res) => {
  Gratitudes
    .findById(req.params.id)
    .then(gratitude => res.json(gratitude.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went horribly awry' });
    });
});

router.post('/gratitudes', (req, res) => {
  const requiredFields = ['content', 'date'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Gratitudes
    .create({
      content: req.body.content,
      date: req.body.date
    })
    .then(Gratitudes => res.status(201).json(Gratitudes.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });

});


router.delete('/gratitudes/:id', (req, res) => {
  Gratitudes
    .findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleted gratitude with id \`${req.params.id}\``);
      res.status(204).json({ message: 'success' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

router.put('/gratitudes/:id', (req, res) => {
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

  Gratitudes
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(gratitude => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

module.exports = router;