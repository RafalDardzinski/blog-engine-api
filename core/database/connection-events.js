/**
 * List of database connection events.
 * @enum {String}
 */
const DATABASE_CONNECTION_EVENTS = {
  /**
   * Emitted when Mongoose starts making its initial connection to the MongoDB server
   */
  CONNECTING: 'connecting',

  /**
   * Emitted when Mongoose successfully makes its initial connection to the MongoDB server
   */
  CONNECTED: 'connected',

  /**
   * Your app called Connection#close() to disconnect from MongoDB
   */
  DISCONNECTING: 'disconnecting',

  /**
   * Emitted when Mongoose lost connection to the MongoDB server. This event
   * may be due to your code explicitly closing the connection, the database server crashing,
   * or network connectivity issues.
   */
  DISCONNECTED: 'disconnected',

  /**
   * Emitted after Connection#close() successfully closes the connection. If you call conn.close(),
   * you'll get both a 'disconnected' event and a 'close' event.
   */
  CLOSE: 'close',

  /**
   * Emitted if Mongoose lost connectivity to MongoDB and successfully reconnected.
   * Mongoose attempts to automatically reconnect when it loses connection to the database.
   */
  RECONNECTED: 'reconnected',

  /**
   * Emitted if an error occurs on a connection, like a parseError due to malformed data or a
   * payload larger than 16MB.
   */
  ERROR: 'error',

  /**
   * Emitted when you're connecting to a replica set and Mongoose has successfully connected
   * to the primary and at least one secondary.
   */
  FULLSETUP: 'fullsetup',

  /**
   * Emitted when you're connecting to a replica set and Mongoose has successfully connected to
   * all servers specified in your connection string.
   */
  ALL: 'all',

  /**
   * Emitted when you're connected to a standalone server and Mongoose has run out of
   * reconnectTries. The MongoDB driver will no longer attempt to reconnect after this
   * event is emitted. This event will never be emitted if you're connected to a replica set.
   */
  RECONNECT_FAILED: 'reconnectFailed',
};

Object.freeze(DATABASE_CONNECTION_EVENTS);
module.exports = DATABASE_CONNECTION_EVENTS;
