// Create a map using Leaflet that plots all of the earthquakes from your data set based on their longitude and latitude.


// Your data markers should reflect the magnitude of the earthquake in their size and color. Earthquakes with higher magnitudes should appear larger and darker in color.
// Include popups that provide additional information about the earthquake when a marker is clicked.
// Create a legend that will provide context for your map data.
// Your visualization should look something like the map above.

var API_KEY = 'pk.eyJ1IjoiZHVja3NveCIsImEiOiJjanowaDlhYmEwY2htM2xsOHVkcjFmMTQ3In0.K3IY9V_ok30CDEHLyJ8z9g'

// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

// Create the map
var map = L.map("map", {
    center: [40.73, -89.0059],
    zoom: 4
  });

// Add our 'lightmap' tile layer to the map
lightmap.addTo(map);

  
var APILink = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// Grab data with d3
d3.json(APILink, function(data) {

    // Crafting the styling that will be applied to each circle marker
    function circleStyling(entry) {
        return {
            color: circleColor(entry.properties.mag),
            radius: entry.properties.mag * 5, 
            opacity: 1,
            fillOpacity: 1
        };
    }

    // Create a popup for each marker
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p> Magnitude: " + (feature.properties.mag) + "</p>");
    }


    // Your data markers should reflect the magnitude of the earthquake in their size and color. Earthquakes with higher magnitudes should appear larger and darker in color.
    // To get the circle to style radius and color, a separate function must be called

    // Generating a stepped color array
    function circleColor(mag) {
        if (mag > 5) {
            return '#d91a1a';
        } else if (mag > 4) {
            return '#d95a1a';
        } else if (mag > 3) {
            return '#d9991a';
        } else if (mag > 2) {
            return '#a3d91a';
        } else if (mag > 1) {
            return '#3dd91a';
        } else {
            return '#1ad6d9';
        }
    }

    // Creating the actual markers
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng);
        },
        // Call the styling and the popup binder
        style: circleStyling,
        onEachFeature: onEachFeature
      }).addTo(map);

    // Set up the legend
    // Create a legend that will provide context for your map data.
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        // Colors copied from above
        var colors = ['#d91a1a','#d95a1a', '#d9991a', '#a3d91a', '#3dd91a', '#1ad6d9'] 
        
        // Defining what will go into the html part of the legend
        var legendInfo = "<h1>Magnitude Color Code:</h1>" + 
        "<div class=\"labels\">" +
        "<box style='background: " + colors[0] + "'></i>" + ' 5+' + "<br>" +
        "<box style='background: " + colors[1] + "'></i>" + ' 4-5' + "<br>" +
        "<box style='background: " + colors[2] + "'></i>" + ' 3-4' + "<br>" +
        "<box style='background: " + colors[3] + "'></i>" + ' 2-3' + "<br>" +
        "<box style='background: " + colors[4] + "'></i>" + ' 1-2' + "<br>" + 
        "<box style='background: " + colors[5] + "'></i>" + ' 0-1' + "</div>" +
        "</div>";

        div.innerHTML = legendInfo;
        return div;
    }

    // The reason my legend wasn't showing up was because i hadn't added it yet
    // Never mind, there were other issues
    // CSS wasn't properly classed for the legend.
    // Colors are showing up, that's good enough for me
    legend.addTo(map);

});