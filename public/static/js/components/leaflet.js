// Set marker icon
const icon = L.icon({
  iconUrl: '/static/img/icons/pin.png',
  iconSize: [20, 25],
  iconAnchor: [10, 25],
  popupAnchor: [0, -25],
});

// Set initial map settings
const map = L.map('map', {
  attributionControl: false,
  zoomControl: false,
  scrollWheelZoom: false,
  doubleClickZoom: true,
  zoomSnap: 0.1,
});

export const displayMap = function (locations) {
  // add layer
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // add controls
  L.control.zoom({ position: 'topright' }).addTo(map);

  if (locations?.length) {
    // set bounds
    const bounds = L.latLngBounds();

    // add to each location a marker and push bounds
    locations.forEach((loc) => {
      const coord = loc.coordinates.reverse();
      bounds.extend(coord);
      L.marker(coord, { icon }).bindPopup(`<p>${loc.name}</p>`).addTo(map);
    });

    // set map to boundaries
    map.fitBounds(bounds.pad(30));
  } else
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coord = pos.coords;
        map.setView([coord.latitude, coord.longitude], 8);
      },
      () => {
        map.setView([51.505, -0.09], 8);
      }
    );
};

// One marker can be added and reset the same marker (when the user select a position with click on map)
const _setTheMarker = (() => {
  const marker = L.marker([0, 0], { icon });
  let setToMap = false;
  return function (coord) {
    marker.setLatLng(coord);
    setToMap || ((setToMap = !setToMap), marker.addTo(map));
    map.panTo(coord);
  };
})();

export const setTheMarker = _setTheMarker;

// Send the clicked position (lat / lng) to the output
export const setClickOnMapToOutput = (output) =>
  map.on('click', (ev) => {
    if (!ev.originalEvent.ctrlKey) return;
    const coord = [ev.latlng.lat, ev.latlng.lng];
    output.value = coord.join();
    _setTheMarker(coord);
  });
