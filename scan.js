#!/usr/bin/node
'use strict';

const _ = require('lodash'),
  async = require('async'),
  fs = require('fs'),
  Levenshtein = require('levenshtein'),
  unidecode = require('unidecode'),
  File = require('./models/File.model'),
  ProgressService = require('./services/progress.service'),
  allowedFiles = {
    audio: [ 'flac', 'm4a', 'mp3', 'wav', 'wma' ],
    video: [ 'avi', 'mkv', 'mp4', 'mov' ],
    book: [ 'pdf', 'epub', 'mobi', 'cbr', 'cbz', 'lit' ]
  },
  allowedCategories = Object.keys(allowedFiles);

let  directories = [
    'newDownloads',
    //'Books',
    //'Movies',
    //'Music',
    //'TV Shows'
  ];
if ( process.argv.length === 3 ) {
  directories = [ process.argv.pop().replace('/media/', '') ];
} // end if

let fileList = [],
  startTime = Date.now();

async.eachLimit(directories, 2, (mediaDir, directoryCallback) => {
  console.log('loading files in', mediaDir);
  const currentDirectory = `/media/${mediaDir}`,
    sectionStartTime = Date.now();
  readDirectory(currentDirectory).then(f => {
    timeElapsed(sectionStartTime, `done with ${mediaDir} in`);
    fileList = fileList.concat(f);
    directoryCallback();
  }).catch(err => directoryCallback());
}, () => {
  timeElapsed(startTime, 'files aggregated in');
  const totalFiles = fileList.length;
  console.log('Starting db updates: ', `${totalFiles} files`);
  const progress = new ProgressService(totalFiles);

  async.eachLimit(fileList, 10, (f, fileCallback) => {
    try {
      let pathParts = f.path.replace('/media/', '')
          .replace(/([A-Za-z0-9]{1})\-([A-Za-z0-9]{1})/g, '$1 $2')
          .replace(/_/g, ' ')
          // remove spaces more than 1
          .replace(/[\s]{2,}/g, ' ')
          // uppercase each word
          .replace(/(^|\s)[a-z]/g, (file) => file.toUpperCase())
          .trim()
          .split('/'),
        fileName = pathParts.pop(),
        nameParts = fileName.split('.');

      f.ext = nameParts.pop();
      f.name = nameParts.join(' ');

      // TAGGING
      // remove tag if it is close to being the same as the file
      if ( new Levenshtein(fileName, pathParts[ pathParts.length - 1 ]).distance < 5 ) {
        pathParts.pop();
      } // end if
      // set tags all lowercase
      f.tags = _.uniq(pathParts).map(t => t.toLowerCase()).filter(t => t.length > 1);
    } catch(e) {
      console.log('issue', e);
      process.exit();
    } // end try-catch

    File.findOneAndUpdate({ name: f.name, ext: f.ext }, f).then(media => {
      if ( !!media ) {
        progress.increment('update');
        return fileCallback();
      } // end if

      new File(f).save().then(() => {
        progress.increment('create');
        fileCallback();
      }).catch(err => (console.log(err), fileCallback()));
    }).catch(err => (console.log('err', f.name, err), process.exit()));
  }, () => {
    progress.finish();
    console.log();
    timeElapsed(startTime, `${totalFiles} in`);
    process.exit();
  });
});

function readDirectory(directory) {
  const files = [];
  return new Promise(resolve => {
    fs.readdir(directory, (err, mediaList) => {
      if ( err ) {
        return resolve([]);
      } // end if

      async.eachLimit(mediaList, 20, (media, mediaCallback) => {
        const file = `${directory}/${media}`;

        if ( isDir(file) ) {
          readDirectory(file)
            .then(f => (files = files.concat(f), mediaCallback()))
            .catch(err => (console.log('read dir err', err), mediaCallback()));
        } else {
          const fileType = getFileType(file.split('.').pop().toLowerCase()),
	    filename = file.split('/').pop();
          if ( !!fileType && filename.indexOf('.') !== 0 ) {
            if ( !!_.find(files, [ 'path', file ]) ) {
              console.log(file, 'already in array');
            } // end if
            files.push({ path: file, fileType });
          } // end if

          mediaCallback();
        } // end if
      }, () => resolve(files));
    });
  });
}

function isDir(path) {
  try {
    return fs.lstatSync(unidecode(path)).isDirectory();
  } catch (e) {
    return false;
  } // end try-catch
}

function getFileType(ext) {
  for ( let t of allowedCategories ) {
    if ( allowedFiles[t].indexOf(ext) > -1 ) { return t; } // end if
  } // end for

  return null;
}

function timeElapsed(start, label) {
  const elapsed = `${(Date.now() - startTime) / 1000} seconds`;
  if ( label ) {
    console.log(label, elapsed);
    return;
  } // end if

  console.log(elapsed);
}
