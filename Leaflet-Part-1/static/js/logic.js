// Define a map object.
var map = L.map("map", {
  center: [39.04876983076366, -97.00407400444857],
  zoom: 2,
  //layers:[streets, grayscale]
});

// var streets = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   maxZoom: 19,
//   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// });
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// var grayscale = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
// 	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// 	subdomains: 'abcd',
// 	minZoom: 0,
// 	maxZoom: 20,
// 	ext: 'png'
// });

// var waterColor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
// 	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// 	subdomains: 'abcd',
// 	minZoom: 1,
// 	maxZoom: 16,
// 	ext: 'jpg'
// });


// link to Json data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// GET request to the query URL/
d3.json(url).then(function (data) {

  function styleInfo(features) {
    return {
      radius: markerSize(features.properties.mag),
      color: 'black',
      fillColor: colorWheel(features.geometry.coordinates[2]),
      weight: 0.5,
      fillOpacity: 0.8
    };
  }
  // create marker size function for the magnitude of the earthquake
  function markerSize(mag) {

    return Math.sqrt(mag) * 10;

  }

  // create function based on depth of the earthquake
  function colorWheel(coordinate) {
    if (coordinate > 90) return '#fc4e2a';
    else if (coordinate > 70) return '#fd8d3c';
    else if (coordinate > 50) return '#feb24c';
    else if (coordinate > 30) return '#fed976';
    else if (coordinate > 10) return '#d9f0a3';
    else return '#addd8e';
  }

  //use geoJson to draw map elements 
  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      console.log(data);
      return L.circleMarker(latlng);
    },
    style: styleInfo,


    onEachFeature: function (feature, layer) {
      layer.on({


      })
      layer.bindPopup("<h1>" + feature.properties.place + "</h1> <hr> <h2>" + "Magnitude: " + feature.properties.mag + "</h2>");
    }
  }).addTo(map)
});

var legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {

  var div = L.DomUtil.create('div', 'info legend'),
    grades = [-10, 10, 30, 50, 70, 90];
  color = ['#addd8e', '#d9f0a3', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a']

  // loop through the density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + color[i] + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

legend.addTo(map);

let gUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

d3.json(gUrl).then(function (pData) {
  L.geoJson(pData).addTo(map)
});
