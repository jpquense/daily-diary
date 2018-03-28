'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const goalSchema = new mongoose.Schema({
    goal: { type: String, required: true },
    date: { type: Date, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Goal = mongoose.model('Goal', goalSchema);

module.exports = { Goal };