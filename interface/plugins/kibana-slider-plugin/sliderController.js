define(function (require) {
  var module = require('ui/modules').get('kibana/kibana-slider-plugin', ['kibana', 'rzModule']);
  module.controller('KbnSliderVisController', function ($scope, $rootScope, Private, $filter) {
    var queryFilter = Private(require('ui/filter_bar/query_filter'));
    var buildRangeFilter = require('ui/filter_manager/lib/range');
    var IndexedArray = require('ui/IndexedArray');
    var angular = require('angular');

    $rootScope.plugin = {
      sliderPlugin: {}
    };
    $scope.config = {
        filterType: 'range',
        selectedField: null,
        title: "",
        icon: "",
        slider: {
          min: 50,
          max: 200,
          options: {
            floor: 0,
            ceil: 450,
            step: 1,
            precision: 2,
            onEnd: function(sliderId, modelValue, highValue) {
              if($scope.config.selectedField) {
                $scope.filter({gte:modelValue, lte:highValue});
              }
            }
          }
        }
    };

    $scope.oldValue = null;

    $scope.filter = function(value) {
      var oldFilter = $scope.findFilter($scope.oldValue);
      if(oldFilter == null) {
        var rangeFilter = buildRangeFilter({name: $scope.config.selectedField},
                                            value,
                                            $scope.vis.indexPattern);
        console.log("okok")
      console.log(rangeFilter);
        queryFilter.addFilters(rangeFilter);
      }
      else {
        $scope.editingFilter = {
          source: oldFilter, // old
          type: $scope.config.filterType,
          model: angular.copy(oldFilter), // new
          alias: oldFilter.meta.alias
        };
        $scope.editingFilter.model.range[$scope.config.selectedField].gte = $scope.config.slider.min;
        $scope.editingFilter.model.range[$scope.config.selectedField].lte = $scope.config.slider.max;
        queryFilter.updateFilter($scope.editingFilter);
      }
      $scope.oldValue = value;
    };

    $scope.findFilter = function(oldValue) {
      var foundFilter = null;

      if(oldValue != null) {
        var oldFilter = buildRangeFilter({name: $scope.config.selectedField},
                                          oldValue,
                                          $scope.vis.indexPattern);

        var filters = queryFilter.getFilters();
        for (var i = 0; i < filters.length; i++) {
          if (_.isEqual(filters[i][$scope.config.filterType], oldFilter[$scope.config.filterType])) {
            foundFilter = filters[i];
            break;
          }
        }
      }

      return foundFilter;
    };

    $scope.$watch('vis.params.field', function (field) {
      if(field) {
        $scope.config.selectedField = field.name;
      }
    });
    $scope.$watch('vis.params.minValue', function (minValue) {
      if(minValue) {
        $scope.config.slider.options.floor = minValue;
        $scope.config.slider.min = minValue;
      }
    });
    $scope.$watch('vis.params.maxValue', function (maxValue) {
      if(maxValue) {
        $scope.config.slider.options.ceil = maxValue;
        $scope.config.slider.max = maxValue;
      }
    });
    $scope.$watch('vis.params.step', function (step) {
      if(step) {
        $scope.config.slider.options.step = step;
      }
    });
    $scope.$watch('vis.params.title', function (title) {
      $scope.config.title = title;
    });
    $scope.$watch('vis.params.icon', function (icon) {
      $scope.config.icon = icon;
    });

    $scope.getIndexedNumberFields = function() {
      var fields = $scope.vis.indexPattern.fields.raw;
      var fieldTypes = ["number"];

      if (fieldTypes) {
        fields = $filter('fieldType')(fields, fieldTypes);
        fields = $filter('filter')(fields, { bucketable: true });
        fields = $filter('orderBy')(fields, ['type', 'name']);
      }

      return new IndexedArray({
        index: ['name'],
        initialSet: fields
      });
    };

    $rootScope.plugin.sliderPlugin.indexedFields = $scope.getIndexedNumberFields();
  });
});
