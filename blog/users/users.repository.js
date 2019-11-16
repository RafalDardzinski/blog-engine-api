const {
  Database: { Repository },
  Error: { NotFoundError },
} = require('../../core');
const { UserCreateEntity, UserUpdateEntity } = require('./models');

const _userModel = new WeakMap();

class UsersRepository extends Repository {
  /**
   * @param {UserModel} userModel
   */
  constructor(userModel) {
    super(userModel, _userModel);
  }

  /**
   * Fetches all users from the repository.
   * TODO: Add pagination.
   */
  async getAll() {
    /** @type {Model} */
    const userModel = _userModel.get(this).query();
    const users = await userModel.find().select('-password');
    return users.map(u => u.toObject());
  }

  /**
   * Fetches user that meets specified criteria.
   * @param {Object} userInfo User search criteria.
   */
  async getOne(userInfo) {
    /** @type {Model} */
    const userModel = _userModel.get(this).query();
    const user = await userModel.findOne(userInfo).select('-password');
    return user ? user.toObject() : undefined;
  }

  /**
   * Creates a new user.
   * @param {Object} userInfo Data to create a user from.
   */
  async create(userInfo) {
    const userToCreate = new UserCreateEntity(userInfo);
    /** @type {Model} */
    const userModel = _userModel.get(this).query();
    const user = await userModel.create(userToCreate);
    const createdUser = user.toObject();
    delete createdUser.password;
    return createdUser;
  }

  /**
   * Changes user's data.
   * @param {Object} userInfo Search criteria to find a user to be updated.
   * @param {Object} newUserInfo New values for existing user's properties.
   * @throws {NotFoundError} User must exist.
   */
  async update(userInfo, newUserInfo) {
    const updatedEntity = new UserUpdateEntity(newUserInfo);
    /** @type {Model} */
    const userModel = _userModel.get(this).query();
    const user = await userModel.findOne(userInfo);
    if (!user) {
      throw new NotFoundError('Cannot update user that does not exist.');
    }

    Object.assign(user, updatedEntity);
    return user.save().toObject();
  }

  /**
   * Deletes user from the database.
   * @param {Object} userInfo Search criteria to find a user to be deleted.
   */
  async delete(userInfo) {
    /** @type {Model} */
    const userModel = _userModel.get(this).query();
    await userModel.deleteOne(userInfo);
  }
}

module.exports = UsersRepository;
/**
 * @typedef {import('../../core/database/model')} UserModel
 * @typedef {import('mongoose').Model} Model
 */
