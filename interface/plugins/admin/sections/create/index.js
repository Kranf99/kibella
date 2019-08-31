define(function (require) {

  var _ = require('lodash');
  var $ = require('jquery');
  var angular = require('angular');
  
  require('../templates/user_form/user_form.less');
  require('./create.less');

  var app = require('ui/modules').get('app/admin');

  require('routes')
  .when('/admin/create', {
    template: require('./index.html'),
    controller: 'adminCreateController',
    resolve: {
      access: ["AdminOnly", function(AdminOnly) { return AdminOnly.check(); }]
    }
  })

  app.controller('adminCreateController', function(Notifier, $scope, $http, kbnPath) {

    var notify = new Notifier();
  
    $scope.user = {};

    $scope.create = function(user) {
      $http.post(kbnPath + '/JSON_SQL_Bridge/users/actions/create.php', $.param(user)).then(function(response) {
        if(response.data === "null") {
          notify.info('User ' + user.firstname + ' ' + user.lastname +  ' has been created.');
        } else {
          notify.error('Error: ' + response.data);
        }
      });    
    }
  });

});