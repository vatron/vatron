#!/usr/bin/env node
const cli = require('cli')
const fs = require('fs')

var date = new Date();

// prototype
// {
//   "icao": {
//     "name": "rip",
//     "lat": 00,
//     "lng": 000
//   }
// }
var out = {
  _info: {
    build: date.toString(),
    cycle: ""
  }
}

cli.withStdinLines(function(lines, newline) {
  out._info.cycle = lines[0].substring(2, 6)

  lines.removeIf(item => item.split(',')[0] != 'A')
  for(var i = 0; i < lines.length; i++) {
    var aptInfo = lines[i].split(',')
    out[aptInfo[1]] = {
      name: aptInfo[2],
      lat: new Number(aptInfo[3]),
      lng: new Number(aptInfo[4])
    }
  }

  fs.writeFile('./navdata/airports.json', JSON.stringify(out), 'utf-8')
})

// modified from https://stackoverflow.com/a/15996017
Array.prototype.removeIf = function(callback) {
    var i = this.length
    while (i--) {
        if (callback(this[i])) {
            this.splice(i, 1)
        }
    }
}
