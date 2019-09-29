// Global imports
const express = require('express');

// External modules imports
const { LoggerFactory } = require('../logger');

// Local imports
const ApplicationComponents = require('./web-application-components');
const Controller = require('./controller');
const Route = require('./route');
const ApplicationBuilder = require('./web-application-builder');
const WebApplicationBuildStrategy = require('./web-application-build-strategy');

const defaultMiddleware = require('./default-middleware')(LoggerFactory.create());

/**
 * Creates express application builder.
 */
class ExpressWebApplicationBuilderFactory {
  static create() {
    const buildStrategy = new WebApplicationBuildStrategy(defaultMiddleware);
    return new ApplicationBuilder(express, express.Router, buildStrategy);
  }
}

module.exports = {
  ApplicationComponents,
  Controller,
  ExpressWebApplicationBuilderFactory,
  Route,
  WebApplicationBuildStrategy,
};
