const {
  Database: { Repository },
  Error: { NotFoundError },
} = require('../../core');

const _userModel = new WeakMap();

class UsersRepository extends Repository {
  /**
   * @param {DatabaseModel} userModel Built user database model.
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
    const UserModel = _userModel.get(this).query();
    const users = await UserModel.find().select('-password');
    return users;
  }

  /**
   * Fetches user that meets specified criteria.
   * @param {Object} userInfo User search criteria.
   * @param {Boolean} [includePassword=false] If true, returns password path.
   */
  async getOne(userInfo, includePassword = false) {
    /** @type {Model} */
    const UserModel = _userModel.get(this).query();
    const query = UserModel.findOne(userInfo);
    if (!includePassword) {
      query.select('-password');
    }

    return query.exec();
  }

  /**
   * Creates a new user.
   * @param {Object} userInfo Data to create a user from.
   */
  async create(userInfo) {
    /** @type {Model} */
    const UserModel = _userModel.get(this).query();
    const newUser = new UserModel(userInfo);
    await newUser.setPassword(userInfo.password);
    return newUser.save();
  }

  /**
   * Changes user's data.
   * @param {Object} userInfo Search criteria to find a user to be updated.
   * @param {Object} newUserInfo New values for existing user's properties.
   * @throws {NotFoundError} User must exist.
   */
  async update(userInfo, newUserInfo) {
    /** @type {Model} */
    const userToUpdate = await this.getOne(userInfo);

    if (!userToUpdate) {
      throw new NotFoundError('Provided user cannot be found.');
    }

    userToUpdate.email = newUserInfo.email || userToUpdate.email;
    userToUpdate.isActive = newUserInfo.isActive || userToUpdate.isActive;

    return userToUpdate.save();
  }

  /**
   * Deletes user from the database.
   * @param {Object} userInfo Search criteria to find a user to be deleted.
   */
  async delete(userInfo) {
    /** @type {Model} */
    const UserModel = _userModel.get(this).query();
    return UserModel.findOneAndDelete(userInfo);
  }
}

module.exports = UsersRepository;
/**
 * @typedef {import('../../core/database/model')} DatabaseModel
 * @typedef {import('mongoose').Model} Model
 */
