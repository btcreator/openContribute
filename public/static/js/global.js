import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { hideAlert } from './utils/alert.js';
import { logout } from './apiCalls/auth.js';

const btnLogout = document.querySelector('.logout-btn');
const alertWindow = document.querySelector('.alert-window');
const demo = document.querySelector('.demo-info');
const demoInfo = demo.querySelector('p');

// Handle the dropdown modal window
const modalHandler = ((markup) => {
  let isOpen = false;
  const openText = demoInfo.textContent = 'This is just a demo website for testing and learning purpose! Click here.';
  demo.addEventListener("transitionend", (ev) => isOpen && (demoInfo.innerHTML = markup));

  return (ev) => {
    isOpen = demo.classList.toggle('modal-open');
    if(!isOpen) demoInfo.textContent = openText;
  }
})(getMarkup());

demo.addEventListener("click", modalHandler);

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


// Dont wanted to put it on the beginnig of the code (because of esthetic :) ) thats why as function
function getMarkup () {
  return `Please don't share any personal information!<br/><br/><br/>
  Disclaimer: </br>
  By using this demo website, you acknowledge that you are solely responsible for any content you upload or share. I am not responsible for the accuracy, legality, or appropriateness of the content posted. I reserve the right to remove or modify any content at my discretion without prior notice.</br></br>
  For payments use a testing credit card data: </br>
  Card Nr.: <b>4242 4242 4242 4242</b> </br>
  Date: <b>12/34</b> (any date in the future) </br>
  CVC: <b>any number</b> <br/></br></br>
  <b>This websites fundamentals is based on the Natours project by <i>Jonas Schmedtmann</i>. On this way want to thanks for his great course!</b> 
  `;
}