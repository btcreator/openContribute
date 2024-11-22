import { setAlert } from './_alert.js';

export const getFeedData = async function (id, page) {
  const feedFlow = await axios
    .get(`/api/v1/feed/project/${id}?limit=10&page=${page}`)
    .catch((err) => setAlert(err.response.data.message, 'error'));

  return feedFlow?.data.data.feed;
};
