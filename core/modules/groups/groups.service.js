const Joi = require('@hapi/joi');

const { BusinessLogic: { NotFoundError } } = require('../../error');
const {
  GroupDto, GroupCreate, GroupUpdate, GroupQueryFilter,
} = require('./models');

const _usersRepository = new WeakMap();
const _groupsRepository = new WeakMap();

class GroupsService {
  constructor(groupsRepository, usersRepository) {
    _groupsRepository.set(this, groupsRepository);
    _usersRepository.set(this, usersRepository);
  }

  /**
   * Creates a new group.
   * @param {Object} groupDetails Data for the group to be created.
   * @throws Parameter groupDetails must be provided.
   * @returns {GroupDto} Created group.
   */
  async createGroup(groupDetails) {
    Joi.assert(groupDetails, Joi.object().exist(), 'Parameter \'groupDetails\' must be provided and must be an object.');

    /** @type {GroupsRepository} */
    const groupsRepository = _groupsRepository.get(this);

    const groupInfo = new GroupCreate(groupDetails);
    const createdGroup = await groupsRepository.create(groupInfo);
    return new GroupDto(createdGroup);
  }

  /**
   * Gets a list of all groups.
   * @para
   * @returns {GroupDto[]} List of groups.
   */
  async getGroups() {
    // TODO: Add pagination
    /** @type {GroupsRepository} */
    const groupsRepository = _groupsRepository.get(this);

    const groups = await groupsRepository.getAll();
    return groups.map(g => new GroupDto(g));
  }

  /**
   * Gets a group by it's id.
   * @param {string} id Group id.
   * @throws Parameter id must be provided and must be a string.
   * @throws Group must exist.
   * @return {GroupDto} Found group.
   */
  async getGroupById(id) {
    Joi.assert(id, Joi.string().exist(), 'Parameter \'id\' must be provided and must be a string.');

    /** @type {GroupsRepository} */
    const groupsRepository = _groupsRepository.get(this);
    const group = await groupsRepository.getOne({ _id: id });
    if (!group) {
      throw new NotFoundError(`Group with id: '${id}' does not exist.`);
    }

    return new GroupDto(group);
  }

  /**
   * Gets a list of all groups that contain provided id in their members path.
   * @param {String} memberId Id of a member to search for group by.
   * @throws Parameter 'memberId' must be provided and must be a string.
   */
  async getGroupsByMember(memberId) {
    Joi.assert(memberId, Joi.string().exist(), 'Parameter \'memberId\' must be provided and must be a string.');

    /** @type {UsersRepository} */
    const usersRepository = _usersRepository.get(this);
    const user = await usersRepository.getOne({ _id: memberId });
    if (!user) {
      throw new NotFoundError(`User with provided id: ${memberId} does not exist.`);
    }

    const queryFilter = new GroupQueryFilter({
      membersFilter: memberId,
    });

    /** @type {GroupsRepository} */
    const groupsRepository = _groupsRepository.get(this);
    const groups = await groupsRepository.getAll(queryFilter);
    return groups.map(g => new GroupDto(g));
  }

  /**
   * Searches for group by id and updates its properties.
   * @param {String} groupId Id of a group to be updated.
   * @param {Object} newGroupDetails New values for group's properties.
   * @throws Parameter groupId must be provided and must be a string.
   * @throws Parameter newGroupDetails be provided and must be an object.
   */
  async updateGroup(groupId, newGroupDetails) {
    Joi.assert(groupId, Joi.string().exist(), 'Parameter \'groupId\' must be provided and must be a string.');
    Joi.assert(newGroupDetails, Joi.object().exist(), 'Parameter \'newGroupDetails\' be provided and must be an object');

    const updatedProperties = new GroupUpdate(newGroupDetails);
    /** @type {GroupsRepository} */
    const groupsRepository = _groupsRepository.get(this);
    const updatedGroup = await groupsRepository.update({ _id: groupId }, updatedProperties);
    return new GroupDto(updatedGroup);
  }

  /**
   * Deletes a group.
   * @param {String} groupId Id of a group to be deleted.
   * @throws Parameter groupId must be provided and must be a string.
   */
  async deleteGroup(groupId) {
    Joi.assert(groupId, Joi.string().exist(), 'Parameter \'groupId\' must be provided and must be a string.');

    /** @type {GroupsRepository} */
    const groupsRepository = _groupsRepository.get(this);
    await groupsRepository.delete({ _id: groupId });
  }

