define(function(require){

  var _ = require('lodash');
  var $ = require('jquery');
  var angular = require('angular');

  require('./manage.less');

  var app = require('ui/modules').get('app/admin')

  require('routes')
  .when('/admin/manage', {
    controller: 'adminManageController',
    template: require('./index.html'),
    resolve: {
      access: ["AdminOnly", function(AdminOnly) { return AdminOnly.check(); }]
    }
  });

  app.controller('adminManageController', function($scope, $http, kbnPath) {
    $http.get(kbnPath + '/JSON_SQL_Bridge/users/actions/getAll.php').then(function(response) {
      $scope.users = response.data;
    });
  
    $scope.delete = function(email) {

      var c = confirm('Are you sure ?');
      if(!c) return;

      // Splice user from array
      for(var i=0; i<$scope.users.length; i++) {
        if($scope.users[i].email === email) {
          $scope.users.splice(i, 1);
          break;
        }
      }
      $http.post(kbnPath + '/JSON_SQL_Bridge/users/actions/delete.php', 'delete='+email).then(function(res) {
      });


      $scope.edit = function(user) {
        
      }
    }
  });

});