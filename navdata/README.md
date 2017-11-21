# Vatron /navdata
This folder contains nav data like airports to draw on the map. Source data should be provided in X-Plane GNS430 (.txt) format. Available from Navigraph as `X-Plane GNS430, 777 Worldliner (Ext/Prof), Flightfactor B757 Professional, VMAX B767-300ER Professional, X-Crafts Embraer E-175, Aerobask Aircrafts, JRollon Planes CRJ200 - native`. Only Airports.txt is currently supported to be parsed into JSON.

To build a new `airports.json` file, place `Airports.txt` in the navdata folder. From there, run `yarn run make-apt` from the project root. This is a fast process that should take shouldn't take any more than a few seconds.

### Notice
The source navdata from Navigraph can't be included in this project due to copyright reasons. Please only commit parsed JSON files. I've included these files in .gitignore for this reason.
