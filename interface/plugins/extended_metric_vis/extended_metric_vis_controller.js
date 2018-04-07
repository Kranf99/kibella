define(function (require) {
  var _ = require('lodash');
  var module = require('ui/modules').get('kibana/extended_metric_vis', ['kibana']);

  module.controller('KbnExtendedMetricVisController', function ($scope, Private) {
    var tabifyAggResponse = Private(require('ui/agg_response/tabify/tabify'));
    var metrics = $scope.metrics = [];
    var calcOutputs = $scope.calcOutputs = [];

    function isInvalid(val) {
      return _.isUndefined(val) || _.isNull(val) || _.isNaN(val);
    }

    function updateOutputs() {
      $scope.vis.params.outputs.forEach(function (output) {
        try {
          var func = Function("metrics", "return " + output.formula);
          output.value = func(metrics) || "?";
        } catch (e) {
          output.value = '?';
        }
      });
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

          var formattedValue = isInvalid(value) ? '?' : fieldFormatter(value);
          var metric = {
            label: column.title,
            value: value,
            formattedValue: formattedValue
          };
          metrics.push(metric);
          metrics[column.title] = metric;
        });
      });

      updateOutputs();
    };

    // watches
    $scope.$watch('esResponse', function (resp) {
      if (resp) {
        calcOutputs.length = 0;
        metrics.length = 0;
        for (var key in metrics) {
          if (metrics.hasOwnProperty(key)) {
            delete metrics[key];
          }
        }
        $scope.processTableGroups(tabifyAggResponse($scope.vis, resp));
      }
    });

    $scope.$watchCollection('vis.params.outputs', updateOutputs);
  });

  module.controller('ExtendedMetricEditorController', function ($scope) {
    // Output Related Methods:
    $scope.addOutput = function (outputs) {
      outputs.push({
        formula: 'metrics[0].value * metrics[0].value',
        label: 'Count squared',
        enabled: true
      });
    };

    $scope.removeOuput = function (output, outputs) {
      if (outputs.length === 1) {
        return;
      }
      var index = outputs.indexOf(output);
      if (index >= 0) {
        outputs.splice(index, 1);
      }

      if (outputs.length === 1) {
        outputs[0].enabled = true;
      }
    };
  });
});
