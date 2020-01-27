const { Repository } = require('../../database');

const _userModel = new WeakMap();

class UsersRepository extends Repository {
  /**
   * @param {DatabaseModel} userModel Built user database model.
   */
  constructor(userModel) {
    super(userModel, _userModel);
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
   * Gets all users from the repository.
   * TODO: Add pagination.
   */
  async getAll() {
    /** @type {Model} */
    const UserModel = _userModel.get(this).query();
    const users = await UserModel.find().select('-password');
    return users;
  }

  /**
   * Changes user's data.
   * @param {Object} userInfo Search criteria to find a user to be updated.
   * @param {Object} newUserInfo New values for existing user's properties.
   */
  async update(userInfo, newUserInfo) {
    /** @type {Model} */
    const UserModel = _userModel.get(this).query();

    return UserModel.findOneAndUpdate(userInfo, newUserInfo, {
      runValidators: true,
      context: 'query',
      new: true,
    });
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
