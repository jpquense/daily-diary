'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const gratitudesSchema = new mongoose.Schema({
    gratitude: {
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

gratitudesSchema.plugin(uniqueValidator);

gratitudesSchema.methods.serialize = function() {
  return {
    id: this._id,
    gratitude: this.gratitude,
    date: this.date
  };
};

module.exports = mongoose.model('Gratitudes', gratitudesSchema);