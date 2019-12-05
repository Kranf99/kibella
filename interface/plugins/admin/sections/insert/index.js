define(function() {

  var _ = require('lodash');
   var $ = require('jquery');
  var angular = require('angular');

  require('./insert.less');

  var app = require('ui/modules').get('app/admin');

  require('routes')
  .when('/admin/insert', {
    template: require('./index.html'),
    controller: 'adminInsertController',
    resolve: {
      access: ["AdminOnly", function(AdminOnly) { return AdminOnly.check(); }]
    }
  });

  /*app.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
  }]);*/

  app.controller('adminInsertController', function($scope, $route, $http, $sce, kbnPath) {

    $scope.table = {
        db: "",
        table: "",
        datefields: "",
        geofields: "",
        linkfields: "",
        enablecache: "",
    };

    $scope.getDATADIR = function() {
      $http.get(kbnPath + '/JSON_SQL_Bridge/infos/getDataDir.php').then(function(response) {
        $scope.DATADIR = response.data;
      });
    }

    $scope.success_msg = "";

    $scope.submit = function(table) {
      if(table === null) {
          return;
      }
      $http.post(kbnPath + '/JSON_SQL_Bridge/formRegisterTableSubmit.php', $.param(table)).then(function(response) {
         $scope.success_msg =  $sce.trustAsHtml(response.data);
      });
    }
    

    $scope.getDATADIR();

  });
});