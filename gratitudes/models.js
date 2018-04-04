'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const gratitudeSchema = new mongoose.Schema({
    gratitude: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Gratitude = mongoose.model('Gratitude', gratitudeSchema);

module.exports = { Gratitude };