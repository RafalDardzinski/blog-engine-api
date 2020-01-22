const {
  Database: { Repository },
} = require('../../core');
const { GroupQueryFilter } = require('./models');

const _groupModel = new WeakMap();

class GroupsRepository extends Repository {
  /**
   * @param {DatabaseModel} groupModel Built group database model.
   */
  constructor(groupModel) {
    super(groupModel, _groupModel);
  }

  /**
   * Creates a new group.
   * @param {Object} groupInfo Data to create a group from.
   */
  async create(groupInfo) {
    /** @type {Model} */
    const GroupModel = _groupModel.get(this).query();
    const newGroup = new GroupModel(groupInfo);
    return newGroup.save();
  }

  /**
   * Gets a group based on provided criteria.
   * @param {Object} groupInfo Group search criteria.
   */
  async getOne(groupInfo) {
    /** @type {Model} */
    const GroupModel = _groupModel.get(this).query();
    return GroupModel.findOne(groupInfo);
  }

  /**
   * Gets all groups from the repository.
   * @param filter {GroupQueryFilter=} Object used for defining query filters.
   * TODO: Add pagination.
   */
  async getAll(filter = new GroupQueryFilter()) {
    /** @type {Model} */
    const GroupModel = _groupModel.get(this).query();
    return GroupModel.find(filter.getFilterObject()).populate({ path: 'members', select: '_id' });
  }

  /**
   * Gets groups that member belongs to.
   * @param {String} memberId Id of a member.
   */
  async getByMember(memberId) {
    /** @type {Model} */
    const GroupModel = _groupModel.get(this).query();
    return GroupModel.find({ members: memberId });
  }

  /**
   * Changes group's data.
   * @param {Object} groupInfo Search criteria to find a group to be updated.
   * @param {Object} newGroupInfo New values for existing group properties.
   */
  async update(groupInfo, newGroupInfo) {
    /** @type {Model} */
    const GroupModel = _groupModel.get(this).query();
    return GroupModel.findOneAndUpdate(groupInfo, newGroupInfo, {
      runValidators: true,
      context: 'query',
      new: true,
    });
  }

  /**
   * Deletes a group from the database.
   * @param {Object} groupInfo Search criteria to find a group to be deleted.
   */
  async delete(groupInfo) {
    /** @type {Model} */
    const GroupModel = _groupModel.get(this).query();
    return GroupModel.findOneAndDelete(groupInfo);
  }
}

module.exports = GroupsRepository;
/**
 * @typedef {import('../../core/database/model')} DatabaseModel
 * @typedef {import('mongoose').Model} Model
 */
