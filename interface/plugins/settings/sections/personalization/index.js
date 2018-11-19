define(function (require) {
    var Cookies = require('js-cookie');
  
    require('routes')
    .when('/settings/personalization', {
      template: require('text!plugins/settings/sections/personalization/index.html')
    });
  
    require('ui/modules').get('apps/settings')
    .controller('settingsPersonalization', function ($scope, $rootScope) {
      $scope.themes = ["bright", "dark"];
  
      $scope.selectedTheme = $rootScope.theme || $rootScope.defaultTheme;
  
      $scope.$watch(function(scope){ return scope.selectedTheme },
        function(newValue) {
          Cookies.set('theme', newValue);
          $rootScope.theme = newValue;
        }
      );
    });
  
    return {
      order: Infinity,
      name: 'personalization',
      display: 'Personalization',
      url: '#/settings/personalization'
    };
});