const fs = require('node:fs');
const { serverLog } = require('./helpers');

// update busboy - see comments in the file for more information
try {
  const exists = fs.existsSync('./node_modules/busboy/lib/types/multipart.js');

  if (exists) fs.copyFileSync('./utils/_customBusboy_multipart.js', './node_modules/busboy/lib/types/multipart.js');
  else throw new Error('File does not exists to overwrite in: /node_modules/busboy/lib/types/multipart.js');

  serverLog('Busboy updated.');
} catch (err) {
  if (err.path) serverLog(`Path: ${err.path} - could not be copied!`);
  else serverLog(err.message);

  throw new Error("Busboy couldn't be updated.");
}
