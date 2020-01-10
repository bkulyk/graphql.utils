/* jslint node: true */

const fs = require('fs');

module.exports = {
  fromFile: path => fs.readFileSync(path).toString(),
};
