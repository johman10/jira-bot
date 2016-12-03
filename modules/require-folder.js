const fs = require('fs')
const path = require('path')

function requireFolder(directory) {
  var modules = {};
  var directoryContent = fs.readdirSync(directory);
  directoryContent.forEach((object) => {
    if (object == 'index.js') { return; };
    var objectPath = path.join(directory, object)
    var objectStats = fs.lstatSync(objectPath);
    if (objectStats.isDirectory()) {
      modules[object] = {};
      var files = fs.readdirSync(objectPath);
      files.forEach((file) => {
        var baseName = path.basename(file, '.js')
        modules[object][baseName] = require(path.join(directory, object, file));
      });
    } else {
      var baseName = path.basename(object, '.js')
      modules[baseName] = require(path.join(directory, object));
    }
  })

  return modules
}

module.exports = requireFolder;
