import { setAlert } from './_alert.js';

function showError(err) {
  setAlert(err.response.data.message, 'error');
}

export const getProject = async function (id) {
  const project = await axios.get(`/api/v1/project/${id}`).catch(showError);
  return project?.data.data.project;
};

export const getContributedResources = async function (id) {
  const contributions = await axios.get(`/api/v1/contribution/myContributions?project=${id}`).catch(showError);

  // each object reprresents one contribution to a resource. Merge these to a conveniently usable object.
  return contributions?.data.data.contributions.reduce((acc, obj) => {
    if (acc[obj.resource]) acc[obj.resource] += obj.amount;
    else acc[obj.resource] = obj.amount;
    return acc;
  }, {});
};

export const updateProfile = function (updateObj) {
  return axios.patch('/api/v1/user/myProfile', updateObj).catch(showError);
};

export const passwordChange = function ({ password, newPassword, confirmPassword }) {
  return axios.patch('/api/v1/user/changeMyPassword', { password, newPassword, confirmPassword }).catch(showError);
};
