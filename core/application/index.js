const { ExpressWebApplicationBuilderFactory } = require('../web');

const ApplicationModule = require('./module');
const ApplicationBuilder = require('./builder');
const ApplicationModulesManager = require('./modules-manager');

const webApplicationBuilder = ExpressWebApplicationBuilderFactory.create();

class ApplicationBuilderFactory {
  static create() {
    return new ApplicationBuilder(webApplicationBuilder);
  }
}

module.exports = {
  ApplicationBuilderFactory,
  ApplicationModule,
  ApplicationModulesManager,
};
