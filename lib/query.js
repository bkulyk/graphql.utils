/* jslint node: true */

const fs = require('fs');

const fromFile = (path) => {
  return fs.readFileSync(path).toString();
};

module.exports = {
  fromFile
};
