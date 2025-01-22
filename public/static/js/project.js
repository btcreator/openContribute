import { displayMap } from './components/leaflet.js';
import { initResourceDisplay } from './components/project/resources.js';
import { feedHandlerInit } from './components/project/feed.js';

const locations = JSON.parse(document.getElementById('server-data-locations').textContent);

// Map
////
displayMap(locations);

// Resources
////
initResourceDisplay();

// Feed
////
window.onYouTubeIframeAPIReady = function () {
  feedHandlerInit();
};
