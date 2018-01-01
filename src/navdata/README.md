# Vatron /navdata
This folder contains nav data like airports to draw on the map. Source data should be provided in X-Plane GNS430 (.txt) format. Available from Navigraph as `X-Plane GNS430, 777 Worldliner (Ext/Prof), Flightfactor B757 Professional, VMAX B767-300ER Professional, X-Crafts Embraer E-175, Aerobask Aircrafts, JRollon Planes CRJ200 - native`. Only required data will be parsed into JSON.

To build new navdata, run `yarn run make-navdata`. This process shouldn't take too long (usually less than 5 seconds). You can also build specific nav data:
* Airports: `node navdata/airports_parse.js < navdata/airports.txt`
* Waypoints: `node navdata/waypoints_parse.js < navdata/waypoints.txt`

### Notice
The source navdata from Navigraph can't be included in this project due to copyright reasons. Please only commit parsed JSON files. I've included these files in .gitignore for this reason.
