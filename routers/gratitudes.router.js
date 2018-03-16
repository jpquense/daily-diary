const express = require('express');
const Recipes = require('../models/gratitudes.model');
const errorsParser = require('../helpers/errorsParser.helper');
const requiredFields = require('../middlewares/requiredFields.middleware');

// Create API group routes
const router = express.Router();

router.route('/recipes')
    .post(requiredFields('name', 'ingredients'), (req, res) => {
        Recipes.create({
            name: req.body.name,
            ingredients: req.body.ingredients,
        })
        .then(() => res.status(201).send())
        .catch(report => res.status(400).json(errorsParser.generateErrorResponse(report)));
    })
    .get((req, res) => {
        Recipes.find()
        .populate('ingredients.ingredient', 'name')
        .then(recipes => res.json(recipes));
    });

router.route('/recipes/:id')
    .get((req, res) => {
        Recipes.findById(req.params.id)
        .populate('ingredients.ingredient', 'name')
        .then(recipe => res.json(recipe));
    });

module.exports = { router };