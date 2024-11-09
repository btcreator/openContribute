import { updateProfile, passwordChange } from './_profile_api_calls.js';
import { setAlert } from './_alert.js';

const btnChangePhoto = document.querySelector('.change-photo');
const userImage = document.querySelector('.photo-frame img');
const userNavImg = document.querySelector('.profile img');
const formSaveProfile = document.querySelector('.profile-form');
const formPasswordChange = document.querySelector('.password-change-form');
const fileInput = document.createElement('input');
fileInput.setAttribute('type', 'file');

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

// button for change photo is just a pseudo button for file input
btnChangePhoto.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', async function (ev) {
  const form = new FormData();
  form.append('userPhoto', ev.target.files[0]);

  const res = await updateProfile(form);
  if (res?.status === 200) {
    setAlert('Profile photo updated.');
    userImage.src = userNavImg.src = `/media/users/${res.data.data.user.photo}?t=${new Date().getTime()}`;
  }
});
