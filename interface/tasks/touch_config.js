module.exports = function (grunt) {
  var join = require('path').join;
  grunt.registerTask('touch_config', function () {
    var configFile = join(grunt.config.get('build'), 'dev_copy', 'config');
    grunt.log.ok('Touching: ' + configFile);
    grunt.file.write(configFile, 'delete this');
  });
};
