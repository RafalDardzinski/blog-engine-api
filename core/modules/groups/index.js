const CoreModule = require('../core-module');

const { repository: usersRepository } = require('../users');

const { groupDatabaseModel } = require('./models');
const GroupsRepository = require('./groups.repository');
const GroupsService = require('./groups.service');
const GroupsController = require('./groups.controller');

const groupsRepository = new GroupsRepository(groupDatabaseModel);
const groupsService = new GroupsService(groupsRepository, usersRepository);
const groupsController = new GroupsController(groupsService);

module.exports = new CoreModule(groupsRepository, groupsService, groupsController);
