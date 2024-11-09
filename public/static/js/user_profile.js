import { updateProfile, passwordChange } from './_profile_api_calls.js';
import { setAlert } from './_alert.js';

const btnChangePhoto = document.querySelector('.change-photo');
const formSaveProfile = document.querySelector('.profile-form');
const formPasswordChange = document.querySelector('.password-change-form');

formSaveProfile.addEventListener('submit', async function (ev) {
  ev.preventDefault();
  const submitBtn = ev.target.querySelector('button');
  submitBtn.disabled = true;
  submitBtn.innerText = 'Updating...';

  const form = new FormData(this);

  const res = await updateProfile({
    name: form.get('fullName'),
    alias: form.get('alias'),
  });

  submitBtn.disabled = false;
  submitBtn.innerText = 'Save';
  if (res?.status === 200) setAlert('Profile updated successfully');
});

formPasswordChange.addEventListener('submit', async function (ev) {
  ev.preventDefault();
  const form = new FormData(this);

  const res = await passwordChange({
    password: form.get('password'),
    newPassword: form.get('newPassword'),
    confirmPassword: form.get('confirmPassword'),
  });

  if (res?.status === 200) window.location.replace('/login/?alert=Please Log in with your new password.');
});
