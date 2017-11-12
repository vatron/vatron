const path = require('path')
const {remote, shell} = require('electron')
const Store = require('./js/store.js')
const Friends = require('./js/friends.js')
const InfoPane = require('./js/infopane.js')
const PosRep = require('./js/posrep.js')
const WindowControls = require('./js/window-controls.js')
const Map = require('./js/map.js')

// all available servers that serve vatsim network data
var vatsimDataServers = [
  'http://info.vroute.net/vatsim-data.txt',
  'http://data.vattastic.com/vatsim-data.txt',
  'http://vatsim.aircharts.org/vatsim-data.txt',
  'http://wazzup.flightoperationssystem.com/vatsim/vatsim-data.txt'
]
var vatsimClients = []
var clientMarkers = []

var firMappings;
$.getJSON('https://gitlab.com/andrewward2001/vatron/raw/master/fir_data/aliass.json', function(data) {
  console.log("FIR Data loaded from GitLab repo")
  firMappings = data
  loadData()
}).fail(function() {
  firMappings = $.getJSON(path.join(__dirname, '/fir_data/alias.json'), function(data) {
    firMappings = data
    loadData()
  })
})

let friends = new Friends()
let friendsList = friends.list
console.log(friendsList)

let windowControls = new WindowControls($)

// wait for the application to load before trying to do things
$(document).ready(function() {
  windowControls.start()
  setInterval(function() {
    loadData()
  }, 60000)
});

// change markers based on zoom level
google.maps.event.addListener(Map, 'zoom_changed', function() {
  if(Map.getZoom() >= 4) setMarkerPlanes()
  if(Map.getZoom() < 4) setMarkerDots()
})

var willUpdate = false
function loadData() {
  var serv = Math.floor(Math.random()*4)
  console.log(`Using data from: ${vatsimDataServers[serv]}`)
  $.ajax({
    type: 'GET',
    url: vatsimDataServers[serv],
    dataType: 'text',
    success: function(data) {
      vatsimClients = [] // ensures the clients array doesn't get infinitely large

      var generalData = data.indexOf('!GENERAL:')
      var dataFrom = data.substring(generalData + 45, generalData + 60)
      $('#data-time').html(dataFrom.substring(8,10) + ":" + dataFrom.substring(10,12) + "z")
      generalData = "" // variables no longer used, so clear them

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
        if((clientSplit[37] >= dataFrom && willUpdate == true) || willUpdate == false) {
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
            heading: clientSplit[38],
            marker: null,
            online: true
          }
          vatsimClients.push(tmpToAdd)
        }
      }
    }
  }).done(function(d) {
    updateMap()
  })
}

function placeMarkers() {
  vatsimClients.forEach(function(client) {
    placeMarker(client)
  })
}

function placeMarker(client) {
  if(client.clientType == "PILOT") {
    let icon = planeSVG(client.heading, parseInt(client.cid))
    if(Map.getZoom() < 4) icon = dotSVG(parseInt(client.cid))
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(client.lat, client.lng),
      icon: icon,
      map: Map,
      title: client.cid
    })
    marker.addListener('click', function() { onOpenPilotInfo(client) }) // breaks if you pass addListener the onOpenInfo function directly
    client.marker = marker
    clientMarkers.push(marker)
  }

  if(client.clientType == "ATC" && client.frequency != "199.998" && client.callsign.indexOf('CTR') != -1) {
    var nameSplit = client.callsign.split("_")
    if(firMappings !== 'undefined' && firMappings.hasOwnProperty(nameSplit[0])) {
      $.getJSON(path.join(__dirname, `/fir_data/${firMappings[nameSplit[0]]}.json`), function(json) {
        json.features[0].properties.callsign = client.callsign
        console.log(json.features[0].properties)
        Map.data.addGeoJson(json)
        Map.data.setStyle({
          strokeWeight: 1
        })
        Map.data.addListener('click', function(e) { onOpenAtcInfo(e.feature.getProperty('callsign')) })
      })
    } else if(firMappings === 'undefined') {
      placeMarker(client)
    }
  }

  if(friends.isFriend(client.cid)) {
    $('#friendsListAppend').append(`
      <tr class="friendsEntry">
        <td>${client.name} (${client.cid})</td>
        <td>${client.callsign}</td>
        <td>${client.depApt} &rarr; ${client.arrApt}</td>
      </tr>
    `)
  }
}

