const { stopServerAsync } = require('../bin/covfefe-api/src');

module.exports = async function() {
  await stopServerAsync(global.server);
};
