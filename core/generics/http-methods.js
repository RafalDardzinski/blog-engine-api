/**
 * List of supported Http methods.
 * @enum {String}
 */
const HTTP_METHODS = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  PATCH: 'patch',
  DELETE: 'delete',
};

Object.freeze(HTTP_METHODS);
module.exports = HTTP_METHODS;
