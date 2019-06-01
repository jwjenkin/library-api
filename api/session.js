'use strict';

const router = require('express')(),
  bcrypt = require('bcrypt'),
  jwt = require('jwt-simple'),
  moment = require('moment'),
  User = require('../models/User.model'),
  secret = require('../config').secret;

router.post('/', (req, res) => {
  User.findOne({ username: req.body.username }, { username: 1, password: 1 })
    .then(user => {
      if ( !user ) {
        console.log('no user found');
        return res.sendStatus(401);
      } // end if
      
      bcrypt.compare(req.body.password, user.password).then(valid => {
        if ( !valid ) {
          console.log('password incorrect');
          return res.sendStatus(401);
        } // end if
       	const exp = moment().add(1, req.body.username === 'testuser' ? 'hour' : 'week').unix(); 
        const payload = {
          _id: user._id,
          username: user.username,
          exp: moment().add(1, 'week').unix()
        };
        
        console.log(payload);
        
        res.json({ token: jwt.encode(payload, secret, 'HS512') });
      });
    }).catch(err => (console.log(err), res.sendStatus(401)));
});

module.exports = router;
