import showError from "./../utils/showResponseError.js"

export const getProject = async function (id) {
  const project = await axios.get(`/api/v1/project/${id}`).catch(showError);
  return project?.data.data.project;
};

export const updateProject = function (id, updateObj) {
  return axios.patch(`/api/v1/project/myProject/${id}`, updateObj).catch(showError);
};
