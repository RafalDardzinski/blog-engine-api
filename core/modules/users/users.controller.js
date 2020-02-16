const { Controller } = require('../../web');

class UsersController extends Controller {
  /**
   * @param {UsersService} usersService Instance of UsersService class.
   */
  constructor(usersService) {
    super('/users');
    this.usersService = usersService;

    this.registerRoute('get', '/', this.getAllUsers);
    this.registerRoute('get', '/:username', this.getUser);
    this.registerRoute('post', '/', this.createUser);
    this.registerRoute('delete', '/:username', this.deleteUser);
    this.registerRoute('put', '/:username', this.updateUser);
    this.registerRoute('put', '/:username/password', this.changePassword);
  }

  async getAllUsers(req, res) {
    const users = await this.usersService.getUsers();
    res.json(users);
  }

  async getUser(req, res) {
    const { username } = req.params;
    const user = await this.usersService.getUserByUsername(username);
    res.json(user);
  }

  async createUser(req, res) {
    const user = await this.usersService.createUser(req.body);
    res.json(user);
  }

  async deleteUser(req, res) {
    const { username } = req.params;
    await this.usersService.deleteUser(username);
    res.sendStatus(200);
  }

  async updateUser(req, res) {
    const { username } = req.params;
    const updatedUser = await this.usersService.updateUserByUsername(username, req.body);
    res.json(updatedUser);
  }

  async changePassword(req, res) {
    const { username } = req.params;
    const { oldPassword, newPassword } = req.body;
    await this.usersService.changePassword(username, newPassword, oldPassword);

    res.sendStatus(200);
  }
}

module.exports = UsersController;
/**
 * @typedef {import('./users.service')} UsersService
 */
