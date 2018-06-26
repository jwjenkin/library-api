'use strict';

const mongoose = require('mongoose'),
  user = 'jwjenkin',
  pass = 'sir5idea4haul';

mongoose.connect(`mongodb://${user}:${pass}@jenkins-library-shard-00-00-6vumr.mongodb.net:27017,jenkins-library-shard-00-01-6vumr.mongodb.net:27017,jenkins-library-shard-00-02-6vumr.mongodb.net:27017/test?ssl=true&replicaSet=jenkins-library-shard-0&authSource=admin`, { useMongoClient: true });
mongoose.Promise = global.Promise;

module.exports = mongoose;