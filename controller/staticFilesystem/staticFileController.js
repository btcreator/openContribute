const fsP = require('fs/promises');
const { serverLog } = require('../../utils/helpers');

exports.removeFile = async function (path, filename) {
  if (filename.endsWith('.png')) await fsP.rm(`${path}${filename}`);
  else serverLog('File could not be removed on path: ', `${path}${filename}`);
};

exports.renameTempFiles = async function (tempFiles) {
  tempFiles.forEach(async ({ path, filename }) => {
    await fsP.rename(`${path}temp_${filename}`, `${path}${filename}`);
  });
};
