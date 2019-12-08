const Joi = require('@hapi/joi');

const { UserDto } = require('./models');
const { NotFoundError } = require('../../core').Error;

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
   */
  async createUser(userDetails) {
    Joi.assert(userDetails, Joi.object().exist(), 'userDetails must be provided and must be an object.');
    const usersRepository = _usersRepository.get(this);
    const createdUser = await usersRepository.create(userDetails);
    return new UserDto(createdUser);
  }

  /**
   * Gets all users.
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
   * @throws Parameter username must be provided.
   * @throws {NotFoundError} User must exist.
   */
  async getUserByUsername(username) {
    Joi.assert(username, Joi.string().exist(), 'Username must be provided and must be a string.');
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
   */
  async updateUserByUsername(username, newUserInfo) {
    Joi.assert(username, Joi.string().exist(), 'Username must be provided and must be a string.');
    Joi.assert(newUserInfo, Joi.object().exist(), 'Data must be provided and must be an object.');

    const usersRepository = _usersRepository.get(this);
    const user = await usersRepository.update({ username }, newUserInfo);
    return new UserDto(user);
  }

  /**
   * Searches for user by the username and deletes it.
   * @param {String} username Username of user to be deleted.
   */
  async deleteUser(username) {
    Joi.assert(username, Joi.string().exist(), 'Username must be provided and must be a string.');
    const usersRepository = _usersRepository.get(this);
    return usersRepository.delete({ username });
  }
}

module.exports = UsersService;

/**
 * @typedef {import('./users.repository')} UsersRepository
 */