import { displayMap } from './_leaflet.js';

// extract server passed data
const projResources = JSON.parse(document.getElementById('server-data-project').textContent);
const contriResources = JSON.parse(document.getElementById('server-data-contributions').textContent);
const locations = JSON.parse(document.getElementById('server-data-locations').textContent);

// soelct containers
const resourceElements = document.querySelector('.resources-elements');
const reourceDetails = document.querySelector('.resources-details');

displayMap(locations);
