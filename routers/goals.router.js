'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const goalsSchema = new mongoose.Schema({
    goal: {
        type: String,
        unique: true,
        required: true,
    },
    date: {
        type: Date,
        unique: false,
        required: true,
    },
  
}, {
    timestamps: true,
});

goalsSchema.plugin(uniqueValidator);

goalsSchema.methods.serialize = function() {
  return {
    id: this._id,
    goal: this.goal,
    date: this.date
  };
};

module.exports = mongoose.model('Goals', goalsSchema);