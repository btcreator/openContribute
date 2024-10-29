const { AxiosHeaders } = require('axios');

const loginForm = document.querySelector('#login-form');
const signupForm = document.querySelector('#signup-form');

loginForm.addEventListener('submit', async (ev) => {
  try {
    ev.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await axios.post(
      '/api/v1/user/login',
      {
        email,
        password,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    console.log(res);
  } catch (err) {
    console.log(err.message);
  }
});
