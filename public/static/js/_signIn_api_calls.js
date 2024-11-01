import axios from 'axios';

export const login = async function (email, password) {
  const res = await axios
    .post('/api/v1/user/login', {
      email,
      password,
    })
    .catch((err) => {
      console.log(err);
      // show error for user
    });
};

export const signup = async function (email, password, confirmPassword) {
  const res = await axios
    .post('/api/v1/user/signup', {
      email,
      password,
      confirmPassword,
    })
    .catch((err) => {
      console.log(err);
      // show error for user
    });
};
