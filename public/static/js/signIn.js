// Select "boxes" to toggle
const signupInters = document.querySelectorAll('.signup-inter');
const loginInters = document.querySelectorAll('.login-inter');

// Select buttons
const proceedLogin = document.querySelector('.to-login');
const proceedSignup = document.querySelector('.to-signup');

// Signup background for bringing it on top or in back depending on in- / activity
const backgroundSignup = document.querySelector('.signup-box svg');
backgroundSignup.style.zIndex = getComputedStyle(backgroundSignup).zIndex;

// Add listeners to click events on proceed buttons
proceedLogin.addEventListener('click', toggleLoginSignup);
proceedSignup.addEventListener('click', toggleLoginSignup);

// Switch between LogIn and SignUp
function toggleLoginSignup(e) {
  signupInters.forEach(toggleHidden);
  loginInters.forEach(toggleHidden);

  // move the background on front or back
  backgroundSignup.style.zIndex = backgroundSignup.style.zIndex > -10 ? -10 : -5;
}

function toggleHidden(el) {
  el.classList.toggle('hidden');
}
