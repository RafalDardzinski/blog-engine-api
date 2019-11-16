require('dotenv').config();

const {
  Application,
  Database,
  Server,
} = require('./core');
const blogModules = require('./blog/modules');

async function Main() {
  const db = Database.DatabaseConnectionManagerFactory.create('BLOG');
  const app = Application.ApplicationBuilderFactory.create().build(blogModules, db);
  const server = Server.HttpServerFactory.create();
  await app.run(server);
}
// TODO: Add unexpected errors handling.
Main();
