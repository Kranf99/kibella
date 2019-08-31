define(function (require) {
  return function VislibVisBuildChartData(Private,courier) {
    var aggResponse = Private(require('components/agg_response/index'));
    var Table = Private(require('components/agg_response/tabify/_table'));
    var requestQueue = Private(require('components/courier/_request_queue'));
    var callClient = Private(require('components/courier/fetch/_call_client'));
    var _ = require('lodash');

    function groupAggs(name, aggs) {
      aggs[0].key = name;
      return aggs.reduce(function(acc, agg) {
        if('1' in acc && 'value' in acc['1']) {
          acc['1'].value += agg['1'].value;
        }
        acc.doc_count += agg.doc_count;
        return acc;
      })
    }

    return function (esResponse) {
      var vis = this.vis;
      if (vis.isHierarchical()) {
        if(vis.type.name == "pie" && vis.params.displayOther == true) {
          var source = courier.createSource('search');
          source._state = _.clone(requestQueue[requestQueue.length-1].source._state);
          var req = source._createRequest();
          
          var state = vis.getState();
          
          if(state.aggs.length > 1 && state.aggs[1].params.size > 0) {
            var aggs = req.source._state.aggs();
            aggs['2'].terms.size = 0;
            req.source._state.aggs = function() { return aggs };
            
            return callClient(req.strategy, [req]).then(function(res) {
              res = res[0];
              var allKeys = res.aggregations['2'].buckets.map(function(b){ return b.key; });
              var currentKeys = esResponse.aggregations['2'].buckets.map(function(b){ return b.key; });
              var otherKeys = allKeys.filter(function(i) { return currentKeys.indexOf(i) < 0; });
              var otherAggs = res.aggregations['2'].buckets.filter(function(agg) {
                return otherKeys.indexOf(agg.key) >= 0;
              });
              if(otherAggs.length > 0) {
                esResponse.aggregations['2'].buckets.push(groupAggs('Other', otherAggs));
              }
              return aggResponse.hierarchical(vis, esResponse);
            });
          }
        }
        
        // the hierarchical converter is very self-contained (woot!)
        return aggResponse.hierarchical(vis, esResponse);
      }

      var tableGroup = aggResponse.tabify(vis, esResponse, {
        canSplit: true,
        asAggConfigResults: true
      });

      var converted = convertTableGroup(vis, tableGroup);
      if (!converted) {
        // mimic a row of tables that doesn't have any tables
        // https://github.com/elastic/kibana/blob/7bfb68cd24ed42b1b257682f93c50cd8d73e2520/src/kibana/components/vislib/components/zero_injection/inject_zeros.js#L32
        converted = { rows: [] };
      }

      converted.hits = esResponse.hits.total;

      return converted;
    };

    function convertTableGroup(vis, tableGroup) {
      var tables = tableGroup.tables;
      var firstChild = tables[0];
      if (firstChild instanceof Table) {

        var chart = convertTable(vis, firstChild);
        // if chart is within a split, assign group title to its label
        if (tableGroup.$parent) {
          chart.label = tableGroup.title;
        }
        return chart;
      }

      if (!tables.length) return;
      var out = {};
      var outList;

      tables.forEach(function (table) {
        if (!outList) {
          var aggConfig = table.aggConfig;
          var direction = aggConfig.params.row ? 'rows' : 'columns';
          outList = out[direction] = [];
        }

        var output;
        if (output = convertTableGroup(vis, table)) {
          outList.push(output);
        }
      });

      return out;
    }

    function convertTable(vis, table) {
      return vis.type.responseConverter(vis, table);
    }
  };
});
