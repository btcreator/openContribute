import { hideAlert } from '../utils/alert.js';

const alertWindow = document.querySelector('.alert-window');

// When alert window is set to visible on load, it mean it is set by server and there is a message for user to show
if (!alertWindow.classList.contains('hidden')) {
  // remove the alert query parameter from the url
  const url = window.location.href.split('?')[0];
  window.history.replaceState(null, '', url);

  // show and hide alert
  setTimeout(() => {
    alertWindow.style.opacity = 1;
    hideAlert(3000);
  }, 500);
}
