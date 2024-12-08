import { getFeedData } from './_feed_api_calls.js';
import { createContribution } from './_contribution_api_calls.js';
import { displayMap } from './_leaflet.js';
import { loadYTvideo } from './_ytLoader.js';
import { setAlert } from './_alert.js';
import { contributeFunds } from './_stripe.js';

// Variables
////
// extract server passed data
const projResources = JSON.parse(document.getElementById('server-data-project').textContent);
const contriResources = JSON.parse(document.getElementById('server-data-contributions').textContent);
const locations = JSON.parse(document.getElementById('server-data-locations').textContent);
const resObj = projResources.reduce((acc, item) => ((acc[item.name] = item), acc), {});
const projectId = document.querySelector('.container main').dataset.id;

// select containers
const resourceIcons = document.querySelector('.resources-icons');
const resourceDetails = document.querySelector('.resources-details');
const feedThread = document.querySelector('.feed-thread');

// select button
const btnFeedLoad = document.querySelector('.feed-control button');

// when user is sogged in, then the profile element exists...
const isLoggedIn = !!document.querySelector('.user-nav .profile');
// specify units for resources - all other have "Units" as unit.
const units = {
  human: 'Persons',
  funds: 'USD',
  goods: 'Items',
  tools: 'Tools',
  support: 'Sessions',
};
// feed multimedia names
const media = {};

// Fill page with data
////
displayResources(projResources, contriResources);
displayMap(locations);
window.onYouTubeIframeAPIReady = function () {
  feedHandlerInit();
};

// Controllers
////
function displayResources(resources) {
  // resources are shown from low to high prority
  const sortedRes = resources.sort((a, b) => a.priority - b.priority);
  // countdown for selecting as initial the last icon , i.e. show to user the resource with the highest priority
  let countdown = sortedRes.length;
  for (let { name } of sortedRes) {
    insertIconToHTML(name, !--countdown);
  }

  resourceIcons.addEventListener('click', toggleResourceDetails);

  // set initial state
  const lastResource = sortedRes.at(-1);
  handleResourceDetailsAndContributionForm(lastResource, contriResources[lastResource.name]);
}

function handleResourceDetailsAndContributionForm(resObj, contriResObj) {
  document.getElementById('contribute')?.removeEventListener('submit', contributeWithResource);
  fillResourceDetails(resObj, contriResObj);
  document.getElementById('contribute').addEventListener('submit', contributeWithResource);
}

function feedHandlerInit() {
  // yT videos needs to load lazy and dynamic. When leaves the screen, deload them to prevent memory leaks
  const observerCb = (entries) => {
    entries.forEach((entry) => {
      const ytContainer = entry.target.firstElementChild;
      const iframe = entry.target.querySelector('iframe');
      // when video enters to view and no embedded video is present, load it.
      // else (when leaves) and embedded video is present, remove it.
      if (entry.isIntersecting) {
        iframe || loadYTvideo(ytContainer.id, entry.target.dataset.videoId);
      } else if (iframe) {
        const id = ytContainer.id;
        ytContainer.src = '';
        ytContainer.remove();
        entry.target.insertAdjacentHTML('afterbegin', `<div id="${id}"></div>`);
      }
      // toggle video frame and placeholder image
      entry.target.firstElementChild.classList.toggle('hidden', !entry.isIntersecting);
      entry.target.lastElementChild.classList.toggle('hidden', entry.isIntersecting);
    });
  };

  const observer = new IntersectionObserver(observerCb, { rootMargin: '100px', threshold: 0.1 });
  const displayFeedBinded = displayFeed.bind(btnFeedLoad, observer);
  btnFeedLoad.addEventListener('click', displayFeedBinded);
  btnFeedLoad.click();
}

// control of the gallery when want to load next image/video (arrow left/right)
feedThread.addEventListener('click', feedMediaGalleryControl);

// Listeners
////
function toggleResourceDetails(ev) {
  ev.stopPropagation();

  const name = ev.target.closest('input')?.value;
  if (!name) return;

  handleResourceDetailsAndContributionForm(resObj[name], contriResources[name]);
}

async function contributeWithResource(ev) {
  ev.preventDefault();

  const form = new FormData(this);
  if (form.get('contribution-ack') !== 'on') return setAlert('You must accept the terms', 'error');

  const amount = +form.get('contribution-amount');
  const resource = form.get('resource');
  const appliedEl = document.querySelector('.resource-applied');
  const amountEl = document.getElementById('contribution-amount');
  const ackEl = document.getElementById('contribution-ack');

  if (resource === 'funds') {
    // stripe payment procedure
    await contributeFunds(projectId, amount);
    return;
  }

  const contribution = await createContribution(projectId, resource, amount);
  if (contribution.status === 201) {
    contriResources[resource] += amount;
    appliedEl.textContent = `${contriResources[resource]} is already applied`;
    amountEl.value = '';
    ackEl.checked = false;
    setAlert('Contribution successful!');
  }
}

async function displayFeed(observer) {
  // disable btn, get project Id for db call, and which page (the next 10 feeds)
  this.disabled = true;
  const page = +this.dataset.nextPage;

  // db call for feed (is limited to 10 feeds per call)
  const feedFlow = await getFeedData(projectId, page);
  if (!feedFlow) {
    this.disabled = false;
    return;
  }

  // add those to feed thread
  for (let feed of feedFlow) {
    insertFeedToHTML(feed);
    if (feed.link) observer.observe(document.getElementById(`video-${feed._id}`));
  }

  // increment pagination on button
  this.dataset.nextPage = page + 1;

  // if no more feed, let btn disabled (return)
  if (feedFlow.length < 10) {
    this.textContent = 'You reached the beginning';
    this.style.filter = 'grayscale(1)';
    return;
  }
  this.disabled = false;
}

