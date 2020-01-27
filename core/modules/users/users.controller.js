const { Controller, Route } = require('../../web');

class UsersController extends Controller {
  /**
   * @param {UsersService} usersService Instance of UsersService class.
   */
  constructor(usersService) {
    super('/users');
    this.usersService = usersService;
    this.registerRoutes([
      new Route('get', '/', this.getAllUsers),
      new Route('get', '/:username', this.getUser),
      new Route('post', '/', this.createUser),
      new Route('delete', '/:username', this.deleteUser),
      new Route('put', '/:username', this.updateUser),
      new Route('put', '/:username/password', this.changePassword),
    ]);
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
