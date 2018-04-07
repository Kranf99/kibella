define(function (require) {
  var module = require('ui/modules').get('kibana');

  module.directive('userPanel', function ($http, $rootScope, kbnPath) {
    return {
      restrict: 'A',
      template: require('text!partials/user_panel.html'),
      link: function(scope, element, attrs) {
        $http.post(kbnPath + '/JSON_SQL_Bridge/users/actions/getMe.php').then(function(res) {
          $rootScope.user = res.data;
        });

        scope.logout = function() {
          $http.post(kbnPath + '/JSON_SQL_Bridge/users/actions/logout.php').then(function() {
            window.location = kbnPath + '/public/users/login';
          });
        }
      }
    };
  });
});