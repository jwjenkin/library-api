'use strict';

const app = require('express')(),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  port = 8888;

app.use(cors());
app.use(bodyParser.json());

app.all('/*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/', (req, res) => res.send(`
Jenkins Library
Login:
  1. POST to /session with username and password (Content-Type: application/json)
  2. Get token and add to header as auth
  3. GET /browse
`));
app.use('/', require('./api'));

app.listen(port, () => console.log(`library listening on port ${port}!`))
