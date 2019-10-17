'use strict';

const router = require('express')(),
  deezerSvc = new (require('../services/deezer.service'))(),
  Audio = require('../models/Audio.model');

router.get('/search', (req, res) => {
  if ( !req.query.q ) {
    return res.status(400).json({ error: 'Please include query (q)' })
  } // end if

  deezerSvc.search(req.query.q).subscribe(response => {
    const results = response.data.slice();
    const numResults = response.total;

    res.json({
	    results: results.map(r => new Audio(Object.assign({ deezerId: r.id, titleShort: r.title_short }, r))),
      numResults
    });
  }, err => res.status(400).json({ err }));
});

module.exports = router;

