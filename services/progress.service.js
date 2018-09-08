'use strict'

module.exports = class ProgressService {

  constructor(total) {
    this.longestStatusText = 0;
    this.currentDone = 0;
    this.previousPercentage = 0;
    this.currentPercentage = 0;
    this.percentTextIndex = 23;
    
    if ( !(this.total = total) ) {
      this.total = 10;
    } // end if

    process.stdout.write('[                    ] 0%');
  }
  
  increment(statusText) {
    process.stdout.cursorTo(0);
    const percent = Math.floor((this.currentDone++ / this.total) * 100);
    // failsafe if they don't give the correct total
    if ( percent > 100 ) { return; } // end if
    
    if ( percent > this.currentPercentage && percent % 5 === 0 ) {
      this.currentPercentage = percent;
      process.stdout.cursorTo(percent / 5);
      process.stdout.write('#');
    } // end if
    
    if ( this.previousPercentage < percent ) {
      this.previousPercentage = percent;
      this.writePercent(percent);
    } // end if
    
    process.stdout.cursorTo(this.percentTextIndex + 4);
    // process.stdout.write(encode('^[K'));
    if ( statusText ) {
      process.stdout.write(`${statusText}`);
    }  // end if
  }
  
  finish() {
    this.increment();
  }
  
  getCurrentProgress() {
    return this.currentPercentage;
  }
  
  writePercent(percent) {
    process.stdout.cursorTo(this.percentTextIndex);
    process.stdout.write(`${percent}%`);
  }
}

function encode (xs) {
  return new Buffer([ 0x1b ].concat((s) => {
    if (typeof s === 'string') {
      return s.split('').map(ord);
    } else if (Array.isArray(s)) {
      return s.reduce(function (acc, c) {
        return acc.concat(bytes(c));
      }, []);
    } // end if
  }));
}

function extractCodes (buf) {
    var codes = [];
    var start = -1;
    
    for (var i = 0; i < buf.length; i++) {
      if (buf[i] === 27) {
        if (start >= 0) codes.push(buf.slice(start, i));
        start = i;
      } else if (start >= 0 && i === buf.length - 1) {
        codes.push(buf.slice(start));
      } // end if
    } // end for
    
    return codes;
}