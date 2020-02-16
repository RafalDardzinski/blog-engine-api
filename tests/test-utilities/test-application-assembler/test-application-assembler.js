/**
 * Assebles application for testing purposes.
 */
class TestApplicationAssembler {
  constructor(applicationInitializer) {
    this.applicationInitializer = applicationInitializer;
  }


  assemble(modules, applicationComponents) {
    const { applicationInitializer } = this;
    applicationInitializer.databaseConnectionManagerFactory
      .setApplicationComponents(applicationComponents);
    applicationInitializer.serverFactory.setApplicationComponents(applicationComponents);
    return applicationInitializer.initialize(modules);
  }
}

module.exports = TestApplicationAssembler;
/**
 * @typedef {import('../../../core/application/application-module')} ApplicationModule
 * @typedef {import('../application-components')} applicationComponents
 */
