'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const uniqueValidator = require('mongoose-unique-validator');

const GoalsSchema = new mongoose.Schema({
    content: {
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

GoalsSchema.plugin(uniqueValidator);

GoalsSchema.methods.serialize = function() {
  return {
    id: this._id,
    content: this.content,
    date: this.date
  };
};

const Goals = mongoose.model('Goals', GoalsSchema);

module.exports = { Goals };