const { startServerAsync } = require('../bin/covfefe-api/src');

module.exports = async function () {
  process.env.MONGO_CONNECTION_STRING = 'mongodb://localhost:27017';
  process.env.MONGO_DEFAULT_DB = 'TestDatabase';
  
  global.server = await startServerAsync(5555);
};
