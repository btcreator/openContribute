import { createContribution } from './../../apiCalls/contribution.js';
import { updateProject } from './../../apiCalls/project.js';
import { setAlert } from './../../utils/alert.js';
import { contributeFunds } from './../stripe.js';

// Variables
////
// Extract server passed data
const projResources = JSON.parse(document.getElementById('server-data-project').textContent);
const projectResObj = projResources.reduce((acc, item) => ((acc[item.name] = item), acc), {});
const contriResources = JSON.parse(document.getElementById('server-data-contributions').textContent);
const projectId = document.querySelector('.container main').dataset.id;

// Select containers
const resourceIcons = document.querySelector('.resources-icons');
const resourceDetails = document.querySelector('.resources-details');

// When user is logged in, then the profile element exists...
const isLoggedIn = !!document.querySelector('.user-nav .profile');

// Are the resources in edit mode? - project update
const isInEditMode = document.querySelector('.resources').dataset.mode === 'edit';

// Specify units for resources - all others have "Units" as unit.
const units = {
  human: 'Persons',
  funds: 'USD',
  goods: 'Items',
  tools: 'Tools',
  support: 'Sessions',
};

// Initial function - export
////
export function initResourceDisplay() {
  displayResources(projResources);
  resourceIcons.addEventListener('click', toggleResourceDetails);
}

// Resources handling
////
// list up resource icons and set initial state
function displayResources(resources) {
  listIcons(resources);

  const lastResName = resourceIcons.lastChild.querySelector('input').value;
  handleResourceDetails(projectResObj[lastResName], contriResources[lastResName]);
}

// show resource icons
function listIcons(resArr) {
  // clear icons holder
  resourceIcons.textContent = '';

  // resources are shown from low to high prority
  const sortedRes = resArr.sort((a, b) => a.priority - b.priority);
  // selecting as initial the last icon , i.e. show to user the resource with the highest priority
  for (let i = 0; i < sortedRes.length; i++) {
    insertIconToHTML(sortedRes[i].name, i === sortedRes.length - 1);
  }
}

// listener for resources icon buttons
function toggleResourceDetails(ev) {
  ev.stopPropagation();

  const name = ev.target.closest('input')?.value;
  if (!name) return;

  handleResourceDetails(projectResObj[name], contriResources[name]);
}

// resource details gets shown differently depending if it gets edited or just shown (possibility to contribute)
function handleResourceDetails(resObj, contriResObj) {
  document.getElementById('cta-form')?.removeEventListener('submit', processResourceAction);
  isInEditMode ? fillResourceDetailsInEditMode(resObj, contriResObj) : fillResourceDetails(resObj, contriResObj);
  document.getElementById('cta-form').addEventListener('submit', processResourceAction);
}

// submit on resource gets updated or contributed
function processResourceAction(ev) {
  ev.preventDefault();
  const form = new FormData(this);
  isInEditMode ? updateResource(form) : contributeWithResource(form);
}

// handle the contribution process
async function contributeWithResource(form) {
  if (form.get('contribution-ack') !== 'on') return setAlert('You must accept the terms', 'error');

  const amount = +form.get('contribution-amount');
  const resource = form.get('resource');
  const appliedEl = document.querySelector('.resource-applied');
  const amountEl = document.getElementById('contribution-amount');
  const ackEl = document.getElementById('contribution-ack');

  // when contributed was with funds, payment process is needed (stripe)
  if (resource === 'funds') {
    // stripe payment procedure
    await contributeFunds(projectId, amount);
    return;
  }

  // create new contribution. On success update values on page
  const contribution = await createContribution(projectId, resource, amount);
  if (contribution.status === 201) {
    contriResources[resource] += amount;
    appliedEl.textContent = `${contriResources[resource]} is already applied`;
    amountEl.value = '';
    ackEl.checked = false;
    setAlert('Contribution successful!');
  }
}

// handle the update process
async function updateResource(form) {
  // create update object
  const min = form.get('limit-min') === '' ? undefined : +form.get('limit-min');
  const max = form.get('limit-max') === '' ? undefined : +form.get('limit-max');
  const name = form.get('resource');
  const priority = +form.get('priority');
  const updateObj = {
    resources: {
      name,
      priority,
      limit: { min, max },
      description: form.get('notes'),
    },
  };

  // update project
  const isPrioChanged = priority !== projectResObj[name].priority;
  const project = await updateProject(projectId, updateObj);

  // when update was successful
  if (project.status === 200) {
    setAlert('Update successful!');
    const resources = project.data.data.project.resources;
    // update the local resource object
    projectResObj[name] = resources.find((res) => res.name === name);

    // when priority was updated, reinsert icons in the right order
    isPrioChanged && displayResources(resources);
  }
}

// Markup fill functions
////
function insertIconToHTML(name, checked) {
  const markup = `<li>
        <input form="cta-form" class="hidden" type="radio" name="resource" id="${name}" value="${name}" ${
    checked ? 'checked' : ''
  } required />
        <label for="${name}">
          <img src="/static/img/icons/res_${name}.png" alt="${name}"
        </label>
      </li>`;
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
            form="cta-form"
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
          <form id="cta-form" class="submit-button-wrapper">
            <button class="submit-btn" ${contriEnable ? '' : 'disabled'}>
              <span>Contribute</span>
            </button>
          </form>
        </div>
    
        <div class="resource-contribution-acknowledgement">
          <input
            form="cta-form"
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

function fillResourceDetailsInEditMode(resource, applied) {
  const unit = units[resource.name] ?? 'Unit';
  const markup = `<div class="resource-quantity-info">
       <div class="resource-info">
         <label for="limit-min">Limit (min)</label>
         <div>
           <div>
             <input
               form="cta-form"
               type="number"
               name="limit-min"
               value="${resource.limit?.min ?? ''}"
             />
             ${unit}
           </div>
         </div>
       </div>
  
        <div class="resource-info">
         <label for="limit-max">Limit (max)</label>
         <div>
           <div>
             <input
               form="cta-form"
               type="number"
               name="limit-max"
               value="${resource.limit?.max ?? ''}"
             />
             ${unit}
           </div>
         </div>
       </div>
  
       <div class="resource-info">
         <span>Progress</span>
         <div>
           <div class="resource-applied">${applied ?? 0} is already applied</div>
         </div>
       </div>
  
       <div class="resource-info">
           <label for="priority">Priority</label>
           <div>
             <input
               form="cta-form"
               type="number"
               name="priority"
               value="${resource.priority}"
               min="1"
               max="5"
               required
             />/5
           </div>
         </div>
       </div>
  
       <div class="resource-notes">
         <h2>${resource.name}</h2>
         <label for="notes">Important notes - </label>
         <textarea
           form="cta-form"
           name="notes"
           id="notes"
           rows="20"
           required
         >${resource.description}
         </textarea>
       </div>
  
       <div class="resource-update">
         <form id="cta-form" class="submit-button-wrapper">
           <button class="submit-btn">
             <span>Apply changes</span>
           </button>
         </form>
       </div>`;
  resourceDetails.innerHTML = markup;
}
