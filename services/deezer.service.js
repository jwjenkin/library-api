'use strict'

const http = require('https'),
  { AsyncSubject } = require('rxjs'),
  { map } = require('rxjs/operators'),
  config = require('./config').deezer;

module.exports = class DeezerService {

  constructor() {
    this.appId = config.appId;
    this.redirectUri = config.redirectUri;
    this.secret = process.env.DEEZER_SECRET || 'some-secret-key';
    this.url = config.url;
  }

  authorise() {
    return `${this.url}/oauth/auth.php?app_id=${this.appId}` +
      `&redirect_uri=${this.redirectUri}&perms=offline_access,email`;
  }

  authenticate(code) {
    const params = `app_id=${this.appId}&secret=${this.secret}&code=${code}`;
    return this.get(`${this.url}/oauth/access_token.php?${params}`).pipe(
      map(response => {
        const authData = {};
        const data = response.split('&');
        console.log(data);
        for ( const d in data ) {
          const keyValuePair = d.split('=');
          console.log(keyValuePair);
          authData[d[0]] = d[1];
        } // end for
        return authData;
      })
    );
  }

  search(term) {

  }

  get(url, options = {}) {
    const response = new AsyncSubject();
    http.get(url, options, (res) => {
      let data = '';

      res.on('data', d => process.stdout.write(d));
      res.on('complete', () => {
        response.next(data);
        response.complete();
      });
    }).on('error', err => {
      const message = {
        statusCode: err.statusCode,
        statusMessage: err.statusMessage
      };
      response.error(message);
      response.complete();
    });
    return response;
  }
}
