import { hideAlert } from './utils/alert.js';
import { logout } from './apiCalls/auth.js';

const btnLogout = document.querySelector('.logout-btn');
const alertWindow = document.querySelector('.alert-window');

if (btnLogout)
  btnLogout.addEventListener('click', async (ev) => {
    const res = await logout();
    if (res?.status === 200) window.location.replace('/?alert=You logged out successfully!');
  });

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
