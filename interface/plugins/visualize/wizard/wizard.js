define(function (require) {
  var _ = require('lodash');

  require('plugins/visualize/saved_visualizations/saved_visualizations');
  require('directives/saved_object_finder');
  require('plugins/discover/saved_searches/saved_searches');

  var templateStep = function (num, txt) {
    return '<div ng-controller="VisualizeWizardStep' + num + '" class="vis-wizard step' + num + '">' + txt + '</div>';
  };

  var module = require('ui/modules').get('app/visualize', ['kibana/courier']);
  var routes = require('routes');

  /********
  /** Wizard Step 1
  /********/
  routes.when('/visualize/step/1', {
    template: templateStep(1, require('text!plugins/visualize/wizard/step_1.html')),
    indexPatternIds: function (courier) {
        return courier.indexPatterns.getIds();
      }
  });

  module.controller('VisualizeWizardStep1', function ($scope, $route, $location, timefilter, kbnUrl, Private, courier, config) {
    timefilter.enabled = false;
    $scope.indexPattern = {
      selection: null,
      list: null
    };
    $scope.visTypes = Private(require('ui/registry/vis_types'));
        config.$bind($scope, 'defaultIndex');
        $scope.$watch('defaultIndex', function () {
          $scope.indexPattern.list = _($route.current.locals.indexPatternIds)
            .map(function (id) {
              if($scope.defaultIndex === id) {
                $scope.indexPattern.selection = id
              }
              return {
                id: id,
                default: $scope.defaultIndex === id
              };
            })
            .value();
        });
        $scope.$emit('application.load');

    $scope.visTypeUrl = function (visType) {
      return '#/visualize/create?type='+ visType.name +'&indexPattern=' + $scope.indexPattern.selection;
    };
    $scope.checkTooltips = checkTooltips;
  });
});