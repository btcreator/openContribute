import showError from './../utils/showResponseError.js';

export const updateProfile = function (updateObj) {
  return axios.patch('/api/v1/user/myProfile', updateObj).catch(showError);
};

export const passwordChange = function ({ password, newPassword, confirmPassword }) {
  return axios.patch('/api/v1/user/changeMyPassword', { password, newPassword, confirmPassword }).catch(showError);
};

export const myProfile = function () {
  return axios.get('/api/v1/user/myProfile').catch(showError);
};
