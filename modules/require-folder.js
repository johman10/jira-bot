const fs = require('fs');
const path = require('path');

function requireFolder(directory) {
  const modules = {};
  const directoryContent = fs.readdirSync(directory);
  directoryContent.forEach((object) => {
    if (object === 'index.js' || object === '.DS_Store') return;
    const objectPath = path.join(directory, object);
    const objectStats = fs.lstatSync(objectPath);
    if (objectStats.isDirectory()) {
      modules[object] = {};
      const files = fs.readdirSync(objectPath);
      files.forEach((file) => {
        const baseName = path.basename(file, '.js');
        modules[object][baseName] = require(path.join(directory, object, file)); // eslint-disable-line
      });
    } else {
      const baseName = path.basename(object, '.js');
      modules[baseName] = require(path.join(directory, object)); // eslint-disable-line
    }
  });

  return modules;
}

module.exports = requireFolder;
