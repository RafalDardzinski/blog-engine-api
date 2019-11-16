const { ApplicationModule } = require('../../core').Application;

// Imports
const { userDatabaseModel } = require('./models');
const UsersRepository = require('./users.repository');
const UsersService = require('./users.service');
const UsersController = require('./users.controller');

// Dependency injection
const usersRepository = new UsersRepository(userDatabaseModel);
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

module.exports = new ApplicationModule(usersRepository, usersService, usersController);
