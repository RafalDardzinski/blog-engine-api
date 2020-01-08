const {
  Database: { Repository },
} = require('../../core');

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
   * TODO: Add pagination.
   */
  async getAll() {
    /** @type {Model} */
    const GroupModel = _groupModel.get(this).query();
    return GroupModel.find({}).populate({ path: 'members', select: '_id' });
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
