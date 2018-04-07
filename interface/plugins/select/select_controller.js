define(function (require) {
  var _ = require('lodash');
  var module = require('ui/modules').get('kibana/select', ['kibana']);

  module.controller('KblSelectController', function ($scope, kbnPath, Private, courier, $http) {
    
    var fetch = Private(require('components/courier/fetch/fetch'));

    var queryFilter = Private(require('ui/filter_bar/query_filter'));
    var buildPhraseFilter = require('ui/filter_manager/lib/phrase');
    
    var tabifyAggResponse = Private(require('ui/agg_response/tabify/tabify'));
    var metrics = $scope.metrics = [];

    $scope.config = {
        filterType: 'phrase',
        selectedField: $scope.selected_field,
    };

    $scope.oldPhrase = null;

    $scope.filter = function(phrase) {

      var oldFilter = $scope.findFilter($scope.oldPhrase);

      if(oldFilter == null /*|| $scope.oldPhrase == null*/) {
        var phraseFilter = buildPhraseFilter({name: $scope.vis.params.field },
                                            phrase,
                                            $scope.vis.indexPattern);
        queryFilter.addFilters(phraseFilter);
      }
      else {
        
        if(phrase.length === 0) { // When no value (All) is selected
          queryFilter.removeFilter(oldFilter);
        }else{
          $scope.editingFilter = {
            source: oldFilter, // old
            type: $scope.config.filterType,
            model: angular.copy(oldFilter), // new
            alias: oldFilter.meta.alias
          };
          $scope.editingFilter.model.query.match[$scope.vis.params.field].query = phrase;
          // $scope.editingFilter.model.meta.value = phrase; 

          queryFilter.updateFilter($scope.editingFilter);
        }
      }

      $scope.oldPhrase = phrase;
    };

    $scope.findFilter = function(oldPhrase) {
      var foundFilter = null;

      if(oldPhrase === null) {
        var filters = queryFilter.getFilters();
        for (var i = 0; i < filters.length; i++) {
          if (/*_.isEqual(filters[i][$scope.config.filterType], oldFilter[$scope.config.filterType]) &&*/
              _.isEqual(filters[i].meta.key, $scope.vis.params.field)  ) {
            foundFilter = filters[i];
            break;
          }
        }  
      }else{
        var oldFilter = buildPhraseFilter({name: $scope.vis.params.field },
                                          oldPhrase,
                                          $scope.vis.indexPattern);

        var filters = queryFilter.getFilters();
        for (var i = 0; i < filters.length; i++) {
          if (_.isEqual(filters[i][$scope.config.filterType], oldFilter[$scope.config.filterType]) &&
              _.isEqual(filters[i].meta.key, $scope.vis.params.field)  ) {
            foundFilter = filters[i];
            break;
          }
        }
      }

      return foundFilter;
    };

    // Conventionnal function used for processing table groups
    $scope.processTableGroups = function (tableGroups) {
      tableGroups.tables.forEach(function (table) {
        table.rows.forEach(function (row, i) {

          var value = row[1];

          var metric = {
            label: row[0],
            value: value,
          };

          metrics[i] = metric;
        });
      });
    };

    // Save the params for the Vis/VisState
    function saveParamsValues() {
      var agg = $scope.vis.aggs[1];
      $scope.vis.params.field = agg.params.field.name;
      $scope.vis.params.size = agg.params.size;
      $scope.vis.params.order = agg.params.order.val;
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // WARNING
    //
    // This watcher has not the conventionnal behavior/utility like in the others visualisations,
    // It here uniquely serve when you "Apply Changes" in the Edit Visualisation (/visualize/edit/) for updating the data of the visualisation (here <select>)
    // Because this plugin has specifics needs, what we want to perform here is separate the response of request for this Plugin and those from the Kibella core.
    // Unless others visualisations plugin who only read and draw data all the times, this plugin need to read (For fill the <select>),
    // but it also need to add/replace/delete filter WITHOUT(!) replace is own data.
    //
    // In Resume we don't want this plugin edit himself when it add a filter, and the only way (For the moment) to do that is to manually create new request.
    // 
    $scope.$watch('esResponse', function (resp) {
      if (resp) {
        // debugger;
        // if($scope.vis.is_change) {
          $scope.vis.is_change = false;
          $scope.Update();

          // purgeMetrics();
          // $scope.processTableGroups(tabifyAggResponse($scope.vis, resp));

          //saveParamsValues(); // save/override params
        // }

        $scope.$emit('checkFilters');
         
      }
    });


    // This function create a custom request because this plugin need to be filter agnostic (see warning comment above)
    function customReq() {

      var r = { index: $scope.vis.indexPattern.id,
                search_type: "count",
                ignore_unavailable: true };

      var s = courier.createSource('search');

      s.size(0);
      s.query({ query_string: { query:"*",
                                analyze_wildcard:true}});

      s.aggs( { 2: {
                      terms: {  field: $scope.vis.params.field,
                                size:  $scope.vis.params.size,
                                order: { _count: $scope.vis.params.order }
                              }
                    }
              });

      return $http.post(kbnPath + '/db/_msearch?timeout=0', JSON.stringify(r) + "\n" + JSON.stringify(s._state));
    }


    function purgeMetrics() {
      metrics.length = 0;
      for (var key in metrics) {
        if (metrics.hasOwnProperty(key)) {
          delete metrics[key];
        }
      }
    }


    // Send a new request
    $scope.Update = function() {
        customReq().then(function(resp) {
          purgeMetrics();
          $scope.processTableGroups(tabifyAggResponse($scope.vis, resp.data.responses["0"]));
          saveParamsValues();
        });
    }

    $scope.Update();

   
});


module.directive('fieldselect', function(Private) {

  var queryFilter = Private(require('ui/filter_bar/query_filter'));

  return {
    restrict: 'EA',
    link: function(scope, element, attrs) {

      // Check in actual filters for edit the select
      function checkFilters() {
        var filters = queryFilter.getFilters();

        var found = false;
        for (var i = 0; i < filters.length; i++) {
          if (/*_.isEqual(filters[i][$scope.config.filterType], oldFilter[$scope.config.filterType]) &&*/
              _.isEqual(filters[i].meta.key, scope.vis.params.field)  ) {
        
            scope.selected_field = filters[i].meta.value;
            element.value = scope.selected_field;
            found = true;
            break;
          }
        }

        if(!found) {
          scope.selected_field = "";
          element.value = "";
        }
      }

      scope.$on('checkFilters', checkFilters);
    }
  };
})


  module.controller('SelectEditorController', function ($scope, $filter) {
  
  ////////////////////////////
  // Do not delete this !
  // Abandonned feature that can be useful in the future.
  //
  /*var IndexedArray = require('ui/IndexedArray');

   $scope.getIndexedNumberFields = function() {
      var fields = $scope.vis.indexPattern.fields.raw;
      var fieldTypes = ["string"];

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

    $scope.fields = $scope.getIndexedNumberFields()*/

  });
});