function feedMediaGalleryControl(ev) {
  const left = ev.target.classList.contains('arrow-left');
  const right = ev.target.classList.contains('arrow-right');

  if (left || right) {
    const gallery = ev.target.closest('.gallery');
    const source = gallery.dataset.id;
    const isImg = gallery.dataset.id.startsWith('img');
    const mediaRep = isImg ? gallery.querySelector('img') : gallery.querySelector('source');

    let next = +mediaRep.dataset.index + left * -1 + right;
    next = next < 0 ? media[source].length - 1 : next % media[source].length;

    mediaRep.dataset.index = next;
    mediaRep.src = `/media/feed/${isImg ? 'img' : 'vid'}/${media[source][next]}`;
    if (!isImg) mediaRep.parentElement.load();
  }
}

// Markup fill functions
////
function insertIconToHTML(name, checked) {
  const markup = `<li>
    <input form="contribute" class="hidden" type="radio" name="resource" id="${name}" value="${name}" ${
    checked ? 'checked' : ''
  } required />
    <label for="${name}">
      <img src="/static/img/icons/res_${name}.png" alt="${name}"
    </label>`;
  resourceIcons.insertAdjacentHTML('beforeend', markup);
}

function fillResourceDetails(resource, applied) {
  const contriEnable = isLoggedIn || !resource.auth;
  const unit = units[resource.name] ?? 'Unit';
  const markup = `<div class="resource-quantity-info">
      <div class="resource-info">
        <span>Limit (min)</span>
        <div>
          <div>${resource.limit?.min ?? '-'} ${unit}</div>
        </div>
      </div>

      <div class="resource-info">
        <span>Limit (max)</span>
        <div>
          <div>${resource.limit?.max ?? '-'} ${unit}</div>
        </div>
      </div>

        <div class="resource-info">
        <span>Progress</span>
        <div>
          <div class="resource-applied">${applied ?? 0} is already applied</div>
        </div>
      </div>

      <div class="resource-info">
        <span>Priority</span>
        <div>${resource.priority}/5</div>
      </div>
    </div>

    <div class="resource-notes">
      <h2>${resource.name}</h2>
      <span>Important notes - </span>
      <p>${resource.description}</p>
    </div>

    <div class="resource-contribution-input">
      <label class="hidden" for="contribution-amount">Amount in ${unit}</label>
      <input
        form="contribute"
        type="number"
        name="contribution-amount"
        id="contribution-amount"
        placeholder="${unit}"
        required
      />
    </div>

    <div class="resource-contribution">
      <p class="require-login ${contriEnable ? 'hidden' : ''}">
        You need to be logged in to contribute with this resource.
      </p>
      <form id="contribute" class="submit-button-wrapper">
        <button class="submit-contribution-btn" ${contriEnable ? '' : 'disabled'}>
          <span>Contribute</span>
        </button>
      </form>
    </div>

    <div class="resource-contribution-acknowledgement">
      <input
        form="contribute"
        type="checkbox"
        name="contribution-ack"
        id="contribution-ack"
        required
      />
      <label for="contribution-ack"
        >I have read and accept the leaders requests. I will do my
        part in accordance with the notes.</label
      >
    </div>
  </div>`;
  resourceDetails.innerHTML = markup;
}

function insertFeedToHTML(feed) {
  const markup = `<article class="feed">
    <header>
      <span class="feed-date">${new Date(feed.createdAt).toLocaleDateString()}</span>
      <h3>${feed.title}</h3>
    </header>

    <div class="feed-content">
      <aside class="tags">
        ${feed.isMilestone ? '<div class="milestone-tag"></div>' : ''}
      </aside>

      <div class="post">
        <p class="post-text">${feed.message}</p>
        <div class="post-multimedia">
          ${injectMultimedia(feed)}
        </div>
      </div>
    </div>
  </article>`;

  feedThread.insertAdjacentHTML('beforeend', markup);
}

function injectMultimedia(feed) {
  let multimediaMarkup = '';
  if (feed.videos.length > 0) {
    media[`vid-${feed._id}`] = feed.videos;
    multimediaMarkup += `<div class="gallery" data-id="vid-${feed._id}">
      <div class="slideshow">
        <video controls>
          <source data-index="0" src="/media/feed/vid/${feed.videos[0]}" type="video/mp4">
          Your browser does not support the video tag.
        </video>

        <div class="controls">
          <div class="arrow arrow-left">
            <div class="arrow-left">&lt;</div>
          </div>
          <div class="arrow arrow-right">
            <div class="arrow-right">&gt;</div>
          </div>
        </div>
      </div>
    </div>`;
  }

  if (feed.images.length > 0) {
    media[`img-${feed._id}`] = feed.images;
    multimediaMarkup += `<div class="gallery" data-id="img-${feed._id}">
      <div class="slideshow">
        <img data-index="0"
          src="/media/feed/img/${feed.images[0]}"
          alt="Photo"
        />

        <div class="controls">
          <div class="arrow arrow-left">
            <div class="arrow-left">&lt;</div>
          </div>
          <div class="arrow arrow-right">
            <div class="arrow-right">&gt;</div>
          </div>
        </div>
      </div>
    </div>`;
  }

  if (feed.link) {
    const videoId = feed.link.substring(32);
    multimediaMarkup += `<div id="video-${feed._id}" data-video-id=${videoId} class="video">
      <div id="player-${feed._id}" class="hidden"></div>
      <div id="thumb-${feed._id}" class="video-placeholder">
        <img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" alt="Video Thumbnail">
        <button>&#9654;</button>
      </div>
    </div>`;
  }
  return multimediaMarkup;
}
