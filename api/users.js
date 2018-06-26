'use strict';

const router = require('express')(),
  async = require('async'),
  bcrypt = require('bcrypt'),
  User = require('../models/User.model'),
  secret = require('../config').secret;

router.get('/', (req, res) => {
  User.findById(req.auth._id).then(user => res.json(user))
    .catch(err => res.sendStatus(400));
});

router.get('/:userId', (req, res) => {
  User.findById(req.param.userid).then(user => res.json(user))
    .catch(err => res.sendStatus(400));
});

router.post('/update', (req, res) => {
  if ( req.body.password ) {
    delete req.body.password;
  } // end if

  User.findByIdAndUpdate(req.auth._id, req.body, { new: true })
    .then(user => res.json(user))
    .catch(err => res.sendStatus(400));
});

router.post('/update-password', (req, res) => {
  let error;
  if ( !req.body.password ) {
    error = 'Please include current password.';
  } else if ( req.body.password === req.body.newPassword ) {
    error = 'Current and new password cannot match.';
  } else if ( !req.body.newPassword || req.body.newPassword.length < 6 ) {
    error = 'New password must be at least 6 characters.';
  } else if ( req.body.newPassword !== req.body.confirmPassword ) {
    error = 'Please make sure password and confirmation match.';
  } // end if
  
  if ( error ) {
    return res.status(400).json({ error });
  } // end if

  User.findById(req.auth._id, req.body, { new: true })
    .then(user => {
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if ( !valid ) {
            return res.status(400).json({
              error: 'Current password incorrect.'
            });
          } // end if
          
          bcrypt.hash(req.body.newPassword, 10).then(hash => {
            user.password = hash;
            user.save();
            
            res.json({ success: true });
          });
        }).catch(() => res.sendStatus(400));
    }).catch(() => res.sendStatus(400));
});

module.exports = router;