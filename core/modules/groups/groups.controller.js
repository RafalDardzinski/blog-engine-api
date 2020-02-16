const { Controller } = require('../../web');

class GroupsController extends Controller {
  /**
   * @param {GroupsService} groupsService Instance of GroupsService class.
   */
  constructor(groupsService) {
    super('/groups');
    this.groupsService = groupsService;

    this.registerRoute('post', '/', this.createGroup);
    this.registerRoute('get', '/', this.getGroups);
    this.registerRoute('get', '/:groupId', this.getGroupById);
    this.registerRoute('put', '/:groupId', this.updateGroup);
    this.registerRoute('delete', '/:groupId', this.deleteGroup);
    this.registerRoute('post', '/:groupId/users', this.addUserToGroup);
    this.registerRoute('delete', '/:groupId/users', this.removeUserFromGroup);
    this.registerRoute('post', '/:groupId/permissions', this.addPermissions);
    this.registerRoute('delete', '/:groupId/permissions', this.removePermissions);
  }

  async createGroup(req, res) {
    const group = await this.groupsService.createGroup(req.body);
    res.json(group);
  }

  async getGroups(req, res) {
    let groups;
    const { userId } = req.query;
    if (userId) {
      groups = await this.groupsService.getGroupsByMember(userId);
    } else {
      groups = await this.groupsService.getGroups();
    }
    res.json(groups);
  }

  async getGroupsByMember(req, res) {
    const { userId } = req.body;
    const groups = await this.groupsService.getGroupsByMember(userId);
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
