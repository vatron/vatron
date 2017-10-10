// wait for the application to load before trying to do things
$(document).ready(function() {
  initialize()
});

function initialize() {

  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 15, lng: 0},
    zoom: 2,
    mapTypeControl: false,
    streetViewControl: false
  });

}
