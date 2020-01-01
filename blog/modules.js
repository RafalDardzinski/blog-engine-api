const { ApplicationModulesManager } = require('../core/application');

const users = require('./users');
const groups = require('./groups');

const modules = {
  users,
  groups,
};
Object.freeze(modules);

module.exports = new ApplicationModulesManager(modules);
