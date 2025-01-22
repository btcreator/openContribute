import showError from '../utils/showResponseError.js';

export const createContribution = function (project, resource, amount) {
  return axios
    .post('/api/v1/contribution/myContribution', {
      project,
      resource,
      amount,
    })
    .catch(showError);
};

export const getContributedResources = async function (id) {
  const contributions = await axios.get(`/api/v1/contribution/myContributions?project=${id}`).catch(showError);

  // each object represents one contribution to a resource. Merge these to a conveniently usable object.
  return contributions?.data.data.contributions.reduce((acc, obj) => {
    if (acc[obj.resource]) acc[obj.resource] += obj.amount;
    else acc[obj.resource] = obj.amount;
    return acc;
  }, {});
};