const { DataTransferObject } = require('../../../generics');

/**
 * Used for transferring data from service to controller.
 */
class GroupDto extends DataTransferObject {
  constructor(inputDocument) {
    super(inputDocument, [
      '_id',
      'name',
      'membersCount',
      'isActive',
    ]);
  }
}

/**
 * Used for destructuring input for creating groups.
 */
class GroupCreate extends DataTransferObject {
  constructor(inputDocument) {
    super(inputDocument, [
      'name',
      'permissions',
    ]);
  }
}

/**
 * Used for destructuring inpuyt for updating groups.
 */
class GroupUpdate extends DataTransferObject {
  constructor(inputDocument) {
    super(inputDocument, [
      'name',
      'isActive',
    ]);
  }
}

module.exports = {
  GroupDto,
  GroupCreate,
  GroupUpdate,
};
