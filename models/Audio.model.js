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
  duration: {
    type: Number
  },
  genre: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  titleShort: {
    type: String
  }
});

Audio.index({ title: 1, genre: 1, 'artist.name': 1, 'album.name': 1 });

module.exports = model('Audio', Audio);
