export const displayMap = function (locations) {
  // set initial map settings
  const map = L.map('map', {
    attributionControl: false,
    zoomControl: false,
    scrollWheelZoom: false,
    doubleClickZoom: true,
    zoomSnap: 0.1,
  });

  // add layer
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // add controls
  L.control.zoom({ position: 'topright' }).addTo(map);

  // set bounds and marker icon
  const bounds = L.latLngBounds();
  const icon = L.icon({
    iconUrl: '/static/img/icons/pin.png',
    iconSize: [20, 25],
    iconAnchor: [10, 25],
    popupAnchor: [0, -25],
  });
 
  // add to each location a marker and push bounds
  locations.forEach((loc) => {
    const coord = loc.coordinates.reverse();
    bounds.extend(coord);
    L.marker(coord, { icon }).bindPopup(`<p>${loc.name}</p>`).addTo(map);
  });

  // set map to boundaries
  map.fitBounds(bounds.pad(30));
};
