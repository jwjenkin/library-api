'use strict'

const http = require('https'),
  fs = require('fs'),
  { AsyncSubject, of, throwError } = require('rxjs'),
  { switchMap } = require('rxjs/operators'),
  config = require('../config').deezer;

module.exports = class DeezerService {

  constructor() {
    this.accessToken = 'blank';
    fs.readFile('./.access_token', (err, data) => {
      if ( err ) {
        console.log(err);
      } // end if

      this.accessToken = data.toString();
    });

    this.appId = config.appId;
    this.apiUrl = config.apiUrl;
    this.authUrl = config.authUrl;
    this.redirectUri = config.redirectUri;
    this.secret = process.env.DEEZER_SECRET || 'some-secret-key';
  }

  authorise() {
    return `${this.authUrl}/oauth/auth.php?app_id=${this.appId}` +
      `&redirect_uri=${this.redirectUri}&perms=offline_access,email`;
  }

  authenticate(code) {
    const params = `app_id=${this.appId}&secret=${this.secret}&code=${code}`;
    return this.get(`${this.authUrl}/oauth/access_token.php?${params}`).pipe(
      switchMap(response => {
        if ( response === 'wrong code') {
          return throwError({ message: response });
        } // end if

        const authData = {};
        const data = response.split('&');
        for ( const d of data ) {
          const keyValuePair = d.split('=');
          authData[keyValuePair[0]] = keyValuePair[1];
        } // end for
        return of(authData);
      })
    );
  }

  search(term) {
    return this.get(`${this.apiUrl}/search?q=${encodeURI(term)}`, { json: true });
  }

  get(url, options = {}) {
    const response = new AsyncSubject();
    // inject access_token
    url += `${url.includes('?') ? '&' : '?'}access_token=${this.accessToken}`;

    http.get(url, (res) => {
      res.setEncoding('utf8');
      let data = '';
      let error = false;

      if ( res.statusCode >= 400 ) {
        error = true;
      } // end if

      res.on('data', d => data += d);
      res.on('end', () => {
        if ( options.json ) {
          try {
            data = JSON.parse(data);
          } catch ( e ) {
            response.error(e);
            response.complete();
            return;
          } // end try-catch
        } // end if
        error ?
          response.error({ message: data }) :
          response.next(data);

        response.complete();
      });
    }).on('error', err => {
      response.error(`Request Error: ${err}`);
      response.complete();
    });
    return response;
  }
}
