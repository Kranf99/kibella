define(function (require) {

  var _ = require('lodash');
  var $ = require('jquery');
  var angular = require('angular');
  
  require('../templates/user_form/user_form.less');
  require('./edit.less');

  var app = require('ui/modules').get('app/admin');

  require('routes')
  .when('/admin/edit/:id', {
    template: require('./index.html'),
    controller: 'adminEditController',
    resolve: {
      access: ["AdminOnly", function(AdminOnly) { return AdminOnly.check(); }]
    }
  })

  app.controller('adminEditController', function(Notifier, $scope, $route, $http, kbnPath) {

    var notify = new Notifier();

    $scope.user = {password:''};

    $scope.edit = function(user) {
      $http.post(kbnPath + '/JSON_SQL_Bridge/users/actions/edit.php?id='+$scope.user.id, $.param(user)).then(function(response) {
        if(response.data === "null") {
          notify.info('User ' + user.firstname + ' ' + user.lastname +  ' has been edited.');
        } else {
          notify.error('Error: ' + response.data);
        }
      });
    }

    this.find = function() {
      $http.get(kbnPath + '/JSON_SQL_Bridge/users/actions/getByID.php?id='+$route.current.params.id).then(function(response) {
        $scope.user = response.data;
        $scope.user.is_admin = $scope.user.is_admin === "true" ? true : false;
      });
    }

    this.find();
  });

});