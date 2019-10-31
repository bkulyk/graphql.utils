/* jslint node: true */

module.exports = {
  getOperationNameFromQuery: (query) => {
    if (!query) {
      return null;
    }
    const match = query.match(/^query\s(\w+)\s*?/);
    return match ? match[1] : null;
  }
};
