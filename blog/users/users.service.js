const { UserDto } = require('./models');
const { NotFoundError, BadRequestError } = require('../../core').Error;

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
   * @throws {BadRequestError} User details must be provided.
   */
  async createUser(userDetails) {
    if (!userDetails) {
      // TODO: use Ensure utility.
      throw new BadRequestError('Missing user\'s details.');
    }

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
   * @throws {NotFoundError} User must exist.
   */
  async getUserByUsername(username) {
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
   * @throws {BadRequestError} Both username and newUserInfo must be defined.
   */
  async updateUserByUsername(username, newUserInfo) {
    if (!username || newUserInfo) {
      // TODO: Use ensure utility.
      throw new BadRequestError('Missing user\'s details.');
    }

    const usersRepository = _usersRepository.get(this);
    const user = await usersRepository.update({ username }, newUserInfo);
    return new UserDto(user);
  }

  /**
   * Searches for user by the username and deletes it.
   * @param {String} username Username of user to be deleted.
   */
  async deleteUser(username) {
    const usersRepository = _usersRepository.get(this);
    return usersRepository.delete({ username });
  }
}

module.exports = UsersService;

/**
 * @typedef {import('./users.repository')} UsersRepository
 */
