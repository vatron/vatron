const GJV = require('geojson-validation')
const fs = require('fs')
const path = require('path')

let geojsonIndex = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'fir_data/alias.json')))

for(let key in geojsonIndex) {
  if(geojsonIndex.hasOwnProperty(key) && key.substring(0,1) === '_') {
    delete geojsonIndex[key]
    break
  }
}

for(let key in geojsonIndex) {
  let jsonPath = path.join(__dirname, '..', 'fir_data/', geojsonIndex[key] +'.json')
  console.log('Testing in fir_data key ' + key + '...')
  if(GJV.valid(JSON.parse(fs.readFileSync(jsonPath)))) {
    console.log('valid')
  } else throw 'Invalid JSON file: ' + key
}
