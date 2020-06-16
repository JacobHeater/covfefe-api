const fs = require('fs-extra');
const glob = require('glob');
const mergeYaml = require('merge-yaml');

console.log('Building swagger spec file...');
console.log('Searching for yaml files....');

const rootYamlFile = './src/swagger.yml';
const commonYamlFiles = glob.sync('../covfefe-common/**/swagger.yml');
const childYamlFiles = glob.sync('./src/api/**/swagger.yml');

console.log('Merging yaml files...');

const swaggerSpec = mergeYaml(
  [
    rootYamlFile,
    ...commonYamlFiles,
    ...childYamlFiles
  ]
);

console.log('Done merging yaml files.');
console.log('Writing yaml file to ./bin/swagger.json');

fs.ensureDirSync('./bin');
fs.writeFileSync('./bin/swagger.json', JSON.stringify(swaggerSpec, null, 2));

console.log('Done!');
