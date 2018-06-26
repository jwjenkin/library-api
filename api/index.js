'use strict';

const router = require('express')();

router.use('/session', require('./session'));

router.use(require('./middleware/decode.middleware'));

router.use('/browse', require('./browse'));
router.use('/files', require('./files'));
router.use('/users', require('./users'));

module.exports = router;