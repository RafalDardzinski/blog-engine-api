const users = require('./users');
const groups = require('./groups');

const modules = {
  users,
  groups,
};
Object.freeze(modules);

module.exports = modules;