function updateMap() {
  for(var i = 0; i < clientMarkers.length; i++) {
    clientMarkers[i].setMap(null)
  }
  clientMarkers = []

  Map.data.forEach(function(feature) {
    Map.data.remove(feature)
  })

  placeMarkers()
}

function planeSVG(rotationDeg, cid) {
  if(friends.isFriend(cid)) {
    var fill = "#af9162"
    var stroke = "#9B7C4D"
  } else {
    var fill = "#ccc"
    var stroke = "#eee"
  }

  return {
    path: 'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z',
    strokeColor: fill,
    fillColor: stroke,
    fillOpacity: 1,
    'rotation': parseInt(rotationDeg)
  }
}

function dotSVG(cid) {
  if(friends.isFriend(cid)) {
    var stroke = "#9B7C4D"
  } else {
    var stroke = "#eee"
  }

  return {
    path: 'M-3,0a3,3 0 1,0 6,0a3,3 0 1,0 -6,0',
    fillColor: stroke,
    fillOpacity: 1,
    strokeOpacity: 0
  }
}

function setMarkerDots() {
  for(var i = 0; i < clientMarkers.length; i++) {
    clientMarkers[i].setIcon(dotSVG(parseInt(clientMarkers[i].getTitle())))
  }
}

function setMarkerPlanes() {
  for(var i = 0; i < clientMarkers.length; i++) {
    clientMarkers[i].setIcon(planeSVG(parseInt(clientMarkers[i].getTitle())))
  }
}

var isAlreadyOpen = false;
function onOpenPilotInfo(c) {
  if(!isAlreadyOpen){
    isAlreadyOpen = true

    var addFriendStr
    if(!friends.isFriend(c.cid)) {
      addFriendStr = `<a href="#" id="addFriend" data-cid="${c.cid}" class="card-link">Add Friend</a>`
    } else {
      addFriendStr = `<a href="#" id="rmFriend" data-cid="${c.cid}" class="card-link">Remove Friend</a>`
    }

    var info = new InfoPane("pilot")

    $('.row.fluid').prepend(info.build(c, addFriendStr))
    $('#map').toggleClass('col-6 col-md-8 col-xl-9')
  } else {
    // resets window and calls the function again
    closeInfo()
    onOpenPilotInfo(c)
  }
}

function onOpenAtcInfo(n) {
  if(!isAlreadyOpen){
    isAlreadyOpen = true
    var c = vatsimClients.find(function(element) {
      return element.callsign == n
    })

    var addFriendStr
    if(!friends.isFriend(c.cid)) {
      addFriendStr = `<a href="#" id="addFriend" data-cid="${c.cid}" class="card-link">Add Friend</a>`
    } else {
      addFriendStr = `<a href="#" id="rmFriend" data-cid="${c.cid}" class="card-link">Remove Friend</a>`
    }

    let info = new InfoPane("atc")

    $('.row.fluid').prepend(info.build(c, addFriendStr))
    $('#map').toggleClass('col-6 col-md-8 col-xl-9')
  } else {
    // resets window and calls the function again
    closeInfo()
    onOpenAtcInfo(n)
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

$('#reloadData').on('click', () => {
  updateMap()
})

$(document).on('click', '#addFriend', (e) => {
  var cid = $(e.toElement).attr('data-cid')
  console.log("friendsList: add friend " + cid)
  friendsList.push(parseInt(cid))
  console.log(friendsList)
})

$(document).on('click', '#rmFriend', (e) => {
  var cid = $(e.toElement).attr('data-cid')
  var index = friendsList.indexOf(parseInt(cid))
  friendsList.splice(index, 1)
})

$(document).on('click', 'a[href^="https"]', function(e) {
  e.preventDefault()
  shell.openExternal(this.href)
})

$(document).on('click', '#generatePosRep', function(e) {
  var next = $('#posNext').val()
  console.log(next)
  var nextTime = $('#posNextTime').val()
  var then = $('#posThen').val()
  var thenTime = $('#posThenTime').val()
  var third = $('#posThird').val()
  var mach = $('#posMach').val()
  var alt =  $('#posAlt').val()

  posrep = new PosRep(next, nextTime, then, thenTime, third, mach, alt)
  $('#generatedPosRep').html(posrep.toString())
})
