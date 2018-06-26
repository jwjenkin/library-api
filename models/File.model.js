'use strict';

const db = require('../services/db.service'),
  mongoose = require('mongoose');

let File = mongoose.Schema({
  added: {
    type: Date,
    default: new Date()
  },
  ext: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true,
    select: false
  },
  fileType: {
    type: String,
    require: true
  },
  tags: {
    type: [{ type: String }],
    default: []
  }
});

File.index({ name: 1, ext: 1 });

module.exports = mongoose.model('File', File);