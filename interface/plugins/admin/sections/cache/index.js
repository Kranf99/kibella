define(function(require){

  var _ = require('lodash');
  var $ = require('jquery');
  var angular = require('angular');

  require('./cache.less');

  var app = require('ui/modules').get('app/admin')

  require('routes')
  .when('/admin/cache', {
    template: require('./index.html'),
    controller: 'adminCacheController',
    resolve: {
      access: ["AdminOnly", function(AdminOnly) { return AdminOnly.check(); }]
    }
  })  

  app.controller('adminCacheController', function(Notifier, $scope, $http, kbnPath) {

    var notify = new Notifier({
      location: 'Cache'
    });

    $http.get(kbnPath + '/JSON_SQL_Bridge/cache/actions/getSettings.php').then(function(response) {
      $scope.RES = response.data;
    });

    $scope.delete_cache = function() {
      $http.post(kbnPath + '/JSON_SQL_Bridge/cache/actions/delete.php').then(function(response) {
        if(response.status === 200) {
          notify.info(response.data);
        }
      });
    }
    
    $scope.delete_old_cache = function() {
      $http.post(kbnPath + '/JSON_SQL_Bridge/cache/actions/deleteOld.php').then(function(response) {
        if(response.status === 200) {
          notify.info(response.data);
        }
      });
    }
  });

});