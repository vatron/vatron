const path = require('path')
const {remote, shell} = require('electron')

// all available servers that serve vatsim network data
var vatsimDataServers = [
  'http://info.vroute.net/vatsim-data.txt',
  'http://data.vattastic.com/vatsim-data.txt',
  'http://vatsim.aircharts.org/vatsim-data.txt',
  'http://wazzup.flightoperationssystem.com/vatsim/vatsim-data.txt'
]
var vatsimClients = []

var firMappings = {
  'ABQ': 'kzab',
  'CHI': 'kzau',
  'BOS': 'kzbw',
  'DC': 'kzdc',
  'DEN': 'kzdv',
  'FTW': 'kzfw',
  'HOU': 'kzhu',
  'IND': 'kzid',
  'JAX': 'kzjx',
  'KC': 'kzkc',
  'LAX': 'kzla',
  'SLC': 'kzlc',
  'MIA': 'kzma',
  'MEM': 'kzme',
  'MSP': 'kzmp',
  'OAK': 'kzoa',
  'CLE': 'kzob',
  'SEA': 'kzse',
  'ATL': 'kztl',
  'NY': 'kzwy'
}

// wait for the application to load before trying to do things
$(document).ready(function() {
  initialize()
  loadData()
  console.log(vatsimClients)
});

var map
function initialize() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 15, lng: 0},
    zoom: 2,
    mapTypeControl: false,
    streetViewControl: false,
    styles: [
      // style from https://developers.google.com/maps/documentation/javascript/examples/style-array
      {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{color: '#263c3f'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{color: '#6b9a76'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{color: '#38414e'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{color: '#212a37'}]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{color: '#9ca5b3'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{color: '#746855'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{color: '#1f2835'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{color: '#f3d19c'}]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{color: '#2f3948'}]
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{color: '#17263c'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{color: '#515c6d'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{color: '#17263c'}]
      }
    ]
  })

}

function loadData() {
  var serv = Math.floor(Math.random()*4)
  console.log(`Using data from: ${vatsimDataServers[serv]}`)
  $.ajax({
    type: 'GET',
    url: vatsimDataServers[serv],
    dataType: 'text',
    success: function(data) {
      var startClients = data.indexOf("!CLIENTS:") + 11 // +11 accounts for length of !CLIENTS: as well as newline and any other characters before the true beginning
      var endClients = data.indexOf("!SERVERS:") - 7 // -7 serves similar purpose as above
      var clientsOnly = data.substring(startClients, endClients)
      var clientsOnlySplit = clientsOnly.split("\n")

      for(var i = 0; i < clientsOnlySplit.length; i++) {

        /* Annotated Client Entry:
        / callsign:cid:realname:clienttype:frequency:latitude:longitude:altitude:groundspeed:planned_aircraft: --> (CONTD.)
        / 0        1   2        3          4         5        6         7        8           9
        / planned_tascruise:planned_depairport:planned_altitude:planned_destairport:server:protrevision:rating:transponder: --> (CONTD.)
        / 10                11                 12               13                  14     15           16     17
        / facilitytype:visualrange:planned_revision:planned_flighttype:planned_deptime:planned_actdeptime: --> (CONTD.)
        / 18           19          20               21                 22              23
        / planned_hrsenroute:planned_minenroute:planned_hrsfuel:planned_minfuel:planned_altairport:planned_remarks: --> (CONTD.)
        / 24                 25                 26              27              28                 29
        / planned_route:planned_depairport_lat:planned_depairport_lon:planned_destairport_lat:planned_destairport_lon: --> (CONTD.)
        / 30            31                     32                     33                      34
        / atis_message:time_last_atis_received:time_logon:heading:QNH_iHg:QNH_Mb:
        / 35           36                      37         38      39      40
        */

        var clientSplit = clientsOnlySplit[i].split(":")
        var tmpToAdd = {
          callsign: clientSplit[0],
          cid: clientSplit[1],
          name: clientSplit[2],
          clientType: clientSplit[3],
          frequency: clientSplit[4],
          lat: clientSplit[5],
          lng: clientSplit[6],
          altitude: clientSplit[7],
          groundspeed: clientSplit[8],
          aircraft: clientSplit[9],
          tas: clientSplit[10],
          depApt: clientSplit[11],
          arrApt: clientSplit[13],
          plnAltitude: clientSplit[12],
          xpdr: clientSplit[17],
          fltType: clientSplit[21],
          plnDepTime: clientSplit[22],
          plnHrsEnroute: clientSplit[24],
          plnMinEnroute: clientSplit[25],
          plnHrsFuel: clientSplit[26],
          plnMinFuel: clientSplit[27],
          remarks: clientSplit[29],
          route: clientSplit[30],
          depAptPos: {
            lat: clientSplit[31],
            lng: clientSplit[32]
          },
          arrAptPos: {
            lat: clientSplit[33],
            lng: clientSplit[34]
          },
          atis: clientSplit[35],
          timeLogon: clientSplit[37],
          heading: clientSplit[38]
        }
        vatsimClients.push(tmpToAdd)
      }
    }
  }).done(function(d) {
    placeMarkers()
  })
}

function placeMarkers() {
  vatsimClients.forEach(function(client, index) {
    if(client.clientType == "PILOT") {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(client.lat, client.lng),
        icon: planeSVG(client.heading),
        map: map
      })
      marker.addListener('click', function() { onOpenPilotInfo(index, marker) }) // breaks if you pass addListener the onOpenInfo function directly
    }

    if(client.clientType == "ATC" && client.frequency != "199.998" && client.callsign.indexOf('CTR') != -1) {
      var nameSplit = client.callsign.split("_")
      if(firMappings.hasOwnProperty(nameSplit[0])) {
        $.getJSON(path.join(__dirname, `/fir_data/${firMappings[nameSplit[0]]}.json`), function(json) {
          json.features[0].properties.callsign = client.callsign
          console.log(json.features[0].properties)
          map.data.addGeoJson(json)
          map.data.addListener('click', function(e) { onOpenAtcInfo(index, e.feature.getProperty('callsign')) })
        })
      //  map.data.addListener('click', function() { onOpenAtcInfo(index) })
      //  google.maps.event.addListener(thisFIR, 'click', function() { onOpenAtcInfo(index) })
      }
    }
  })
}

