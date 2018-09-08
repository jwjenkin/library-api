'use strict';

const router = require('express')(),
  File = require('../models/File.model');

router.get('/', (req, res) => res.send(`
Jenkins Library
Endpoints:
/browse/:type - look through type (video, audio, and book), paginated
/browse/:type/search/:term - search through type of files by name
/browse/:type/tags/:tag - search through type of files by tag (TV Show name, Artists, blah)

/files/:id - get specific file info
/files/:id/request - get the keycard
/files/:id/stream - (one you probably are after) download meh

Cheaty-face: you can append your token to any url as ?auth=TOKEN
`));

router.get('/:type', (req, res) => {
  let page = 0,
    limit = 50,
    $match = { fileType: req.params.type, ext: { $ne: 'avi' } };


  if ( req.query.perPage && !isNaN(req.query.perPage) ) {
    limit = parseInt(req.query.perPage);
  } // end if

  if ( req.query.page && !isNaN(req.query.page) ) {
    page = parseInt(req.query.page) - 1;
  } // end if

  if ( page < 0 ) {
    page = 0;
  } // end if

  File.aggregate([
    { $match },
    { $sort: { name: 1, ext: 1 } },
    { $skip: page * limit },
    { $limit: limit },
    { $project: { fileType: 1, name: 1, ext: 1, tags: 1 } }
  ]).then(files => res.json(files))
    .catch(err => (console.log(err), res.sendStatus(400)));
});

router.get('/:type/search', (req, res) => {
  browseType(req).then(media => res.json(media))
    .catch(err => res.sendStatus(400));
});

router.get('/:type/search/:filter', (req, res) => {
  browseType(req).then(media => res.json(media))
    .catch(err => res.sendStatus(400));
});

router.get('/:type/tags/:tags', (req, res) => {
  let page = 0,
    limit = 50;


  if ( req.query.page && !isNaN(req.query.page) ) {
    page = parseInt(req.query.page) - 1;
  } // end if

  if ( page < 0 ) {
    page = 0;
  } // end if

  File.aggregate([
    {
      $match: {
        fileType: req.params.type,
        tags: {
          $all: req.params.tags.split(',').map(t => new RegExp(t.trim().toLowerCase(), 'i'))
        }
      }
    },
    { $sort: { name: 1, ext: 1 } },
    { $skip: page * limit },
    { $limit: limit },
    { $project: { fileType: 1, name: 1, ext: 1, tags: 1 } }
  ]).then(files => res.json(files))
    .catch(err => (console.log(err), res.sendStatus(400)));
});

function browseType (req) {
  return new Promise((resolve, reject) => {
    let page = 0,
      limit = 50,
      $match = {
        fileType: req.params.type,
        ext: { $ne: 'avi' }
      };

    if ( req.params.filter ) {
      $match.$or = [
        { path: new RegExp(req.params.filter.toLowerCase(), 'i') },
        { name: new RegExp(req.params.filter.toLowerCase(), 'i') }
      ];
    } // end if

    if ( req.query.page && !isNaN(req.query.page) ) {
      page = parseInt(req.query.page) - 1;
    } // end if

    if ( req.query.perPage && !isNaN(req.query.perPage) ) {
      limit = parseInt(req.query.perPage);
    } // end if

    if ( page < 0 ) {
      page = 0;
    } // end if

    if ( req.query.tags ) {
      $match.tags = {
        $in: req.query.tags.toLowerCase().split(',').map(t => t.trim())
      };
    } // end if

    File.aggregate([
      { $match },
      { $sort: { name: 1, ext: 1 } },
      { $skip: page * limit },
      { $limit: limit },
      { $project: { fileType: 1, name: 1, ext: 1, tags: 1 } }
    ]).then(files => resolve(files))
      .catch(err => (console.log(err), reject(400)));
  });
}

module.exports = router;
