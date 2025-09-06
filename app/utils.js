// Utility functions
function isUrl(str) {
  return /^https?:\/\//i.test(str);
}

module.exports = { isUrl };
