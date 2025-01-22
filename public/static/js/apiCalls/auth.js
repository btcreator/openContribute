import showError from './../utils/showResponseError.js';

export const login = function (email, password) {
  return axios
    .post('/api/v1/user/login', {
      email,
      password,
    })
    .catch(showError);
};

export const signup = function (email, password, confirmPassword) {
  return axios
    .post('/api/v1/user/signup', {
      email,
      password,
      confirmPassword,
    })
    .catch(showError);
};
