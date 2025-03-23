import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { createProject } from './apiCalls/project.js';
import { createFeed } from './apiCalls/feed.js';
import { displayMap, setTheMarker, setClickOnMapToOutput } from './components/leaflet.js';
import fileToImage from './utils/fileToImage.js';
import { setAlert } from './utils/alert.js';

// Buttons
const btnAddLocation = document.querySelector('.add-location');
const btnAddMilestone = document.querySelector('.add-milestone');

// Inputs
const inputLocationPoint = document.querySelector('#location-point');
const inputMilestoneImg = document.querySelector('#add-milestone-img');
const inputMilestoneName = document.querySelector('#milestone-name');
const fileInputs = document.querySelectorAll('input[type="file"]');

// Forms
const formResourcesDetails = document.querySelector('#resources-details-form');
const formNewProject = document.querySelector('#new-project');

// Containers
const milestonesList = document.querySelector('.milestone-bubbles-list');
const resourcesIcons = document.querySelector('.resources-icons');

// State
const milestonesImg = {}; // {name: file}
const milestones = {}; // {name: milestoneFilename}
const resourcesData = {}; // {fund: {name: "fund", priority: 3, limit: {min: 2, max: 10}, ...}}

// Input File image handling
////
// Listener for select and show image for input file fields
function showImage(ev) {
  const img = ev.target.labels[0].children[0];
  const file = ev.target.files[0];
  if (!file) {
    img.src = '/static/img/icons/add.png';
    return;
  }

  fileToImage(file, (source) => {
    img.src = source;
    img.onload = () => URL.revokeObjectURL(img.src);
  });
}

fileInputs.forEach((input) => input.addEventListener('change', showImage));

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
  if (milestones.hasOwnProperty(name)) return setAlert('Milestone with that name already exists.', 'error');

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

btnAddMilestone.addEventListener('click', insertMilestone);
milestonesList.addEventListener('click', removeMilestone);

// Resources
////
// Select the corresponding icon, then load/show the details for user
function handleResources(ev) {
  const icon = ev.target.closest('.icon-holder');
  if (!icon) return;

  toggleSelection(icon.parentElement.parentElement);
  loadDetailsOfResource(icon.dataset.name);
}

function toggleSelection(li) {
  resourcesIcons.childNodes.forEach((item) => item.classList.toggle('selected', li === item));
}

function loadDetailsOfResource(resourceName) {
  // hide user info / show form
  if (formResourcesDetails.classList.contains('hidden')) {
    formResourcesDetails.classList.remove('hidden');
    document.querySelector('.resources-user-info').classList.add('hidden');
  }

  // load saved resource data
  const resource = resourcesData[resourceName];
  formResourcesDetails.dataset.resource = resourceName;
  if (!resource) return formResourcesDetails.reset();

  // fill form with previously saved data
  const elements = formResourcesDetails.elements;
  elements.authenticate.checked = resource.auth;
  elements['limit-max'].value = resource.limit?.max;
  elements['limit-min'].value = resource.limit?.min;
  elements.notes.value = resource.notes;
  elements.priority[resource.priority - 1].checked = true;
}

// Save the resource details
function handleResourceDetails(ev) {
  ev.preventDefault();

  const form = new FormData(this);
  const resourceName = this.dataset.resource;

  resourcesData[resourceName] = {
    name: resourceName,
    auth: !!form.get('authenticate'),
    limit: {
      min: form.get('limit-min'),
      max: form.get('limit-max'),
    },
    description: form.get('notes'),
    priority: form.get('priority'),
  };

  setAlert(`${resourceName.toUpperCase()} data are saved...`);
}

formResourcesDetails.addEventListener('submit', handleResourceDetails);
resourcesIcons.addEventListener('click', handleResources);

// Media
////
// The selected files shown as image on the page are handled trough showImage event listener

// Publish
////
async function publishNewProject(ev) {
  ev.preventDefault();

  // disable button, and inform user about prcessing
  const toggleSubmitter = function (on) {
    ev.submitter.disabled = on;
    ev.submitter.innerText = on ? 'Processing...' : 'Publish';
  };

  toggleSubmitter(true);
  const elements = this.elements;

  const cover = elements['cover-image'].files[0];
  const result = elements['result-image'].files[0];
  if (!(cover && result)) return toggleSubmitter(false), setAlert('COVER and RESULT images are required.', 'error');

  const type = elements.type.value;
  const locations = [
    {
      name: 'Worksite',
      coordinates: elements['location-point'].value.split(',').reverse(),
    },
  ];
  const milest = Object.entries(milestones).map((entry) => ({ name: entry[0], img: entry[1] }));
  const resources = [];
  elements.resource.forEach((res) => res.checked && resources.push(resourcesData[res.value]));

  // gather data for the project
  const projectData = new FormData();
  projectData.set('name', elements.name.value);
  projectData.set('summary', elements.summary.value);
  projectData.set('description', elements.description.value);
  projectData.set('deadline', elements.deadline.value);

  projectData.set('cover', cover);
  projectData.set('result', result);
  Object.values(milestonesImg).forEach((file) => projectData.append('milestones_img', file));

  projectData.set('locations', JSON.stringify(locations));
  projectData.set('resources', JSON.stringify(resources));
  projectData.set('milestones', JSON.stringify(milest));

  if (type === 'other' && elements['custom-type'].value) projectData.set('type', elements['custom-type'].value);
  else if (type !== 'other' && type) projectData.set('type', type);
  else return toggleSubmitter(false), setAlert('Project TYPE is required.', 'error');

  // create project
  const projectResponse = await createProject(projectData);
  if (!projectResponse || projectResponse.status !== 201) return toggleSubmitter(false);

  let message = 'Project created successfully.';
  let alert = 'alert';

  // gather data for first feed upload (2 optional videos)
  const feedData = new FormData();
  const video1 = elements.video1.files[0];
  const video2 = elements.video1.files[1];

  // if there is data for the feed, create feed entry
  if (video1 || video2) {
    video1 && feedData.append('videos', video1);
    video2 && feedData.append('videos', video2);
    feedData.set('isMilestone', true);
    feedData.set('title', 'Welcome!');
    feedData.set('message', 'Let me introduce this project...');
    feedData.set('project', projectResponse.data.data.project._id);

    const feed = await createFeed(feedData);
    if (!feed) {
      alert = 'error';
      message = 'Feed entry could not be created.';
    }
  }

  // redirect user to his newly created project.
  const slug = projectResponse.data.data.project.slug;
  window.location.replace(`/project/${slug}?${alert}=${message}`);
}

formNewProject.addEventListener('submit', publishNewProject);
