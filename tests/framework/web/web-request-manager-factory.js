const WebRequestManager = require('./web-request-manager');

class WebRequestManagerFactory {
  create(webApp) {
    return new WebRequestManager(webApp);
  }
}

module.exports = WebRequestManagerFactory;
