import { displayMap, setTheMarker, setClickOnMapToOutput } from './components/leaflet.js';
import { setAlert } from './utils/alert.js';

// Buttons
const btnAddLocation = document.querySelector('.add-location');
const btnAddMilestone = document.querySelector('.add-milestone');

// Inputs
const inputLocationPoint = document.querySelector('#location-point');
const inputMilestoneImg = document.querySelector('#add-milestone-img');
const inputMilestoneName = document.querySelector('#milestone-name');

// Containers
const milestonesList = document.querySelector('.milestone-bubbles-list');

// State
const milestonesImg = {}; // milestones_img - {name: images/files}
const milestones = {}; // milestones - {name: milestoneFilename}

// Map
////
// Listeners
function markOnMap() {
  const coords = inputLocationPoint.value.split(',');
  if (coords.length !== 2) return setAlert('Malformed coordinates.', 'error');

  setTheMarker(coords);
}

btnAddLocation.addEventListener('click', markOnMap);
inputLocationPoint.addEventListener('change', markOnMap);

// Init map
displayMap();
setClickOnMapToOutput(inputLocationPoint);

// Milestones
////
// Listeners
function insertMilestone() {
  // name for milestone is mandatory
  const name = inputMilestoneName.value.trim();
  if (!name) return setAlert('Milestone need a name.', 'error');

  // save image / milestone data to state
  const img = inputMilestoneImg.files[0];
  img && (milestonesImg[name] = img);
  milestones[name] = img?.name;

  // use selected image or the default from server as milestone bubble picture
  const source = img ? URL.createObjectURL(img) : `/media/projects/milestones/default.jpg`;
  addMilestoneBubbleToPage(source, name);

  // reset inputs
  inputMilestoneImg.labels[0].children[0].src = '/static/img/icons/add.png';
  inputMilestoneImg.value = '';
  inputMilestoneName.value = '';
}

// Show the milestone image as bubble with the milestone name in the list on page
function addMilestoneBubbleToPage(source, name) {
  const li = document.createElement('li');
  const img = document.createElement('img');
  const p = document.createElement('p');

  li.dataset.name = name;
  img.src = source;
  p.innerText = name;

  li.append(img, p);
  milestonesList.appendChild(li);
}

// Remove milestone bubble from the list and from state
function removeMilestone(ev) {
  const li = ev.target.closest('li');
  if (!li) return;

  const name = li.dataset.name;
  delete milestones[name];
  delete milestonesImg[name];
  li.remove();
}

// The selected image (from file input) gets shown
function showImage(ev) {
  const img = ev.target.labels[0].children[0];
  img.src = URL.createObjectURL(ev.target.files[0]);
  img.onload = () => URL.revokeObjectURL(img.src);
}

inputMilestoneImg.addEventListener('change', showImage);
btnAddMilestone.addEventListener('click', insertMilestone);
milestonesList.addEventListener('click', removeMilestone);

// Media
////
