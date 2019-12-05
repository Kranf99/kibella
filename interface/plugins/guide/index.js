define(function(require) {
  var $ = require('jquery');

  require('bootstrap');
  require('./lib/bootstrap-toc/bootstrap-toc.min.css');
  require('./lib/bootstrap-toc/bootstrap-toc.js');

  require('style-loader!css-loader!less-loader!./guide.less');

  var app = require("ui/modules").get("app/guide", [
    'elasticsearch',
    'ngRoute',
    'kibana/courier',
    'kibana/config',
    'kibana/notify',
    'kibana/typeahead'
  ]);

  app.directive('guideText', function ($location) {
    return {
      restrict: 'EA',
      template: require("text!./guide.html")
  }});

  require("routes").when("/guide", {
    controller: "guideController",
    template: require("text!./index.html")
  });

  app.controller("guideController", function($scope, $anchorScroll, $compile, $location) {

    var navSelector = "#toc";
    var $myNav = $(navSelector);
    Toc.init($myNav);
    $("body").scrollspy({
      target: navSelector,
      offset: 10
    });
    $compile($myNav)($scope);
  
    $("#toc").affix({
      offset:{}
    });

    $scope.goto = function(id) {
        id = id.substr(1);
        $location.hash(id);

        $anchorScroll();
    };
    $scope.init = function() {
      $anchorScroll();
    }
  });

  var apps = require("ui/registry/apps");
  apps.register(function GuideAppModule() {
    return {
      id: "guide",
      name: "User Guide",
      icon: '<span class="fa fa-book"></span>',
      order: 4
    };
  });
});