  /**
   * Adds permissions to specified group.
   * @param {String} groupName Name of a group.
   * @param {String[]} permissions List of permissions to add.
   * @throws Parameter groupId must be provided and must be a string.
   * @throws Parameter permissions must be provided and must be an array.
   * @throws Group with provided groupId must exist.
   */
  async addPermissions(groupId, permissions) {
    Joi.assert(groupId, Joi.string().exist(), 'Parameter \'groupId\' must be provided and must be a string.');
    Joi.assert(permissions, Joi.array().exist(), 'Parameter \'permissions\' must be provided and must be an array.');

    /** @type {GroupsRepository} */
    const groupsRepository = _groupsRepository.get(this);
    const group = await groupsRepository.getOne({ _id: groupId });
    if (!group) {
      throw new NotFoundError(`Group with provided id: '${groupId}' does not exist.`);
    }

    group.addPermissions(permissions);
    await group.save();
  }

  /**
   * Removes permissions from specific group.
   * @param {String} groupName Name of a group.
   * @param {String[]} permissions List of permissions to remove.
   * @throws Parameter groupId must be provided and must be a string.
   * @throws Parameter permissions must be provided and must be an array.
   * @throws Group with provided groupId must exist.
   */
  async removePermissions(groupId, permissions) {
    Joi.assert(groupId, Joi.string().exist(), 'Parameter \'groupId\' must be provided and must be a string.');
    Joi.assert(permissions, Joi.array().exist(), 'Parameter \'permissions\' must be provided and must be an array.');

    /** @type {GroupsRepository} */
    const groupsRepository = _groupsRepository.get(this);
    const group = await groupsRepository.getOne({ _id: groupId });
    if (!group) {
      throw new NotFoundError(`Group with provided id: '${groupId}' does not exist.`);
    }

    group.removePermissions(permissions);
    await group.save();
  }

  /**
   * Adds specified user to a specified group.
   * @param {String} groupId Id of a group to add user to.
   * @param {String} userId Id of an user to add to a group.
   * @throws Parameter groupId must be provided and must be a string.
   * @throws Parameter userId must be provided and must be a string.
   * @throws Group with provided groupId must exist.
   * @throws User with provided userId must exist.
   */
  async addUserToGroup(groupId, userId) {
    Joi.assert(groupId, Joi.string().exist(), 'Parameter \'groupId\' must be provided and must be a string.');
    Joi.assert(groupId, Joi.string().exist(), 'Parameter \'userId\' must be provided and must be a string.');

    /** @type {GroupsRepository} */
    const groupsRepository = _groupsRepository.get(this);
    const group = await groupsRepository.getOne({ _id: groupId });
    if (!group) {
      throw new NotFoundError(`Group with provided id: ${groupId} does not exist.`);
    }

    /** @type {UsersRepository} */
    const usersRepository = _usersRepository.get(this);
    const user = await usersRepository.getOne({ _id: userId });
    if (!user) {
      throw new NotFoundError(`User with provided id: ${userId} does not exist.`);
    }

    group.addUser(user);
    await group.save();
  }

  /**
   * Removes specified user from a specified group.
   * @param {String} groupId Id of a group to remove a user from.
   * @param {String} userId Id of an user to remove from a group.
   * @throws Parameter groupId must be provided and must be a string.
   * @throws Parameter userId must be provided and must be a string.
   * @throws Group with provided groupId must exist.
   */
  async removeUserFromGroup(groupId, userId) {
    Joi.assert(groupId, Joi.string().exist(), 'Parameter \'groupId\' must be provided and must be a string.');
    Joi.assert(groupId, Joi.string().exist(), 'Parameter \'userId\' must be provided and must be a string.');

    /** @type {GroupsRepository} */
    const groupsRepository = _groupsRepository.get(this);
    const group = await groupsRepository.getOne({ _id: groupId });
    if (!group) {
      throw new NotFoundError(`Group with provided id: ${groupId} does not exist.`);
    }

    /** @type {UsersRepository} */
    const usersRepository = _usersRepository.get(this);
    const user = await usersRepository.getOne({ _id: userId });
    if (!user) {
      return;
    }

    group.removeUser(user);
    await group.save();
  }
}

module.exports = GroupsService;
/**
 * @typedef {import('./groups.repository')} GroupsRepository
 * @typedef {import('../users/users.repository')} UsersRepository
 */
