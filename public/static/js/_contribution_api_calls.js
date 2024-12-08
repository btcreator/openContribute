import { setAlert } from './_alert.js';

export const createContribution = function (project, resource, amount) {
  return axios
    .post('/api/v1/contribution/myContribution', {
      project,
      resource,
      amount,
    })
    .catch((err) => {
      console.log(err);
      setAlert(err.response.data.message, 'error');
    });
};
