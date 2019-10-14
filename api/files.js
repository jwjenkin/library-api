'use strict';

const router = require('express')(),
  jwt = require('jwt-simple'),
  moment = require('moment'),
  File = require('../models/File.model'),
  secret = require('../config').secret;

moment().utcOffset(-5);

router.get('/:id', (req, res) => {
  File.findById(req.params.id).then(file => {
    if ( !file ) {
      return res.status(404).json({ error: 'File not found.' });
    } // end if

    res.json(file);
  }).catch(err => (console.log(err), res.sendStatus(400)));
});

router.get('/:id/request', (req, res) => {
  let exp = moment().add(5, 'h').unix();
  res.json({
    keycard: jwt.encode({ id: req.params.id, exp }, secret)
  });
});

router.get('/:id/stream', (req, res) => {
  if ( !req.keycard || !req.keycard.id === req.params.id ) {
    return res.status(401).json({ error: 'Missing keycard.' });
  } // end if

  File.findById(req.params.id, { path: 1 }).then(file => {
    if ( !file ) {
      return res.status(404).json({ error: 'File not found.' });
    } // end if
    console.log(file.path);
    res.download(file.path, e => {
      if ( !e ) {
        console.log('well, something odd is happening: ');
      } else if ( e.toString().indexOf('aborted') === -1 ) {
        console.log(e.toString());
        //return res.sendStatus(400);
      } // end if
    });
  }).catch(err => console.log(err));
});

module.exports = router;
