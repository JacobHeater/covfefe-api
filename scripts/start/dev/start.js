const { execSync } = require('child_process');
const config = require('./config.json');

// Init env vars.
Object.keys(config.env).forEach(key => process.env[key] = config.env[key]);

execSync(`node .`, {
  stdio: 'inherit'
});
