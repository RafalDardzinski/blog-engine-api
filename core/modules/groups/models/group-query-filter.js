const { QueryFilter } = require('../../../generics');

/**
 * Used for destructuring query input for group searching.
 */
class GroupQueryFilter extends QueryFilter {
  constructor({ membersFilter } = {}) {
    super();
    this.members = membersFilter;
  }
}

module.exports = GroupQueryFilter;
