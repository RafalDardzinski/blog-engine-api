// Global imports
const express = require('express');

// External modules imports
const { LoggerFactory } = require('../logger');

// Local imports
const Controller = require('./controller');
const Route = require('./route');
const WebApplicationBuilder = require('./web-application-builder');
const WebApplicationBuildStrategy = require('./web-application-build-strategy');

const defaultMiddleware = require('./default-middleware')(LoggerFactory.create());
const { ErrorHandlingMiddlewareFactory } = require('../error-handler');

/**
 * Creates express application builder.
 */
class ExpressWebApplicationBuilderFactory {
  /**
   * @returns {WebApplicationBuilder} Instance of WebApplicationBuilder class.
   */
  static create() {
    const logger = LoggerFactory.create();
    const errorHandlingMiddleware = ErrorHandlingMiddlewareFactory.create(logger);
    const buildStrategy = new WebApplicationBuildStrategy(
      defaultMiddleware,
      errorHandlingMiddleware,
    );
    return new WebApplicationBuilder(express, express.Router, buildStrategy);
  }
}

module.exports = {
  Controller,
  ExpressWebApplicationBuilderFactory,
  Route,
  WebApplicationBuildStrategy,
};
