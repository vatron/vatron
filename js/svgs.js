/*globals friends,google */
class SVGs {
  planeSVG(rotationDeg, cid) {
    let fill = friends.isFriend(cid) ? '#af9162' : '#ccc'
    let stroke = friends.isFriend(cid) ? '#9B7C4D' : '#eee'

    return {
      path: 'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z',
      strokeColor: fill,
      fillColor: stroke,
      fillOpacity: 1,
      rotation: parseInt(rotationDeg),
      anchor: new google.maps.Point(12.5,12.5),
      scaledSize: new google.maps.Size(25,25)
    }
  }

  dotSVG(rotationDeg, cid) {
    let stroke = friends.isFriend(cid) ? '#9B7C4D' : '#eee'

    return {
      path: 'M-3,0a3,3 0 1,0 6,0a3,3 0 1,0 -6,0',
      fillColor: stroke,
      fillOpacity: 1,
      strokeOpacity: 0,
      rotation: parseInt(rotationDeg)
    }
  }

  markerSVG() {
    return {
      path: 'm7.93077,20.46444c0,0 -11.21265,-17.51976 -0.30034,-17.61987c10.91231,-0.10011 0.30034,17.61987 0.30034,17.61987z',
      strokeColor: '#44CC44',
      fillOpacity: 0,
      strokeOpacity: 1,
      strokeWeight: 3,
      anchor: new google.maps.Point(7.5,25),
      scaledSize: new google.maps.Size(15,25)
    }
  }
}

module.exports = SVGs
