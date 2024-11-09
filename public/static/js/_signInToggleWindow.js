const signupInters = document.querySelectorAll('.signup-inter');
const loginInters = document.querySelectorAll('.login-inter');

const proceedLogin = document.querySelector('.to-login');
const proceedSignup = document.querySelector('.to-signup');

// Login box for bringing it on top or in back depending on in- / activity
const loginBox = document.querySelector('.login-box');
loginBox.style.zIndex = 5;

// Switch between LogIn and SignUp
function toggleLoginSignup(e) {
  signupInters.forEach(toggleHidden);
  loginInters.forEach(toggleHidden);

  // move the loginBox on front or back
  loginBox.style.zIndex = loginBox.style.zIndex >= 5 ? '' : 5;
}

function toggleHidden(el) {
  el.classList.toggle('hidden');
}

export function toggleSignInWindowInit() {
  // Add listeners to click events on proceed buttons
  proceedLogin.addEventListener('click', toggleLoginSignup);
  proceedSignup.addEventListener('click', toggleLoginSignup);
}
