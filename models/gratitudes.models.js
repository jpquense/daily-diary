'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const uniqueValidator = require('mongoose-unique-validator');

const GratitudesSchema = new mongoose.Schema({
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

GratitudesSchema.plugin(uniqueValidator);

GratitudesSchema.methods.serialize = function() {
  return {
    id: this._id,
    content: this.content,
    date: this.date
  };
};

const Gratitudes = mongoose.model('Gratitudes', GratitudesSchema);

module.exports = { Gratitudes };