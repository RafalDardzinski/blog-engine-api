const Joi = require('@hapi/joi');

const { UserDto, UserCreate, UserUpdate } = require('./models');
const { BusinessLogic: { AuthorizationError, NotFoundError, ValidationError } } = require('../../core/error');

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
    const userInfo = new UserCreate(userDetails);
    const createdUser = await usersRepository.create(userInfo);
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
   * @throws User with provided username must exist.
   */
  async updateUserByUsername(username, newUserInfo) {
    Joi.assert(username, Joi.string().exist(), 'Username must be provided and must be a string.');
    Joi.assert(newUserInfo, Joi.object().exist(), 'Data must be provided and must be an object.');

    const updatedProperties = new UserUpdate(newUserInfo);
    const usersRepository = _usersRepository.get(this);

    try {
      const user = await usersRepository.update({ username }, updatedProperties);
      return new UserDto(user);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new ValidationError('There is no user with provided username.');
      }

      throw error;
    }
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

  /**
   * Changes password for provided user.
   * @param {String} username Username of user to change password for.
   * @param {String} newPassword New password.
   * @param {String=} oldPassword User's old password. If not provided, requires additional
   * privileges.
   * @throws {NotFoundError} User must exist.
   * @throws {ValidationError} Current password must match provided oldPassword.
   * @throws {AuthorizationError} If oldPassword is not provided, additional privileges needed.
   */
  async changePassword(username, newPassword, oldPassword) {
    Joi.assert(username, Joi.string().exist(), 'Username must be provided and must be a string.');
    Joi.assert(newPassword, Joi.string().exist(), 'New password must be provided and must be a string.');

    if (!oldPassword) {
      // TODO: Provide actual mechanism for checking user privileges.
      throw new AuthorizationError('Specific privileges needed.');
    }

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
