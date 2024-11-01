import { login, signup } from './_signIn_api_calls';
import { toggleSignInWindowInit } from './_signInToggleWindow';

const loginForm = document.querySelector('#login-form');
const signupForm = document.querySelector('#signup-form');

// Add listeners for toggle buttons to switch between signIn and LogIn window
toggleSignInWindowInit();

// log in
loginForm.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  login(email, password);
});

// Sign up
signupForm.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const email = document.getElementById('email-sign');
  const password = document.getElementById('password-sign');
  const confirmPassword = document.getElementById('confirm-password');

  signup(email, password, confirmPassword);
});
