// Youtube loader for embedded youtube videos (in feed)
export const loadYTvideo = function (playerId, videoId) {
  new YT.Player(playerId, {
    height: '360',
    width: '640',
    videoId,
  });
};
