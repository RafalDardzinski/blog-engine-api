const Joi = require('@hapi/joi');

const { UserDto, UserCreate, UserUpdate } = require('./models');
const { BusinessLogic: { AuthorizationError, NotFoundError, ValidationError } } = require('../../error');

const _usersRepository = new WeakMap();

/**
 * Provides functionalities to manipulate Users collection.
 */
class UsersService {
  /**
   * @param {UsersRepository} usersRepository Instance of UsersRepository.
   */
  constructor(usersRepository) {
    _usersRepository.set(this, usersRepository);
  }

  /**
   * Creates a new user.
   * @param {Object} userDetails Data for the user to be created.
   * @returns {UserDto} Created user.
   */
  async createUser(userDetails) {
    Joi.assert(userDetails, Joi.object().exist(), 'Parameter \'userDetails\' must be provided and must be an object.');

    const usersRepository = _usersRepository.get(this);
    const userInfo = new UserCreate(userDetails);
    const createdUser = await usersRepository.create(userInfo);
    return new UserDto(createdUser);
  }

  /**
   * Gets list of all users.
   * @returns {UserDto[]} List of users.
   */
  async getUsers() {
    // TODO: Add pagination.
    const usersRepository = _usersRepository.get(this);
    const users = await usersRepository.getAll();
    return users.map(u => new UserDto(u));
  }

  /**
   * Gets user by its username.
   * @param {String} username User's username.
   * @throws Parameter username must be provided and must be a string.
   * @throws {NotFoundError} User must exist.
   */
  async getUserByUsername(username) {
    // TODO: change username to ID.
    Joi.assert(username, Joi.string().exist(), 'Parameter \'username\' must be provided and must be a string.');
    const usersRepository = _usersRepository.get(this);
    const user = await usersRepository.getOne({ username });
    if (!user) {
      throw new NotFoundError(`Could not find user: ${username}`);
    }

    return new UserDto(user);
  }

  /**
   * Searches for user by the username and updates its properties.
   * @param {String} username Username of the user to be updated.
   * @param {Object} newUserInfo New values for user's properties.
   * @throws Both username and newUserInfo must be defined.
   * @throws User with provided username must exist.
   */
  async updateUserByUsername(username, newUserInfo) {
    Joi.assert(username, Joi.string().exist(), 'Username must be provided and must be a string.');
    Joi.assert(newUserInfo, Joi.object().exist(), 'Data must be provided and must be an object.');

    const updatedProperties = new UserUpdate(newUserInfo);
    /** @type {UsersRepository} */
    const usersRepository = _usersRepository.get(this);
    const updatedUser = await usersRepository.update({ username, updatedProperties });
    return new UserDto(updatedUser);
  }

  /**
   * Searches for user by the username and deletes it.
   * @param {String} username Username of user to be deleted.
   * @throws Parameter username must be provided and must be a string.
   */
  async deleteUser(username) {
    Joi.assert(username, Joi.string().exist(), 'Parameter \'username\' must be provided and must be a string.');
    const usersRepository = _usersRepository.get(this);
    return usersRepository.delete({ username });
  }

  /**
   * Changes password for provided user.
   * @param {String} username Username of user to change password for.
   * @param {String} newPassword New password.
   * @param {String=} oldPassword User's old password. If not provided, requires additional
   * privileges.
   * @throws Parameter username must be provided and must be a string.
   * @throws Parameter newPassword must be provided and must be a string.
   * @throws User must exist.
   * @throws Current password must match provided oldPassword.
   * @throws If oldPassword is not provided, additional privileges needed.
   */
  async changePassword(username, newPassword, oldPassword) {
    Joi.assert(username, Joi.string().exist(), 'Parameter \'username\' must be provided and must be a string.');
    Joi.assert(newPassword, Joi.string().exist(), 'Parameter \'newPassword\' must be provided and must be a string.');

    if (!oldPassword) {
      // TODO: Provide actual mechanism for checking user privileges.
      throw new AuthorizationError('Specific privileges needed.');
    }

    /** @type {UsersRepository} */
    const usersRepository = _usersRepository.get(this);
    /** @type {MongooseDocument} */
    const user = await usersRepository.getOne({ username }, true);
    if (!user) {
      throw new NotFoundError(`Could not find user: ${username}`);
    }

    const doesPasswordMatchCurrentOne = await user.checkPassword(oldPassword);
    if (!doesPasswordMatchCurrentOne) {
      throw new ValidationError('Provided old password is not valid.');
    }

    await user.setPassword(newPassword);
    await user.save();
  }
}

module.exports = UsersService;

/**
 * @typedef {import('./users.repository')} UsersRepository
 * @typedef {import('mongoose').MongooseDocument} MongooseDocument
 */
