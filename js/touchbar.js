const {remote} = require('electron')
const {TouchBar} = remote
const {TouchBarButton, TouchBarSpacer} = TouchBar

const aboutButton = new TouchBarButton({
  label: 'ℹ︎',
  backgroundColor: '#333',
  click: () => {
    $('#about').modal('show')
  }
})
const settingsButton = new TouchBarButton({
  label: '⚙️',
  backgroundColor: '#333',
  click: () => {
    $('#settings').modal('show')
  }
})
const flightButton = new TouchBarButton({
  label: '✈️',
  backgroundColor: '#333',
  click: () => {
    $('#flights').modal('show')
  }
})

const friendsButton = new TouchBarButton({
  label: '👬',
  backgroundColor: '#333',
  click: () => {
    $('#friendsList').modal('show')
  }
})
const posRepButton = new TouchBarButton({
  label: '📍',
  backgroundColor: '#333',
  click: () => {
    $('#posrep').modal('show')
  }
})

const refreshButton = new TouchBarButton({
  label: '⟳',
  backgroundColor: '#333',
  click: () => {
    /*jshint -W117*/
    updateMap()
    /*jshint +W117*/
  }
})

const touchBar = new TouchBar([
  aboutButton,
  settingsButton,
  flightButton,
  new TouchBarSpacer({size: 'large'}),
  friendsButton,
  posRepButton,
  new TouchBarSpacer({size: 'large'}),
  refreshButton
])

remote.getCurrentWindow().setTouchBar(touchBar)
