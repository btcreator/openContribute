import 'core-js/stable';
import 'regenerator-runtime/runtime';

async function searchSubmit(ev) {
  ev.preventDefault();

  // disable search button
  ev.submitter.disabled = true;

  // collect form data
  const form = new FormData(this);
  const q = form.get('search');
  const type = form.get('type');
  const address = form.get('location');
  const distance = form.get('perimeter');

  // add user set filter options
  let filter = `?q=${q}`;
  type !== 'any' && (filter += `&type=${type}`);
  address && (filter += `&address=${address}&distance=${distance}`);

  // re-call the page with new search query
  window.location.search = filter;
}

document.querySelector('.search-form').addEventListener('submit', searchSubmit);
