/**
 * main app level module
 */
define(function (require) {
  var angular = require('angular');
  var _ = require('lodash');
  var $ = require('jquery');
  var modules = require('ui/modules');
  var routes = require('routes');

  require('elasticsearch');
  require('angular-route');
  require('angular-bindonce');

  var configFile = JSON.parse(require('text!config'));
  
  var secondSlash = window.location.pathname.indexOf('/', 1);
  var kbnPath = window.location.pathname.substr(0, secondSlash) || '/kibella';
    
  var kibana = modules.get('kibana', [
    // list external requirements here
    'elasticsearch',
    'pasvaz.bindonce',
    'ngRoute'
  ]);


  kibana
    .constant('kbnPath', kbnPath)
    // This stores the Kibana revision number, @REV@ is replaced by grunt.
    .constant('kbnVersion', window.KIBANA_VERSION)
    // The build number is placed by grunt, represents a sequence to provide nothing really but order.
    // If NaN, use the max value of a JS number, that way we always have a number here, even in dev
    .constant('buildNum', _.parseInt(window.KIBANA_BUILD_NUM) || Number.MAX_SAFE_INTEGER)
    // This stores the build number, @REV@ is replaced by grunt.
    .constant('commitSha', window.KIBANA_COMMIT_SHA)
    // Use this for cache busting partials
    .constant('cacheBust', window.KIBANA_COMMIT_SHA)
    // The minimum Elasticsearch version required to run Kibana
    .constant('minimumElasticsearchVersion', '1.4.4')
    // When we need to identify the current session of the app, ef shard preference
    .constant('sessionId', Date.now())
    // attach the route manager's known routes
    .config(routes.config)
    .run(function($rootScope){
        $rootScope.kbnPath = kbnPath;
    });

  // setup routes
  routes
    .otherwise({
      redirectTo: '/' + configFile.default_app_id
    });

  // tell the modules util to add it's modules as requirements for kibana
  modules.link(kibana);

  kibana.load = _.onceWithCb(function (cb) {

    var firstLoad = ['plugins/kibana/index'];
    var thenLoad = _.difference(configFile.plugins, firstLoad);

    require(['plugins/kibana/index'], function loadApps() {
       /* require("plugins/dashboard/index");
        require("plugins/discover/index");
        require("plugins/doc/index");
        require("plugins/markdown_vis/index");
        require("plugins/metric_vis/index");
        require("plugins/settings/index");
        require("plugins/table_vis/index");
        require("plugins/vis_types/index");
        require("plugins/visualize/index");
        require("plugins/kibana-slider-plugin/index");
        require("plugins/kibi_radar_vis/index");
        require("plugins/extended_metric_vis/index");
        require("plugins/kibana-html-plugin/index");
        require("plugins/kbn_circles_vis/index");*/

        cb();
    });

  });

  kibana.init = _.onceWithCb(function (cb) {
    kibana.load(function () {
      $(function () {
        angular
          .bootstrap(document, ['kibana'])
          .invoke(function () {
            $(document.body).children(':not(style-compile)').show();
            cb();
          });
      });
    });
  });

  kibana.Plugin = function(options) {
    require('./plugins/' + removePluginFolder(options.uiExports.visTypes[0]));
  }

  function removePluginFolder(path) {
    return path.replace(/plugins\//, '');
  }

  return kibana;
});
