const { QueryFilter } = require('../../../core').Generics;

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
