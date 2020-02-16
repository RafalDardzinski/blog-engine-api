require('dotenv').config();

const {
  Application: { applicationInitializer },
} = require('./core');
const blogModules = require('./blog/modules');

async function Main() {
  await applicationInitializer.initialize(blogModules, 'BLOG');
}
// TODO: Add unexpected errors handling.
Main();
