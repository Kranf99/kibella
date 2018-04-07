define(function (require) {
  var _ = require('lodash');
  // get the kibana/metric_vis_colors module, and make sure that it requires the "kibana" module if it
  // didn't already
  var module = require('ui/modules').get('kibana/metric_vis_colors', ['kibana']);

  module.controller('KbnMetricVisController', function ($scope, Private) {
    var tabifyAggResponse = Private(require('ui/agg_response/tabify/tabify'));

    var metrics = $scope.metrics = [];

    function isInvalid(val) {
      return _.isUndefined(val) || _.isNull(val) || _.isNaN(val);
    }

    function updateColors(value) {
      if ($scope.vis.params.t2Value === null) {
        $scope.vis.params.t2Value = value * 2;
      }
      if ($scope.vis.params.t1Value === null) {
        $scope.vis.params.t1Value = value * 1.5;
      }
      if (value > $scope.vis.params.t2Value) {
        $scope.vis.params.bgColor = $scope.vis.params.t2BgColor;
        $scope.vis.params.fontColor = $scope.vis.params.t2FontColor;
      } else if (value < $scope.vis.params.t2Value &&
            value > $scope.vis.params.t1Value) {
        $scope.vis.params.bgColor = $scope.vis.params.t1BgColor;
        $scope.vis.params.fontColor = $scope.vis.params.t1FontColor;
      } else {
        $scope.vis.params.bgColor = $scope.vis.params.t0BgColor;
        $scope.vis.params.fontColor = $scope.vis.params.t0FontColor;
      }
    }

    $scope.processTableGroups = function (tableGroups) {
      tableGroups.tables.forEach(function (table) {
        table.columns.forEach(function (column, i) {
          var fieldFormatter = table.aggConfig(column).fieldFormatter();
          var value = table.rows[0][i];

          updateColors(value);

          value = isInvalid(value) ? '?' : fieldFormatter(value);
          metrics.push({
            label: column.title,
            value: value
          });
        });
      });
    };

    $scope.$watch('esResponse', function (resp) {
      if (resp) {
        metrics.length = 0;
        $scope.processTableGroups(tabifyAggResponse($scope.vis, resp));
      }
    });
  });
});
