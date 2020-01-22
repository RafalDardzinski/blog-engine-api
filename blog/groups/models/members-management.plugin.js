const Joi = require('@hapi/joi');

const { SchemaPlugin } = require('../../../core/database');
const { Engine: { InvalidOperationError } } = require('../../../core/error');

/**
 * Checks if provided user instance is valid.
 * @param {MongooseDocument} user Instance of user document.
 * @throws User instance must exist and must contain _id path.
 */
function _validateUserInstance(user) {
  Joi.assert(user, Joi.object({
    id: Joi.string().exist(),
  }).unknown().exist(), new InvalidOperationError('User instance must contain \'_id\' path fetched.'));
}

/**
 * Checks if instance of a group contains 'members' path.
 * @param {MongooseDocument} docInstance Instance of a group.
 */
function _checkMembersPathPresence(docInstance) {
  Joi.assert(docInstance.members, Joi.array().exist(), new InvalidOperationError('Group instance must contain \'members\' path fetched.'));
}

/**
 * Checks if user is already in a group.
 * @param {MongooseDocument} user Instance of user document.
 */
function _isUserInGroup(user) {
  _checkMembersPathPresence(this);
  if (this.populated('members')) {
    this.depopulate('members');
  }

  _validateUserInstance(user);
  return this.members.includes(user.id);
}

/**
 * Adds user to the group.
 * @param {MongooseDocument} user Instance of user document.
 */
function _addUser(user) {
  _checkMembersPathPresence(this);
  this.depopulate('members');
  const isUserInGroup = this.isUserInGroup(user);
  if (isUserInGroup) {
    return;
  }

  this.members.push(user._id);
}

/**
 * Removes user from the group.
 * @param {MongooseDocument} user Instance of user document.
 */
function _removeUser(user) {
  _checkMembersPathPresence(this);
  this.depopulate('members');
  const isUserInGroup = this.isUserInGroup(user);
  if (!isUserInGroup) {
    return;
  }

  const memberIndex = this.members.findIndex(memberId => memberId.toString() === user.id);
  this.members.splice(memberIndex, 1);
}

/**
 * Provides functionalities for managing group members.
 */
class MemebersManagementPlugin extends SchemaPlugin {
  /**
   * @param {MongooseSchema} groupSchema Groups database schema.
   */
  functionality(groupSchema) {
    groupSchema.method('isUserInGroup', _isUserInGroup);
    groupSchema.method('addUser', _addUser);
    groupSchema.method('removeUser', _removeUser);
  }
}

module.exports = MemebersManagementPlugin;
/**
 * @typedef {import('mongoose').Schema} MongooseSchema
 * @typedef {import('mongoose').Document} MongooseDocument
 */
