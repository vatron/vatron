#!/usr/bin/env node
const cli = require('cli')
const fs = require('fs')

var date = new Date();

// prototype
// {
//   "wpt": {
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

  for(var i = 0; i < lines.length; i++) {
    var aptInfo = lines[i].split(',')
    out[aptInfo[0]] = {
      lat: new Number(aptInfo[1]),
      lng: new Number(aptInfo[2])
    }
  }

  fs.writeFile('./navdata/waypoints.json', JSON.stringify(out), 'utf-8')
})
