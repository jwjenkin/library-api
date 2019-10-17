'use strict';

const db = require('../services/db.service'),
  { model, Schema } = require('mongoose');

let Audio = Schema({
  deezerId: {
    type: Number
  },
  fileId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  artist: {
    type: {
      deezerId: {
        type: Number
      },
      name: {
        type: String
      },
      picture: {
        type: String
      }
    }
  },
  album: {
    type: {
      deezerId: {
        type: Number
      },
      title: {
        type: String
      },
      cover: {
        type: String
      },
      tracklist: {
        type: String
      }
    }
  },
  genre: {
    type: String
  },
  title: {
    type: String,
    required: true
  }
});

Audio.index({ title: 1, genre: 1, 'artist.name': 1, 'album.name': 1 });

module.exports = model('Audio', Audio);
