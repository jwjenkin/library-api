'use strict';

const db = require('../services/db.service'),
  { model, Schema } = require('mongoose');

let Audio = Schema({
  deezerId: {
    type: Number
  },
  fileId: {
    type: Schema.Types.ObjectId,
    unique: true,
    required: true
  },
  artist: {
    type: {
      name: {
        type: String,
        index: true
      },
      picture: {
        type: String
      }
    }
  },
  album: {
    type: {
      title: {
        type: String,
        index: true
      },
      cover: {
        type: String
      },
      tracklist: {
        type: String
      }
    }
  },
  duration: {
    type: Number
  },
  genre: {
    type: String
  },
  realName: {
    type: String,
    index: true,
    required: true
  },
  title: {
    type: String,
    index: true,
    required: true
  },
  titleShort: {
    type: String
  }
});

module.exports = model('Audio', Audio);
