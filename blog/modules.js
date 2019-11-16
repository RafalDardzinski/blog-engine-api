const { ApplicationModulesManager } = require('../core/application');

const users = require('./users');

const modules = {
  users,
};
Object.freeze(modules);

module.exports = new ApplicationModulesManager(modules);