function planeSVG(rotationDeg) {
  return {
    path: 'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z',
    strokeColor: '#CCC',
    fillColor: '#EEE',
    fillOpacity: 1,
    'rotation': parseInt(rotationDeg)
  }
}

var isAlreadyOpen = false;
function onOpenPilotInfo(i) {
  if(!isAlreadyOpen){
    isAlreadyOpen = true
    var c = vatsimClients[i]
    var name = c.name.split(' ')
    $('.row.fluid').prepend(`
      <div class="col-6 col-md-4 col-xl-3 bg-dark" id="fltInfo">
        <a class="nav-link float-right white" href="#" id="closeFltInfo">&#9932;</a>
        <h4 class="mb-4 mt-1">Flight Info</h4>
        <div class="card mb-3 bg-dark">
          <div class="card-body">
            <h4 class="card-title">${c.callsign}</h4>
            <h6 class="card-subtitle mb-2 text-muted">${name[0]} ${name[1]} (${name[2]}, ${c.cid})</h6>
            <div class="card-text d-flex justify-content-spc"><h5>${c.depApt}</h5><h5>&rarr;</h5><h5>${c.arrApt}</h5></div>
          </div>
          <table class="table">
            <tbody>
              <tr>
                <td colspan="2">
                  <span class="text-muted">Aboard</span><br>
                  <span>${c.aircraft}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="text-muted">Altitude</span><br>
                  <span>${c.altitude}</span>
                </td>
                <td>
                  <span class="text-muted">Planned Altitude</span><br>
                  <span>${c.plnAltitude}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="text-muted">Ground Speed</span><br>
                  <span>${c.groundspeed}</span>
                </td>
                <td>
                  <span class="text-muted">Planned TAS</span><br>
                  <span>${c.tas}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="text-muted">Latitude</span><br>
                  <span>${c.lat}</span>
                </td>
                <td>
                  <span class="text-muted">Longitude</span><br>
                  <span>${c.lng}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="text-muted">Heading</span><br>
                  <span>${c.heading}</span>
                </td>
                <td>
                  <span class="text-muted">Squawk</span><br>
                  <span>${c.xpdr}</span>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <span class="text-muted">Planned Route</span><br>
                  <span>${c.route}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="card-body pt-0">
            <a href="https://stats.vatsim.net/search_id.php?id=${c.cid}" class="card-link">View Stats</a>
          </div>
        </div>
      </div>
    `)
    $('#map').toggleClass('col-6 col-md-8 col-xl-9')
  } else {
    // resets window and calls the function again
    closeInfo()
    onOpenPilotInfo(i)
  }
}

function onOpenAtcInfo(i, n) {
  if(!isAlreadyOpen){
    isAlreadyOpen = true
    var c = vatsimClients.find(function(element) {
      return element.callsign == n
    })
    var name = c.name.split(' ')
    var splitAtis = c.atis.split('^�')
    var finalAtis = ""
    for(var i = 0; i < splitAtis.length; i++) {
      finalAtis += '<p class="atis">' + splitAtis[i] + '</p>'
    }
    console.log(c.atis)
    console.log(splitAtis)
    $('.row.fluid').prepend(`
      <div class="col-6 col-md-4 col-xl-3 bg-dark" id="fltInfo">
        <a class="nav-link float-right white" href="#" id="closeFltInfo">&#9932;</a>
        <h4 class="mb-4 mt-1">Flight Info</h4>
        <div class="card mb-3 bg-dark">
          <div class="card-body">
            <h4 class="card-title">${c.callsign}</h4>
            <h6 class="card-subtitle mb-2 text-muted">${name[0]} ${name[1]} (${c.cid})</h6>
            <h5 class="card-text">${c.frequency}</h5>
          </div>
          <table class="table">
            <tbody>
              <tr>
                <td colspan="2">
                  <span class="text-muted">ATIS Message</span><br>
                  <span>${finalAtis}</span>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <span class="text-muted">Time online</span><br>
                  <span>Online since ${c.timeLogon.substring(8, 10) + ':' + c.timeLogon.substring(10, 12)}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="card-body pt-0">
            <a href="https://stats.vatsim.net/search_id.php?id=${c.cid}" class="card-link">View Stats</a>
          </div>
        </div>
      </div>
    `)
    $('#map').toggleClass('col-6 col-md-8 col-xl-9')
  } else {
    // resets window and calls the function again
    closeInfo()
    onOpenAtcInfo(i, n)
  }
}

function closeInfo() {
  isAlreadyOpen = false
  $('#fltInfo').remove()
  $('#map').toggleClass('col-6 col-md-8 col-xl-9')
}

$(document).on('click', '#closeFltInfo', () => {
  closeInfo()
})

$("#quit").on('click', () => {
  remote.getCurrentWindow().close()
})

var maxed = false;
$("#maximize").on('click', () => {
  if(!maxed) {
    maxed = true
    remote.getCurrentWindow().maximize()
  } else {
    maxed = false
    remote.getCurrentWindow().unmaximize()
  }
})

$("#minimize").on('click', () => {
  remote.getCurrentWindow().minimize()
})

$(document).on('click', 'a[href^="https"]', function(e) {
  e.preventDefault()
  shell.openExternal(this.href)
})
