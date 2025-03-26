import showError from '../utils/showResponseError.js';

export const getFeedData = async function (id, page) {
  const feedFlow = await axios.get(`/api/v1/feed/project/${id}?limit=10&page=${page}`).catch(showError);

  return feedFlow?.data.data.feed;
};

export const createFeed = async function (feedData) {
  const newFeed = await axios.post(`/api/v1/feed/myFeed`, feedData).catch((err) => {
    console.dir(err);
    showError(err);
  });

  return newFeed?.data.data.feed;
};
