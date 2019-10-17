'use strict';

const db = require('../services/db.service'),
  { model, Schema } = require('mongoose');

let Audio = Schema({
  fileId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  artist: {
    type: String
  },
  album: {
    type: String
  },
  genre: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  albumArt: {
    type: String
  }
});

Audio.index({ name: 1, ext: 1 });

module.exports = model('Audio', Audio);
