'use strict';

const router = require('express')(),
  deezerSvc = new (require('../services/deezer.service'))(),
  Audio = require('../models/Audio.model');

router.get('/search', (req, res) => {
  if ( !req.query.q ) {
    return res.status(400).json({ error: 'Please include query (q)' })
  } // end if

  deezerSvc.search(req.query.q).subscribe(
    response => res.json(response),
    err => res.status(400).json({ err })
  );
});

module.exports = router;

