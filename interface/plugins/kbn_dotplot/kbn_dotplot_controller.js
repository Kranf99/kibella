define(function (require) {
  var assign = require('lodash').assign;

  // get the kibana/kbn_dotplot module, and make sure that it requires the "kibana" module if it
  // didn't already
  var module = require('ui/modules').get('kibana/kbn_dotplot', ['kibana']);
  var ResizeSensor = require('css-element-queries/src/ResizeSensor');

  // add a controller to tha module, which will transform the esResponse into a
  // tabular format that we can pass to the table directive
  module.controller('KbnDotplotVisController', function ($scope, $element, Private) {
    var AggResponseTabifyProvider  = require('ui/agg_response/tabify/tabify');
    var tabifyAggResponse = Private(AggResponseTabifyProvider);
    var colors = Private(require('components/vislib/components/color/seed_colors'))

    var uiStateSort = ($scope.uiState) ? $scope.uiState.get('vis.params.sort') : {};
    assign($scope.vis.params.sort, uiStateSort);

    var Plotly = require('plotly.js/dist/plotly-basic');

    var randomColor = require('randomcolor');

    $scope.$watchMulti(['esResponse', 'vis.params'], function (resp) {
      if (resp.length > 0) {
        resp = resp[0];
        Plotly.purge(Plotly.d3.select($element[0]).node());
        //Names of the field that have been selected
        var firstFieldAggId = $scope.vis.aggs.bySchemaName['field'][0].id;
        var fieldAggName = $scope.vis.aggs.bySchemaName['field'][0].params.field.displayName;
        if ($scope.vis.aggs.bySchemaName['field'][1]) {
          var secondFieldAggId = $scope.vis.aggs.bySchemaName['field'][1].id;
          var secondfieldAggName = $scope.vis.aggs.bySchemaName['field'][1].params.field.displayName;
        }

        // Retrieve the metrics aggregation configured
        if ($scope.vis.aggs.bySchemaName['x-axis']) {
          var metricsAgg_xAxis = $scope.vis.aggs.bySchemaName['x-axis'][0];
          if ($scope.vis.aggs.bySchemaName['x-axis'][0].type.name != "count") {
            var metricsAgg_xAxis_name = $scope.vis.aggs.bySchemaName['x-axis'][0].params.field.displayName;
          } else {
            var metricsAgg_xAxis_name = ""
          }
          var metricsAgg_xAxis_title = $scope.vis.aggs.bySchemaName['x-axis'][0].type.title
        }
        if ($scope.vis.aggs.bySchemaName['y-axis']) {
          var metricsAgg_yAxis = $scope.vis.aggs.bySchemaName['y-axis'][0];
          if ($scope.vis.aggs.bySchemaName['y-axis'][0].type.name != "count") {
            var metricsAgg_yAxis_name = $scope.vis.aggs.bySchemaName['y-axis'][0].params.field.displayName;
          } else {
            var metricsAgg_yAxis_name = "";
          }
          var metricsAgg_yAxis_title = $scope.vis.aggs.bySchemaName['y-axis'][0].type.title
        }

        //Size
        if ($scope.vis.aggs.bySchemaName['dotsize']) {
          var radius_label = ""
          var metricsAgg_radius = $scope.vis.aggs.bySchemaName['dotsize'][0]

          var radius_ratio = +metricsAgg_radius.vis.params.radiusRatio

          if (metricsAgg_radius.params.customLabel) {
            radius_label = metricsAgg_radius.params.customLabel
          } else {

            var metricsAgg_radius_title = metricsAgg_radius.type.title

            if (metricsAgg_radius.type.name != "count") {
              var metricsAgg_radius_name = metricsAgg_radius.params.field.displayName
              radius_label = metricsAgg_radius_title + " " + metricsAgg_radius_name
            } else {
              radius_label = metricsAgg_radius_title
            }
          }
        }

        var Colors = require('components/colors/colors');

        var defaultDotSize = 10
        // compute size for single bucket
        if (metricsAgg_radius) {
          var firstBuketSized = resp.aggregations[firstFieldAggId].buckets.map(function (b) { return metricsAgg_radius.getValue(b) })
          var max = Math.max.apply(null, firstBuketSized)
          var min = Math.min.apply(null, firstBuketSized)
          var chartMin = 10
          var chartMax = 100
          var step = max - min
          var chartDiff = chartMax - chartMin
        }

        var sizes = resp.aggregations[firstFieldAggId].buckets.reduce(function (acc, bucket) {
          if (bucket[secondFieldAggId]) {
            acc.push(
              bucket[secondFieldAggId].buckets.reduce(function (accc, buck) {
                var size = defaultDotSize
                if (metricsAgg_radius) {
                  size = ((metricsAgg_radius.getValue(buck) - min) / step) * chartDiff + chartMin
                }
                accc.push(size)
                return accc;
             }, [])
            )
            return acc;
          } else {
            var size = defaultDotSize
              if (metricsAgg_radius) {
                size = ((metricsAgg_radius.getValue(bucket) - min) / step) * chartDiff + chartMin
              }
            acc.push(size);
            return acc;
          }
        }, []);

        function isColorUndefined() {
          return $scope.vis.aggs.bySchemaName['dotcolor'] === undefined || (
            resp.aggregations[firstFieldAggId].buckets[0][secondFieldAggId] === undefined ?
              resp.aggregations[firstFieldAggId].buckets[0][$scope.vis.aggs.bySchemaName['dotcolor'][0].id] === undefined :
              resp.aggregations[firstFieldAggId].buckets[0][secondFieldAggId].buckets[0][$scope.vis.aggs.bySchemaName['dotcolor'][0].id] === undefined
          )
        }

        // dot color values, instanciate to 'dot size' values if metric is undefined
        var colors_b = isColorUndefined() ? sizes : resp.aggregations[firstFieldAggId].buckets.reduce(function (acc, bucket) {
          if (bucket[secondFieldAggId]) {
            var s = bucket[secondFieldAggId].buckets.reduce(function (accc, buck) {
              accc.push(buck[$scope.vis.aggs.bySchemaName['dotcolor'][0].id].value);
              return accc;
            }, []);
            acc.push(s)
            return acc;
          } else {
            acc.push(bucket[$scope.vis.aggs.bySchemaName['dotcolor'][0].id].value);
            return acc;
          }
        }, []);
        
        if(resp.aggregations[firstFieldAggId].buckets[0][secondFieldAggId]) {
          var colors = colors_b.reduce(function(acc, size) {
            acc = acc.concat(size)
            return acc
          }, [])

          colors = Colors[$scope.vis.params.colors](colors, $scope.vis.params)
        } else {
          var colors = Colors[$scope.vis.params.colors](colors_b, $scope.vis.params)
        }

        var color_counter = 0
        var dataParsed = resp.aggregations[firstFieldAggId].buckets.map(function (bucket, bucket_i) {

          //If two buckets selected
          if (bucket[secondFieldAggId]) {
            var aux = bucket[secondFieldAggId].buckets.map(function (buck, buck_i, bucks) {
              
              //Size
              var size = defaultDotSize
              if (metricsAgg_radius) {
                size = ((metricsAgg_radius.getValue(buck) - min) / step) * chartDiff + chartMin
              }

              return {
                mode: 'markers',
                name: '',
                x: [metricsAgg_xAxis.getValue(buck)],
                y: [metricsAgg_yAxis.getValue(buck)],
                text: fieldAggName + ': ' + bucket.key + '<br>' + secondfieldAggName + ': ' + buck.key,
                field1: bucket.key,
                field2: buck.key,
                marker: {
                  color: colors[color_counter++],
                  sizemode: 'diameter',
                  size: size
                }
              }
            })

            return aux;
          }

          //If only one bucket selected
          var size = defaultDotSize
          if (metricsAgg_radius) {
            size = ((metricsAgg_radius.getValue(bucket) - min) / step) * chartDiff + chartMin
          }
          
          return {
            mode: 'markers',
            name: '',
            x: [metricsAgg_xAxis.getValue(bucket)],
            y: [metricsAgg_yAxis.getValue(bucket)],
            text: fieldAggName + ': ' + bucket.key,
            marker: {
              color: colors[bucket_i],
              sizemode: 'diameter',
              size: size,
            }
          }
        });
        
        var layout = {
          xaxis: { title: metricsAgg_xAxis_title + " " + metricsAgg_xAxis_name },
          yaxis: { title: metricsAgg_yAxis_title + " " + metricsAgg_yAxis_name },
          margin: { t: 20 },
          hovermode: 'closest',
          showlegend: false,
        };

        var data = dataParsed.reduce(function(acc, d) { return acc.concat(d);}, [])

        function getSize(viscontainer) {
          return {
            width: viscontainer.width,
            'margin-left': (100 - viscontainer.width) / 2 + 'px',
            height: viscontainer.height,
            'margin-top': (100 - viscontainer.height) / 2 + 'px'
          }
        }

        var viscontainer = $element[0].parentElement.parentElement;

        if(viscontainer) {
          var gd3 = Plotly.d3.select($element[0]).style(getSize(viscontainer));
          var gd = gd3.node()

          var plot = Plotly.plot(gd, data, layout, { showLink: false })

          var queryFilter = Private(require('ui/filter_bar/query_filter'));

          // On click event
          gd.on('plotly_click', function(d){
            var pts = d.points[0];
            var buildQueryFilter = require('ui/filter_manager/lib/query');
            
            var field1 = $scope.vis.aggs.bySchemaName['field'][0].params.field.displayName;
            var match = {};
            match[field1] = { 'query': pts.data.field1, 'type': 'phrase' }
            queryFilter.addFilters(buildQueryFilter({ 'match': match }, $scope.vis.indexPattern.id));

            if($scope.vis.aggs.bySchemaName['field'][1]) {
              var field2 = $scope.vis.aggs.bySchemaName['field'][1].params.field.displayName;
              var match2 = {};
              match2[field2] = { 'query': pts.data.field2, 'type': 'phrase' }
              queryFilter.addFilters(buildQueryFilter({ 'match': match2 }, $scope.vis.indexPattern.id));
            }
          });
          new ResizeSensor(viscontainer, function() {
            Plotly.Plots.resize(gd)
          });

          var buildRangeFilter = require('components/filter_manager/lib/range');
          gd.on('plotly_relayout',
            function(eventdata) {
                // The 'plotly_relayout' event is triggered when you load the visualisation
                if (!eventdata['xaxis.range[0]'] || !eventdata['xaxis.range[1]']) return

                // Removing all pre-existing filters with the same key/name as X and Y axis
                queryFilter.getFilters().map((filter) => {
                  if (filter.meta.key === $scope.vis.aggs.bySchemaName['x-axis'][0].params.field.name ||
                      filter.meta.key === $scope.vis.aggs.bySchemaName['y-axis'][0].params.field.name) {
                    queryFilter.removeFilter(filter)
                  }
                })
                
                if(eventdata['xaxis.range[0]'] && eventdata['xaxis.range[1]']) {
                  queryFilter.addFilters(buildRangeFilter($scope.vis.aggs.bySchemaName['x-axis'][0].params.field, {
                    gte: Math.round(Number(eventdata['xaxis.range[0]'])),
                    lte: Math.round(Number(eventdata['xaxis.range[1]']))
                  }, $scope.vis.aggs.vis.indexPattern));
                }

                if(eventdata['yaxis.range[0]'] && eventdata['yaxis.range[1]']) {
                  queryFilter.addFilters(buildRangeFilter($scope.vis.aggs.bySchemaName['y-axis'][0].params.field, {
                    gte: Math.round(Number(eventdata['yaxis.range[0]'])),
                    lte: Math.round(Number(eventdata['yaxis.range[1]']))
                  }, $scope.vis.aggs.vis.indexPattern));
                }
          });
        }
      }
    });
  });
});