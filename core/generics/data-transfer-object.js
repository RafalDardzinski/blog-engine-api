// TODO: Add unit tests + documentation.
class DataTransferObject {
  removeUndefined() {
    Object.entries(this).forEach(([key, value]) => {
      if (value === undefined) {
        delete this[key];
      }
    });
  }
}

module.exports = DataTransferObject;
