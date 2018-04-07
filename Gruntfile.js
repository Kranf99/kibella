var path = require('path');
var webpack = require('webpack');

var webpackConfig = require('./interface/webpack.config.js');

module.exports = function(grunt) {
  grunt.initConfig({
    
    dev: __dirname + '/dev',
    dist: '/mnt/f/soft/wamp64/www/kibella',
//    dist: __dirname + '/../kibella',
    interface: __dirname + '/interface',
    
    clean: {
      dist: {
        src: ['<%= dist %>/interface/**']
      },
      dev: {
        src: ['<%= dev %>/**']
      }
    },
    copy: {
      root: {
        src: ['public/**', 'tempdata/kibella.sqlite', 'tempdata/.htaccess', 'index.php', 'kibella.ini', 'LICENSE.txt','.ovhconfig'],
        dest: '<%= dist %>',
        expand: true
      },
      backend: {
        src: ['JSON_SQL_Bridge/**'],
        dest: '<%= dist %>',
        expand: true  
      },
      interface: {
        cwd: '<%= interface %>',
        src: ['index.html', 'images/**', 'styles/*.css', 'styles/fonts/**','components/stringify/icons/**'],
        dest: '<%= dist %>/interface',
        expand: true
      },


       droot: {
        src: ['public/**', 'index.php', 'kibella.ini', 'LICENSE.txt'],
        dest: 'dev',
        expand: true
      },
      dbackend: {
        src: ['JSON_SQL_Bridge/**'],
        dest: 'dev',
        expand: true  
      },
      dinterface: {
        cwd: '<%= interface %>',
        src: ['index.html', 'images/**', 'styles/*.css', 'styles/fonts/**','components/stringify/icons/**'],
        dest: '<%= dev %>/interface',
        expand: true
      }
    },
    webpack: {
      options: webpackConfig,
      dist: {
        // webpack options
        entry: "<%= interface %>/app.js",
        
        output: {
            path: "<%= dist %>/interface",
            // filename: "[hash].js",
            filename: "index.js",
        },
        stats: {
            colors: true,
            modules: true,
            reasons: true
        },
        // storeStatsTo: "xyz", // writes the status to a variable named xyz
        // you may use it later in grunt i.e. <%= xyz.hash %>
        progress: true,
        failOnError: false, // don't report error to grunt if webpack find errors

        plugins: webpackConfig.plugins.concat(
          new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: true
            },
            mangle: false,
            output: {
                comments: false
            }
        })
        )
      },
      dev: {
        entry: "<%= interface %>/app.js",
        output: {
            path: "<%= dev %>/interface",
            // filename: "[hash].js",
            filename: "index.js",
        },
        stats: {
            // Configure the console output
            colors: true,
            modules: true,
            reasons: true
        },
        progress: true,
        failOnError: true, // don't report error to grunt if webpack find errors
        // Use this if webpack errors are tolerable and grunt should continue
        watch: true, // use webpacks watcher
        // You need to keep the grunt process alive

        /*watchOptions: {
            aggregateTimeout: 500,
            poll: true
        },*/
        // Use this when you need to fallback to poll based watching (webpack 1.9.1+ only)
        keepalive: true, // don't finish the grunt task
        // defaults to true for watch and dev-server otherwise false
        // inline: true,  // embed the webpack-dev-server runtime into the bundle
        // hot: true, // adds the HotModuleReplacementPlugin and switch the server to hot mode
        // Use this in combination with the inline option
      }
    }
  });

  grunt.registerTask('dist', 'Make the distribution folder', function() {
    grunt.log.writeln('Compiling everything into dist/ folder ...');

    grunt.task.run([
                      'clean:dist',
                      'copy:root',
                      'copy:backend',
                      'copy:interface',
                      'webpack:dist' 
                   ]);
  });

  grunt.registerTask('dev', 'Make the dev folder', function() {
    grunt.log.writeln('Compiling everything into dev/ folder ...');

    grunt.task.run([
                      'clean:dev',
                      'copy:droot',
                      'copy:dbackend',
                      'copy:dinterface',
                      'webpack:dev' 
                   ]);
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-webpack');
}

