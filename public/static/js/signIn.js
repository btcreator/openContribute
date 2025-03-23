import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { login, signup } from './apiCalls/auth.js';
import { toggleSignInWindowInit } from './components/signInToggleWindow.js';

const loginForm = document.querySelector('#login-form');
const signupForm = document.querySelector('#signup-form');

// Add listeners for toggle buttons to switch between signIn and LogIn window
toggleSignInWindowInit();

// log in
loginForm.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await login(email, password);
  if (res?.status === 200) window.location.replace('/?alert=You logged In Successfully');
});

// Sign up
signupForm.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const email = document.getElementById('email-sign').value;
  const password = document.getElementById('password-sign').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  const res = await signup(email, password, confirmPassword);
  if (res?.status === 201) window.location.replace('/?alert=Welcome on board!');
});
