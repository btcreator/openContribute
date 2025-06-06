const fsP = require('fs/promises');
const { serverLog } = require('../../utils/helpers');

const _forceRemoveOpt = {
  force: true,
  maxRetries: 2,
  retryDelay: 100,
  recursive: true,
};

// On DELETE
////
// When the resource gets deleted and has an image (user with photo), remove the photo
// Use for sensitive data, where must be sure that the image gets removed. When removal fails, gets logged, so can be investigated by the sever supervisor
exports.removeImage = async function (path, filename) {
  try {
    if (filename.endsWith('.png')) await fsP.rm(`${path}${filename}`);
    else serverLog('File could not be removed on path: ', `${path}${filename}`);
  } catch {
    serverLog('File error during removal.', `${path}${filename}`);
  }
};

// Mass removal of images/files
exports.removeFiles = function (path, filenames) {
  filenames.forEach((fname) => fsP.rm(`${path}${fname}`, _forceRemoveOpt));
};

// On UPDATE
////
// Rename image(s) on the disk when the resource (user, project...) has images already - use by update
// "from" is the files object generated by multer. - then its an array
//        or when more files was uploaded to one field, each file is represented as object
// "to" is an object with fieldname and the new filename { fieldname: filename }
exports.updateFilesOnDisk = async function (from, to) {
  for (let key of Object.keys(to)) {
    if (!from[key]) continue;

    let file = from[key];
    if (Array.isArray(file)) file = file[0];

    const source = `${file.destination}${file.filename}`;
    const target = `${file.destination}${to[key]}`;

    // copy (overwrite when exists), then remove the source file
    await fsP.copyFile(source, target);
    fsP.rm(source, _forceRemoveOpt);
  }
};

//On ERROR or something unexpected
////
exports.clearImages = function (files) {
  if (!files) return;
  // the rm is a promise based method, and it gets not awaited on purpose - its not get throw an error, because of force option. Remove the files in background.
  Object.keys(files).forEach((key) => {
    files[key].forEach((fileObj) => {
      fsP.rm(`${fileObj.destination}${fileObj.filename}`, _forceRemoveOpt);
    });
  });
};
