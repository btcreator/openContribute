import { findProjects } from './apiCalls/project.js';
const LIMIT_PER_PAGE = 10;

// State
let stateSearchText = '';
let stateFilterOptions = { limit: LIMIT_PER_PAGE, sort: '-createdAt', isDone: false }; // limit results to 10 undone projects and sort by creation date

// search related
const searchQueryText = document.querySelector('.search-query-text');
const searchResults = document.querySelector('.search-results');

// pagination related
const btnPrevResults = document.querySelector('.prev-results');
const btnNextResults = document.querySelector('.next-results');
const actualPage = document.querySelector('.actual-page');

// Add listeners for search submit and pagination buttons
document.querySelector('.search-form').addEventListener('submit', searchSubmit);
btnPrevResults.addEventListener('click', getNewResults);
btnNextResults.addEventListener('click', getNewResults);

// Search functionality
////
async function searchSubmit(ev) {
  ev.preventDefault();

  // disable search button and reset navigaton elements
  ev.submitter.disabled = true;

  // collect form data
  const form = new FormData(this);
  stateSearchText = form.get('search');
  const type = form.get('type');
  const address = form.get('location');
  const distance = form.get('perimeter');

  // reset filter
  stateFilterOptions = { limit: LIMIT_PER_PAGE, sort: '-createdAt', isDone: false };

  // add user set filter options
  type !== 'any' && Object.assign(stateFilterOptions, { type });
  address && Object.assign(stateFilterOptions, { address, distance });

  // load projects and insert results to page
  await resolvePage(1);

  // add search query text
  searchQueryText.textContent =
    stateSearchText === ''
      ? `Latest projects${type !== 'any' ? ' in ' + type : ''}`
      : `Results for: "${stateSearchText}" - ${type}`;
  searchQueryText.textContent += ` ${address && `in ${address}`}${address && +distance ? ` (${distance} km)` : ''}`;

  // enable search button
  ev.submitter.disabled = false;
}

// Pagination / navigation
////
function getNewResults(ev) {
  resolvePage(+this.dataset.page);
}

// update elements with actual page
function updateNavigation(page, results) {
  // disable and enable buttons when reach beginning or end
  btnPrevResults.disabled = page <= 1;
  btnNextResults.disabled = results < LIMIT_PER_PAGE;

  btnNextResults.dataset.page = page + 1;
  btnPrevResults.dataset.page = page - 1;
  actualPage.textContent = page;
}

// Fetch
////
async function resolvePage(page) {
  // search for projects
  const response = await findProjects(stateSearchText, Object.assign({}, stateFilterOptions, { page }));
  let results = 0;

  // insert found projects to page / show info
  searchResults.textContent = '';
  if (response?.status === 200 && response.data.data.projects.length) {
    response.data.data.projects.forEach((project) => insertProjectToHTML(project));
    results = response.data.data.projects.length;
  } else searchResults.innerHTML = '<p>No results</p>';

  updateNavigation(page, results);
}

// Markup fill functions
////
function insertProjectToHTML(project) {
  const markup = `<a class="result-card" href="/project/${project.slug}">
    <div class="card-bg">
      <img src="/media/projects/content/${project.resultImg}" alt='background image' />
    </div>
    <h2 class="card-header">${project.name}</h2>
    <div class="card-content">
      <p class="summary">${project.summary}</p>
      <div class="resources">
        <h3>Resources Needed</h3>
        <ul>
          ${injectResourceList(project.resources)}
        </ul>
      </div>
    </div>
    <p class="card-footer">Lead by <span class="leader-name">${project.leader.name}</span></p>
  </a>`;
  searchResults.insertAdjacentHTML('beforeend', markup);
}

function injectResourceList(resources) {
  let markup = '';
  for (const resource of resources)
    markup += `<li>
      <img src="/static/img/icons/res_${resource.name}.png" />
    </li>`;
  return markup;
}
