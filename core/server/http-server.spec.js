const chai = require('chai');
const http = require('http');
const spies = require('chai-spies');
const HttpServer = require('./http-server');
const { InvalidOperationError } = require('../error');

const { expect } = chai;
chai.use(spies);

const createObserverMock = () => ({
  watch: () => null,
});

const createConfigMock = (port = 1250) => ({ port });

describe(`HttpServer ${__dirname}/http-server.js`, () => {
  let server;
  let observerMock;
  let configMock;

  beforeEach(() => {
    configMock = createConfigMock();
    observerMock = createObserverMock();
    server = new HttpServer(configMock, observerMock);
  });

  describe('constructor(config, observer)', () => {
    it('assigns config to HttpServer#config', () => {
      expect(server.config).to.equal(configMock);
    });

    it('assigns observer to HttpServer#observer', () => {
      expect(server.observer).to.equal(observerMock);
    });
  });

  describe('HttpServer#start(webApp)', () => {
    it('assigns an instance of http.Server to HttpServer#instance', () => {
      // Arrange + Act
      server.start();

      // Assert
      expect(server.instance).to.be.an.instanceOf(http.Server);

      // Cleanup
      server.instance.close();
    });

    it('starts the HttpServer#instance', () => {
      // Arrange + Act
      server.start();

      // Assert
      expect(server.instance.listening).to.equal(true);

      // Cleanup
      server.instance.close();
    });

    it('sets HttpServer#instance to listen on port defined in HttpServer#config.port', () => {
      // Arrange + Act
      server.start();

      // Assert
      expect(server.instance.address().port).to.equal(configMock.port);

      // Cleanup
      server.instance.close();
    });
  });

  describe('HttpServer#stop()', () => {
    it('closes the HttpServer#instance', () => {
      // Arrange
      server.start();

      // Act
      server.stop();

      // Assert
      expect(server.instance.listening).to.equal(false);
    });

    describe('when HttpServer#instance is not running', () => {
      it('throws InvalidOperationError', () => {
        // Arrange + Act
        const act = () => server.stop();

        // Assert
        expect(act).to.throw(InvalidOperationError);
      });
    });
  });
});
