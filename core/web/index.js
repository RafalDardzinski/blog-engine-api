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
const { MiddlewareFactory: ErrorHandlerMiddlewareFactory, ErrorHandlerRouter, errorHandlers } = require('../error-handler');

/**
 * Creates express application builder.
 */
class ExpressWebApplicationBuilderFactory {
  /**
   * @returns {WebApplicationBuilder} Instance of WebApplicationBuilder class.
   */
  static create() {
    const errorHandlersArray = Object.values(errorHandlers);
    const errorHandlerRouter = new ErrorHandlerRouter(errorHandlersArray);
    const logger = LoggerFactory.create();
    const errorHandlerMiddleware = ErrorHandlerMiddlewareFactory.create(errorHandlerRouter, logger);
    const buildStrategy = new WebApplicationBuildStrategy(
      defaultMiddleware,
      errorHandlerMiddleware,
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
