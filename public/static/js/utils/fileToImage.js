// Convert supported files, and return true if media was supported, else false
export default function (file, cb) {
  if (file.type.startsWith('image')) {
    cb(URL.createObjectURL(file), file);
    return true;
  } else if (file.type === 'video/mp4') {
    grabVideoFirstFrameAsImg(file, cb);
    return true;
  }
  return false;
}

// Convert video first frame to image (take a "screenshot" from the first frame)
function grabVideoFirstFrameAsImg(file, cb) {
  const video = document.createElement('video');
  video.src = URL.createObjectURL(file);

  // seek video to first frame (0sec)
  video.addEventListener(
    'loadeddata',
    () => {
      video.currentTime = 0;
    },
    { once: true }
  );

  // when video is on first frame, take that frame as image
  video.addEventListener(
    'seeked',
    () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      cb(canvas.toDataURL(), file);
    },
    { once: true }
  );
}
