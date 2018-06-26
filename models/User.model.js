'use strict';

const db = require('../services/db.service'),
  mongoose = require('mongoose');

let User = mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  }
});

User.index({ username: 1 });

module.exports = mongoose.model('User', User);