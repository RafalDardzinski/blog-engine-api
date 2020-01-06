/**
 * Creates immutable object used to communicate between application layers.
 * @abstract
 */
class DataTransferObject {
  /**
   * @param {Object} requestObject Object to destructure.
   * @param {String[]} transferObjectProperties Array of property names to build the object from.
   */
  constructor(
    requestObject = {},
    transferObjectProperties = [],
  ) {
    transferObjectProperties.forEach((propertyToSet) => {
      const requestObjectPropertyValue = requestObject[propertyToSet];
      if (requestObjectPropertyValue !== undefined) {
        this[propertyToSet] = requestObject[propertyToSet];
      }
    });

    Object.freeze(this);
  }
}

module.exports = DataTransferObject;
