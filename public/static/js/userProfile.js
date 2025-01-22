import { updateProfile, passwordChange } from './apiCalls/profile.js';
import { setAlert } from './utils/alert.js';

// Image containers - in profile and top navigation
const userImage = document.querySelector('.photo-frame img');
const userNavImg = document.querySelector('.profile img');
// Select forms
const formSaveProfile = document.querySelector('.profile-form');
const formPasswordChange = document.querySelector('.password-change-form');
// Pseudo button for file input
const btnChangePhoto = document.querySelector('.change-photo');
// File input for user image change button
const fileInput = document.createElement('input');
fileInput.setAttribute('type', 'file');

// Update profile
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

// Update/Change Password
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

// Update/Change photo
btnChangePhoto.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', async function (ev) {
  fileInput.disabled = true;
  const form = new FormData();
  form.append('userPhoto', ev.target.files[0]);

  const res = await updateProfile(form);
  if (res?.status === 200) {
    setAlert('Profile photo updated.');
    userImage.src = userNavImg.src = `/media/users/${res.data.data.user.photo}?t=${new Date().getTime()}`;
  }
  fileInput.disabled = false;
});
