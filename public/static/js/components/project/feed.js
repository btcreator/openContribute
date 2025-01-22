import { getFeedData, createFeed } from './../../apiCalls/feed.js';
import { loadYTvideo } from './../ytLoader.js';
import { setAlert } from './../../utils/alert.js';

// Variables
////
// Extract server passed data
const projectId = document.querySelector('.container main').dataset.id;

// Select containers
const feedThread = document.querySelector('.feed-thread');
const uploadedMedia = document.querySelector('.uploaded-media');

// Select button
const btnFeedLoad = document.querySelector('.feed-control button');

// Forms
const addNewFeed = document.querySelector('.add-new-feed');

// Save names of feeds gallery multimedia names
const media = {};

// Buffering multimedia images and videos for upload
const newFeedImages = [];
const newFeedVideos = [];

// Hold references between list items and files (for removal)
const mediaMap = new Map();

// Initial function - export
////
export function feedHandlerInit() {
  // create - handle and add new feed
  if (addNewFeed) {
    addNewFeed.addEventListener('submit', insertNewFeed);
    uploadedMedia.addEventListener('click', removeMedia);
    document.getElementById('upload-files').addEventListener('change', uploadFileHandler);
  }

  // load - load and show feed
  loadFeedInit();
  feedThread.addEventListener('click', feedMediaGalleryControl);
}

// Feed - Create
////
// check and sort upload-ready files by type, show and save (buffer them) for uploading
function uploadFileHandler(ev) {
  ev.preventDefault();
  let isMediaDeny = false;

  // each supported file is inserted to the upload-ready list
  for (const file of this.files) {
    if (file.type.startsWith('image')) {
      newFeedImages.push(file);
      insertListItem(URL.createObjectURL(file), file);
    } else if (file.type === 'video/mp4') {
      insertVideoFrameAsImgToList(file);
    } else {
      isMediaDeny = true;
    }
  }
  isMediaDeny && setAlert(`Media type is not allowed.`, 'error');
}

// show video as image for upload ready list (take a screenshot from the first frame)
function insertVideoFrameAsImgToList(file) {
  const video = document.createElement('video');
  video.src = URL.createObjectURL(file);

  // seek video to first frame (0sec)
  video.addEventListener(
    'loadeddata',
    () => {
      video.currentTime = 0;
    },
    { once: true }
  );

  // when video is on first frame, take is as image and show in the list
  video.addEventListener(
    'seeked',
    () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      newFeedVideos.push(file);
      insertListItem(canvas.toDataURL(), file, 'video');
    },
    { once: true }
  );
}

// insert media image as thumbnail in the list and track the file
function insertListItem(source, file, type) {
  const li = document.createElement('li');
  const img = document.createElement('img');
  img.src = source;
  li.appendChild(img);
  type === 'video' && li.classList.add('video');
  uploadedMedia.insertBefore(li, uploadedMedia.lastElementChild);
  mediaMap.set(li, file);
}

// remove media image from list and the file from every container / cut references for GC
function removeMedia(ev) {
  ev.preventDefault();
  const listEl = ev.target.closest('li');
  if (!listEl) return;

  const isVideo = listEl.classList.contains('video');
  const medFile = mediaMap.get(listEl);
  const mediaContainer = isVideo ? newFeedVideos : newFeedImages;

  const index = mediaContainer.findIndex((file) => medFile === file);
  if (index >= 0) {
    mediaContainer.splice(index, 1);
    mediaMap.delete(listEl);
    listEl.remove();
  }
}

// submit new feed data and push it immediately in the feed flow
async function insertNewFeed(ev) {
  ev.preventDefault();

  const feedData = new FormData(this);
  const submitBtn = ev.submitter;

  // disable submit form
  submitBtn.textContent = 'Processing...';
  submitBtn.disabled = true;

  // prepare and send new feed data as multipart
  feedData.set('project', projectId);
  feedData.set('isMilestone', feedData.has('milestone'));
  newFeedImages.forEach((file) => feedData.append('images', file));
  newFeedVideos.forEach((file) => feedData.append('videos', file));

  feedData.delete('milestone');
  feedData.delete('upload-files');

  const feed = await createFeed(feedData);
  if (!feed) return;

  // insert new feed in flow
  insertFeedToHTML('afterbegin', feed);
  setAlert('Your feed is published successfully.');

  // reset and clear
  this.reset();
  newFeedImages.length = 0;
  newFeedVideos.length = 0;
  mediaMap.clear();
  uploadedMedia.replaceChildren(uploadedMedia.lastElementChild);

  submitBtn.textContent = 'Publish';
  submitBtn.disabled = false;

  // remove overflow feeds
  const maxFeed = (btnFeedLoad.dataset.nextPage - 1) * 10;
  feedThread.children.length > maxFeed && feedThread.children[maxFeed].remove();
}

// Feed - Load
////
// prepare observer for lazy youtube load and load the first feeds
function loadFeedInit() {
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

  // set up the listener for "load more feed" button
  const observer = new IntersectionObserver(observerCb, { rootMargin: '100px', threshold: 0.1 });
  const displayFeedBinded = displayFeed.bind(btnFeedLoad, observer);
  btnFeedLoad.addEventListener('click', displayFeedBinded);
  btnFeedLoad.click();
}

// load feeds to feed flow
async function displayFeed(observer) {
  // disable btn and get the next page nr.
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
    insertFeedToHTML('beforeend', feed);
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

// Gallery
// control of the gallery when want to load next image/video (arrow left/right)
function feedMediaGalleryControl(ev) {
  const left = ev.target.classList.contains('arrow-left');
  const right = ev.target.classList.contains('arrow-right');

  // when one of the arrows was pressed...
  if (left || right) {
    const gallery = ev.target.closest('.gallery');
    const source = gallery.dataset.id;
    const isImg = gallery.dataset.id.startsWith('img');
    const mediaRep = isImg ? gallery.querySelector('img') : gallery.querySelector('source');

    // get the next index of a gallery item
    let next = +mediaRep.dataset.index + left * -1 + right;
    next = next < 0 ? media[source].length - 1 : next % media[source].length;

    // load the next media element
    mediaRep.dataset.index = next;
    mediaRep.src = `/media/feed/${isImg ? 'img' : 'vid'}/${media[source][next]}`;
    if (!isImg) mediaRep.parentElement.load();
  }
}

// Markup fill functions
////
function insertFeedToHTML(position, feed) {
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

  feedThread.insertAdjacentHTML(position, markup);
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
