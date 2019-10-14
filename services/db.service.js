'use strict';

const mongoose = require('mongoose'),
  user = process.env.LIBRARY_MONGO_USER || 'username',
  pass = process.env.LIBRARY_MONGO_PASS || 'password',
  url = process.env.LIBRARY_MONGO_URL || 'localhost:27017';

mongoose.connect(`mongodb://${user}:${pass}@${url}`, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;

module.exports = mongoose;
