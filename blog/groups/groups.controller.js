const { Controller, Route } = require('../../core/web');

class GroupsController extends Controller {
  /**
   * @param {GroupsService} groupsService Instance of GroupsService class.
   */
  constructor(groupsService) {
    super('/groups');
    this.groupsService = groupsService;
    this.registerRoutes([
      new Route('post', '/', this.createGroup),
      new Route('get', '/', this.getGroups),
      new Route('get', '/:groupId', this.getGroupById),
      new Route('put', '/:groupId', this.updateGroup),
      new Route('delete', '/:groupId', this.deleteGroup),
      new Route('post', '/:groupId/users', this.addUserToGroup),
      new Route('delete', '/:groupId/users', this.removeUserFromGroup),
      new Route('post', '/:groupId/permissions', this.addPermissions),
      new Route('delete', '/:groupId/permissions', this.removePermissions),
    ]);
  }

  async createGroup(req, res) {
    const group = await this.groupsService.createGroup(req.body);
    res.json(group);
  }

  async getGroups(req, res) {
    const groups = await this.groupsService.getGroups();
    res.json(groups);
  }

  async getGroup(req, res) {
    const { groupId } = req.params;
    const groupDetails = await this.groupsService.getGroupById(groupId);
    res.json(groupDetails);
  }

  async updateGroup(req, res) {
    const { groupId } = req.params;
    const updatedProperties = req.body;
    const updatedGroup = await this.groupsService.updateGroup(groupId, updatedProperties);
    res.json(updatedGroup);
  }

  async deleteGroup(req, res) {
    const { groupId } = req.params;
    await this.groupsService.deleteGroup(groupId);
    res.sendStatus(200);
  }

  async addPermissions(req, res) {
    const { groupId } = req.params;
    const { permissions } = req.body;
    await this.groupsService.addPermissions(groupId, permissions || []);
    res.sendStatus(200);
  }

  async removePermissions(req, res) {
    const { groupId } = req.params;
    const { permissions } = req.body;
    await this.groupsService.removePermissions(groupId, permissions || []);
    res.sendStatus(200);
  }

  async getGroupById(req, res) {
    const { groupId } = req.params;
    const group = await this.groupsService.getGroupById(groupId);
    res.json(group);
  }

  async addUserToGroup(req, res) {
    const { groupId } = req.params;
    const { userId } = req.body;
    await this.groupsService.addUserToGroup(groupId, userId);
    res.sendStatus(200);
  }

  async removeUserFromGroup(req, res) {
    const { groupId } = req.params;
    const { userId } = req.body;
    await this.groupsService.removeUserFromGroup(groupId, userId);
    res.sendStatus(200);
  }
}

module.exports = GroupsController;
/**
 * @typedef {import('./groups.service')} GroupsService
 */
