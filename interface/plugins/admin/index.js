define(function (require) {
  var _ = require('lodash');
  var $ = require('jquery');
  var angular = require('angular');
  var ConfigTemplate = require('utils/config_template');
  var kib = require('ui/modules').get('kibana');

  require('directives/config');
  require('components/courier/courier');
  require('components/config/config');
  require('components/notify/notify');
  require('components/typeahead/typeahead');

  require('./sections/create/index.js');
  require('./sections/manage/index.js');
  require('./sections/edit/index.js');
  require('./sections/insert/index.js');
  require('./sections/cache/index.js');

  require('./admin.less');

  var app = require('ui/modules').get('app/admin', [
    'elasticsearch',
    'ngRoute',
    'kibana/courier',
    'kibana/config',
    'kibana/notify',
    'kibana/typeahead'
  ]);

  app.factory("AdminOnly", function($location, $rootScope) {
    var adminOnly = {};

    adminOnly.check = function() {
      if($rootScope.user.is_admin !== "true" && $rootScope.user.is_admin !== "TRUE") {
        $location.path('/');
      }
    }

    return adminOnly;
  });

  app.directive('adminApp', function (Notifier, courier, AppState, $location, timefilter) {
    return {
      restrict: 'EA',
      template: require('./index.html'),
      transclude: true,
      scope: {
        sectionName: '@section'
      },
      link: function ($scope, $el) {

        // Use this for setting the 'active' class on buttons menu
        $scope.path = $location.$$path;
        
        timefilter.enabled = false;
        
        $scope.sections = require('./sections/index');
        $scope.section = _.find($scope.sections, { name: $scope.sectionName });
        $scope.sections.forEach(function (section) {
          section.class = (section === $scope.section) ? 'active' : void 0;
        });
      }
  }});

  require('routes').when('/admin', {
    redirectTo: '/admin/manage'
  });
  
  kib.run(function($http, kbnPath, $route) {
    $http.post(kbnPath + '/JSON_SQL_Bridge/users/actions/getMe.php').then(function(response) {
      if(response.data.is_admin === "true" || response.data.is_admin === "TRUE") {

        var apps = require('ui/registry/apps');
        apps.register(function AdminAppModule() {
          return {
            id: 'admin',
            name: 'Administration',
            icon: '<span class="fa fa-users"></span>',
            order: 4
          };
        });
      }
    });
  });
});