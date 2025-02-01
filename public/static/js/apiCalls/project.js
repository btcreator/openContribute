import showError from './../utils/showResponseError.js';

export const getProject = async function (id) {
  const response = await axios.get(`/api/v1/project/${id}`).catch(showError);
  return response?.data.data.project;
};

export const updateProject = function (id, updateObj) {
  return axios.patch(`/api/v1/project/myProject/${id}`, updateObj).catch(showError);
};

export const findProjects = function (searchText, filterOptions) {
  let filterStr = '';
  for (const [key, val] of Object.entries(filterOptions)) filterStr += `&${key}=${val}`;

  return axios.get(`/api/v1/project/search?name=${searchText}${filterStr}`).catch(showError);
};
