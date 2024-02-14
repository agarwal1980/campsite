document.addEventListener('DOMContentLoaded', function () {
    // Create a Leaflet map
    var map = L.map('map').setView(campgrounds[0].geometry.coordinates, 4);
  
    // Add a tile layer (you can use any tile provider)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
  
    // Create a marker cluster group
    var markersLayer = L.markerClusterGroup();
  
    // Add GeoJSON features to the cluster group
    L.geoJSON(geojsonData, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng).bindPopup(feature.properties.popUpMarkup);
      }
    }).addTo(markersLayer);
  
    // Add the marker cluster group to the map
    map.addLayer(markersLayer);
  });