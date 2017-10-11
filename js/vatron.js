const path = require('path')
const remote = require('electron').remote

// all available servers that serve vatsim network data
var vatsimDataServers = [
  'http://info.vroute.net/vatsim-data.txt',
  'http://data.vattastic.com/vatsim-data.txt',
  'http://vatsim.aircharts.org/vatsim-data.txt',
  'http://wazzup.flightoperationssystem.com/vatsim/vatsim-data.txt'
]
var vatsimClients = []

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
    streetViewControl: false
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
  vatsimClients.forEach(function(client) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(client.lat, client.lng),
      icon: path.join(__dirname, 'icons/plane_shadowed.svg'),
      map: map
    })
  })
}

$("#quit").on('click', () => {
  remote.getCurrentWindow().close()
})
