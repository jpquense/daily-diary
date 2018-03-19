const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { Gratitudes } = require('../models/gratitudes.models');


// const errorsParser = require('../helpers/errorsParser.helper');
// const requiredFields = require('../middlewares/requiredFields.middleware');

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
  
router.get('gratitudes/:id', (req, res) => {
  Gratitudes
    .findById(req.params.id)
    .then(post => res.json(post.serialize()))
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


router.delete('gratitudes/:id', (req, res) => {
  Gratitudes
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: 'success' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});


router.put('gratitudes/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['date', 'content'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Gratitudes
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedPost => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});


router.delete('/:id', (req, res) => {
  Gratitudes
    .findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleted blog post with id \`${req.params.id}\``);
      res.status(204).end();
    });
});


// router.route('/recipes')
//     .post(requiredFields('name', 'ingredients'), (req, res) => {
//         Recipes.create({
//             name: req.body.name,
//             ingredients: req.body.ingredients,
//         })
//         .then(() => res.status(201).send())
//         .catch(report => res.status(400).json(errorsParser.generateErrorResponse(report)));
//     })
//     .get((req, res) => {
//         Recipes.find()
//         .populate('ingredients.ingredient', 'name')
//         .then(recipes => res.json(recipes));
//     });

// router.route('/recipes/:id')
//     .get((req, res) => {
//         Recipes.findById(req.params.id)
//         .populate('ingredients.ingredient', 'name')
//         .then(recipe => res.json(recipe));
//     });

module.exports = router;