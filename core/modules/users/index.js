const CoreModule = require('../core-module');

// Imports
const { userDatabaseModel } = require('./models');
const UsersRepository = require('./users.repository');
const UsersService = require('./users.service');
const UsersController = require('./users.controller');
const USERS_PERMISSIONS = require('./users.permissions');

// Dependency injection
const usersRepository = new UsersRepository(userDatabaseModel);
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

module.exports = new CoreModule(
  usersRepository, usersService, usersController, USERS_PERMISSIONS,
);
