/**
 * Used to define query filter object models.
 * @abstract
 */
class QueryFilter {
  /**
   * Gets query filter object used for querying repositories.
   */
  getFilterObject() {
    const filterObject = {};
    Object.entries(this).forEach(([key, value]) => {
      if (value !== undefined) {
        filterObject[key] = value;
      }
    });

    Object.freeze(filterObject);
    return filterObject;
  }
}

module.exports = QueryFilter;
