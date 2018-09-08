'use strict';

const app = require('express')(),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  port = 8888;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => res.send(`
Jenkins Library
Login:
  1. POST to /session with username and password (Content-Type: application/json)
  2. Get token and add to header as auth
  3. GET /browse
`));
app.use('/', require('./api'));

app.listen(port, () => console.log(`library listening on port ${port}!`))
