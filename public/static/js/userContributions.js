import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { getContributedResources } from './apiCalls/contribution.js';
import { getProject } from './apiCalls/project.js';

const projectThumbs = document.querySelector('.project-thumbs');
const detailBox = document.querySelector('.project-details');
// Container for loaded data from server
const projects = {};

// Project selection handler - show the selected project in details
projectThumbs.addEventListener('click', async function (ev) {
  // get clicked project
  const projectBox = ev.target.closest('.project-box');
  if (!projectBox) return;

  // check if that project was loaded previously, when not, get it from db and save locally (to save db calls and performance).
  let project, resources;
  const id = projectBox.dataset.id;
  if (!projects[id]) {
    [project, resources] = await Promise.all([getProject(id), getContributedResources(id)]);
    if (project && resources) projects[id] = { project, resources };
  } else ({ project, resources } = projects[id]);

  // when one of them can't be loaded, show some message in detail box
  if (!project || !resources) {
    detailBox.innerHTML = '<p>This project was probably removed by the leader.</p>';
    return;
  }

  // all good, show the details
  const detailMarkup = fillDetailBox(project, resources);
  detailBox.innerHTML = detailMarkup;
});

// Fill details of a project to HTML Markup
function fillDetailBox(project, resources) {
  const offset = 100 - Math.round(project.progress * 100);
  const resourcesIconsHTML = Object.keys(resources)
    .map((resourceName) => `<li><img src="/static/img/icons/res_${resourceName}.png" /></li>`)
    .join('');
  const resourcesWithValuesHTML = Object.entries(resources)
    .map(
      ([resourceName, value]) => `<li><img src="/static/img/icons/res_${resourceName}.png" /><span>${value}</span></li>`
    )
    .join('');

  return `<a class="project-box" href="/project/${project.slug}" alt="Details of project ${project.name}">
          <div class="project-image">
              <img src="/media/projects/content/${project.resultImg}" alt="Project image">
          </div>
          <h3>${project.name}</h3>
          <svg class="delimiter" viewBox="0 0 100 1" xmlns="http://www.w3.org/2000/svg" stroke-width="2">
              <line x1="0" y1="0" x2="100" y2="0" stroke="lightgrey"></line>
              <line x1="0" y1="0" x2="100" y2="0" stroke-dasharray="100" stroke-dashoffset="${offset}" stroke="green"></line>
          </svg>
          <ul class="resources">
              ${resourcesIconsHTML}
          </ul>
      </a>
  
      <div class="project-description">
          <div class="description-header">
              <h3>Project of <span class="leader">${project.leader.name}</span></h3>
              <span class="start-date">Started ${new Date(project.createdAt).getFullYear()}</span>
          </div>
          <div class="description-text">
              <p>${project.summary}</p>
          </div>
          <div class="description-resources">
              <ul>
                  ${resourcesWithValuesHTML}
              </ul>
          </div>
          <div class="description-done ${project.isDone ? '' : 'hidden'}">
              <p>With your help, a dream could be reality. Thank you for all your support and help during this project! <br />This Project is done.</p>
          </div>
      </div>`;
}
