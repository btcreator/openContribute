import { setAlert } from './_alert.js';

export const login = function (email, password) {
  return axios
    .post('/api/v1/user/login', {
      email,
      password,
    })
    .catch((err) => {
      setAlert(err.response.data.message, 'error');
    });
};

export const signup = function (email, password, confirmPassword) {
  return axios
    .post('/api/v1/user/signup', {
      email,
      password,
      confirmPassword,
    })
    .catch((err) => {
      setAlert(err.response.data.message, 'error');
    });
};
