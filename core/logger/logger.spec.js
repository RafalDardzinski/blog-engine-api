const chai = require('chai');
const spies = require('chai-spies');

const Logger = require('./logger');

chai.use(spies);

const { expect } = chai;
const createInternalLoggerMock = () => ({
  debug: () => null,
  info: () => null,
  warn: () => null,
  error: () => null,
});

const createLogger = internalLogger => new Logger(internalLogger);

const sandbox = chai.spy.sandbox();
describe(`Logger ${__dirname}/logger.js`, () => {
  let internalLogger;
  let logger;

  beforeEach(() => {
    internalLogger = createInternalLoggerMock();
    logger = createLogger(internalLogger);
    sandbox.restore();
  });

  describe('constructor(internalLogger)', () => {
    it('does not expose internal logger', () => {
      // Arrange
      const loggerValues = Object.values(logger);

      expect(loggerValues).to.not.include(internalLogger);
    });
  });

  describe('Logger#debug(details)', () => {
    it('calls internalLogger.debug(details)', () => {
      // Arrange
      sandbox.on(internalLogger, 'debug');
      const details = {};

      // Act
      logger.debug(details);

      // Assert
      expect(internalLogger.debug).to.have.been.called.with(details);
    });
  });

  describe('Logger#info(details)', () => {
    it('calls internalLogger.info(details)', () => {
      // Arrange
      sandbox.on(internalLogger, 'info');
      const details = {};

      // Act
      logger.info(details);

      // Assert
      expect(internalLogger.info).to.have.been.called.with(details);
    });
  });

  describe('Logger#warn(details)', () => {
    it('calls internalLogger.warn(details)', () => {
      // Arrange
      sandbox.on(internalLogger, 'warn');
      const details = {};

      // Act
      logger.warn(details);

      // Assert
      expect(internalLogger.warn).to.have.been.called.with(details);
    });
  });

  describe('Logger#error(details)', () => {
    it('calls internalLogger.error(details)', () => {
      // Arrange
      sandbox.on(internalLogger, 'error');
      const details = {};

      // Act
      logger.error(details);

      // Assert
      expect(internalLogger.error).to.have.been.called.with(details);
    });
  });
});
