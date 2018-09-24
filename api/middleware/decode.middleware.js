'use strict';

const router = require('express')(),
  moment = require('moment'),
  jwt = require('jwt-simple'),
  secret = require('../../config').secret;

router.use((req, res, next) => {
  // auth access
  if ( req.query.auth ) {
    req.headers.auth = req.query.auth;
  } // end if

  try {
    req.auth = jwt.decode(req.headers.auth, secret);
  } catch (e) {
    console.log(e.toString());
    return res.sendStatus(401);
  } // end try-catch

  // checkout access
  if ( req.query.keycard ) {
    req.headers.keycard = req.query.keycard;
  } // end if

  if ( req.headers.keycard ) {
    try {
      req.keycard = jwt.decode(req.headers.keycard, secret);
      // if ( req.headers.range ) {
      //   let section = req.headers.range.replace(/bytes=(\d+)\-/, '$1') / 32768;
      //   if (
      //     (section === 0 && moment().isAfter(moment.unix(req.keycard.exp))) ||
      //     moment.unix(req.keycard.exp)
      //       .isBefore(moment().subtract(30 * section, 'm'))
      //   ) {
      //     throw new Error('Expired token');
      //   } // end if
      // } // end if
      console.log(req.keycard);
    } catch (e) {
      console.log(e.toString());
    } // end try-catch
  } // end if

  if ( req.auth.username === 'testuser' ) {
    // return res.sendStatus(401);
  } // end if

  console.log(`${req.auth.username} is accessing ${req.originalUrl}`);
  next();
});

module.exports = router;
