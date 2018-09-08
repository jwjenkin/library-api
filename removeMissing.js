#!/usr/local/bin/node
'use strict';

const _ = require('lodash'),
  async = require('async'),
  fs = require('fs'),
  Levenshtein = require('levenshtein'),
  unidecode = require('unidecode'),
  File = require('./models/File.model'),
  ProgressService = require('./services/progress.service'),
  limit = 1000;

File.find({}).count().then(numFiles => {
  let pages = Math.ceil(numFiles / limit);
  const progress = new ProgressService(numFiles)

  async.timesLimit(pages, 1, (p, pageCallback) => {
    File.find({}, { path: 1 }).skip(p * limit).limit(limit).then(files => {
      async.eachLimit(files, 10, (f, fileCallback) => {
        progress.increment(f.path.substring(0, 10));
        if ( !fileExists(f.path) ) {
          // console.log(f.path);
          f.remove().then(() => fileCallback())
            .catch(err => (console.log(err), fileCallback()));
        } else {
          fileCallback();
        } // end if
      }, () => pageCallback());
    }).catch(err => (console.log(err), pageCallback()))
  }, () => {
    progress.finish();
    process.exit();
  });
}).catch(err => (console.log(err), process.exit()));

function fileExists(path) {
  try {
    return fs.lstatSync(path).isFile();
  } catch (e) {
    return false;
  } // end try-catch
}
