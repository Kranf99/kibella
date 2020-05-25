var uiModules = require('ui/modules');
var AggResponseTabifyTabifyProvider = require('ui/agg_response/tabify/tabify');
var errors = require('components/errors'); 
var module = uiModules.get('kibana/waterfall_vis', ['kibana']);
var ResizeSensor = require('css-element-queries/src/ResizeSensor');
var Plotly = require('plotly.js/dist/plotly-finance.min.js');
var chartHover = require('components/chart_hover/chart_hover')

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

module.controller('KbnWaterfallVisController', function($scope, $element, Private, $location){
	var hold ="";
	var wold= "";
	$scope.$root.label_keys = [];
	$scope.$root.editorParams = {};
	$scope.$root.activate_grouped = false;
	var tabifyAggResponse = Private(AggResponseTabifyTabifyProvider);
	var timeseries = [];
	var parsed_data = [];
	var chart_labels = {};
	var x_label = "";
	var y_label = "";
	var time_format = "";
	var lastResp = undefined;


	// Identify the div element in the HTML
	var idchart = $element.children().find(".chartwaterfall");
	var message = 'This chart require more than one data point. Try adding an X-Axis Aggregation.';


	// Be alert to changes in vis_params
	$scope.$watch('vis.params', function (params) {
		if (!$scope.$root.show_chart) return;
		renderResp();
	});
	

	// Waterfall chart generator
	
	$scope.chartGen = function(){
		$scope.chart = null;
		// change bool value
		$scope.$root.show_chart = true;

		//create data_colors object
		var data_colors = {};
		var data_types = {};
		var i = 0;
		/*var create_color_object = $scope.$root.label_keys.map(function(chart){
			if (i == 0){
				data_colors[chart] = $scope.vis.params.color1;
				data_types[chart] = $scope.vis.params.type1;
			} else if (i == 1){
				data_colors[chart] = $scope.vis.params.color2;
				data_types[chart] = $scope.vis.params.type2;
			
			} else if (i == 2){
				data_colors[chart] = $scope.vis.params.color3;
				data_types[chart] = $scope.vis.params.type3;
			
			} else if (i == 3){
				data_colors[chart] = $scope.vis.params.color4;
				data_types[chart] = $scope.vis.params.type4;
			
			} else if (i == 4){
				data_colors[chart] = $scope.vis.params.color5;
				data_types[chart] = $scope.vis.params.type5;
			}
			i++;
		});*/

		// count bar charts and change bar ratio
		var the_types = $scope.$root.label_keys.map(function(l) { return data_types[l]; });
		var chart_count = {};
		the_types.forEach(function(i){ chart_count[i] = (chart_count[i] || 0)+1; });

		if (chart_count.bar){

			var my_ratio = 5 / timeseries.length;
			my_ratio = (my_ratio > 0.35) ? my_ratio = 0.3 : my_ratio;

			if (chart_count.bar > 1){
			
				my_ratio = (my_ratio < 0.02) ? my_ratio = 0.02 : my_ratio;
				$scope.$root.activate_grouped = true;
			
			} else {
				
				my_ratio = (my_ratio < 0.01) ? my_ratio = 0.01 : my_ratio;
				$scope.$root.activate_grouped = false;
			}

		}

		var bucket_type = $scope.vis.aggs.bySchemaName['buckets'][0].type.name;

		
		var total_data = []
		var p_data = parsed_data

		function gen_data(x, y, measures, polarity, fields, text, name, is_total, rightY) {
			y = y.map(function(val,i) {
				return polarity[i] === false ? -val : val;
			});

			return {
				name: name,
				type: "waterfall",
				orientation: $scope.vis.params.vertical ? "v" : "h",
				measure: measures,
				x: $scope.vis.params.vertical ? x : y,
				textposition: "outside",
				fields: fields,
				is_total: is_total,
				y_label: y_label,
				text: [],
				y: $scope.vis.params.vertical ? y : x,
				connector: {
				  line: {
					color: "rgb(63, 63, 63)"
				  }
				},
			}
		}

		var totals = []
		$scope.$root.totals = totals = $scope.vis.params.totals !== false ? $scope.vis.params.totals : [];

		var field_list = []
		$scope.$root.fields = field_list = $scope.vis.aggs.bySchemaName['buckets'].reduce(function(acc, cur) {
			return cur.params.field !== undefined ? acc.concat([cur.params.field.displayName]) : acc;
		}, []);

		var buckets_list = Array($scope.vis.aggs.bySchemaName['buckets'].length).fill(0).map(function(el, i) {
			return _.flatten(getBuckets(i)).filter(function(a) { return a !== null; })
		})

		var buckets_keys = buckets_list.map(function(buckets, i) {
			return buckets.reduce(function(acc, bucket) {
				return acc.indexOf(bucket.key) === -1 ? acc.concat([bucket.key]) : acc;
			}, [])
		})

		var agg_buckets = {} // flatten and summed buckets
		
		var metric_id = $scope.vis.aggs.bySchemaName['metric'][0].id
		var metric_type = $scope.vis.aggs.bySchemaName['metric'][0].__type.name;

		buckets_list.map(function(buckets, i) {
			buckets.map(function(bucket) {
				var key = String(getBucketKey(bucket, i));
				if(metric_type === 'sum') {
					agg_buckets[key] = (agg_buckets[key] || 0) + (bucket[metric_id].value || 0);
				} else {
					agg_buckets[key] = (agg_buckets[key] || 0) + (bucket.doc_count || 0);
				}
			})
		})
		
		// Remove buckets where value is zero
		buckets_keys.map(function(b_keys, i) {
			return b_keys
				.reduce(function(acc,key) {
					return agg_buckets[key] === 0 ? acc.concat([key]) : acc;
				}, [])
				.map(function(key) {
					delete agg_buckets[key];
					buckets_keys[i].splice(buckets_keys[i].indexOf(key), 1)
				})
		})

		function getBuckets(i, j, buckets) {
			i = i === undefined ? $scope.vis.aggs.bySchemaName['buckets'].length-1 : i; j = j || 0;
			if(!buckets) buckets = lastResp.aggregations[$scope.vis.aggs.bySchemaName['buckets'][0].id].buckets;

			if($scope.vis.aggs.bySchemaName['buckets'][j].type.name === "range")
				buckets = Object.keys(buckets).map(function(bucket_key) {
					return Object.assign({key: bucket_key}, buckets[bucket_key])
				});
			
			if(j < i) return buckets.map(function(bucket, k) {
				if(!bucket.hasOwnProperty($scope.vis.aggs.bySchemaName['buckets'][j+1].id))
					return null
				
				return getBuckets(i, j+1, bucket[$scope.vis.aggs.bySchemaName['buckets'][j+1].id].buckets)
			});

			return buckets;
		}

		function getBucketKey(bucket, i) {
			var bucket_type = $scope.vis.aggs.bySchemaName['buckets'][i].type.name;

			if(bucket_type === "histogram" || bucket_type === "terms" || bucket_type === "filters") {
				return bucket.key
			}
			
			return bucket.key
		}

		$scope.$root.lists = $scope.vis.params.lists !== false ? $scope.vis.params.lists.slice(0,buckets_list.length).map(correctList) : []
		
		function correctList(l, i) {
			var newList = l.filter(function(item) {
				return buckets_keys[i].indexOf(item.name) !== -1;
			})
			return newList.concat(
				buckets_keys[i].filter(function(v) {
					return newList.map(function(item) {
						return item.name;
					}).indexOf(v) === -1;
				}).map(fillDefaults)
			)
		}
		
		function fillDefaults(name) {
			return {
				name: name,
				measure: 'relative',
				negative: false
			}
		}
		
		buckets_list.map(function(buckets, i) {
			if($scope.$root.lists.length-1 < i) $scope.$root.lists.push(buckets_keys[i].map(fillDefaults));
			
			if(totals.length-1 < i) totals.push(true);
			
			var list = $scope.$root.lists[i];

			var x = list.map(function(item) {
				return item.name;
			})
			
			var y = list.map(function(item) {
				var index = buckets_keys[i].indexOf(item.name)
				if(index === -1) return 0;

				return agg_buckets[item.name];
			})
			
			var measures = list.map(function(item) {
				return item.measure;
			})
			
			var polarity = list.map(function(item) {
				return !item.negative;
			})

			var is_total = list.map(function(item) {
				return false;
			})
			
			if(totals[i]) {
				x.push('Total \`'+field_list[i]+'\`')
				y.push(0)
				measures.push('total')
				polarity.push(true)
				is_total.push(true)
			}

			var fields = Array(x.length).fill(field_list[0])

			var tot = gen_data(x, y, measures, polarity, fields, p_data[i], field_list[i], is_total, $scope.vis.params["rightY" + (i+1)])
			total_data.push(tot)
		})


		// largest number possible in JavaScript.
		var global_min = Number.MAX_VALUE;

		// Search the min value of the data
		var parsed_data_copy = JSON.parse(JSON.stringify(parsed_data));	
		var cada_array = parsed_data_copy.map(function(each_array){

			each_array.splice(0, 1);

			// ECMAScript 6 spread operator
			//var each_array_min = Math.min(...each_array);
	      	var each_array_min = each_array.min();
			global_min = (each_array_min < global_min) ? each_array_min : global_min;

		});

		global_min = (global_min >= 0) ? 0 : global_min;

		var viscontainer = idchart[0].parentElement.parentElement;

        function getSize() {
          return { width: viscontainer.width,
           // 'margin-left': (50 - viscontainer.width) / 2 + 'px',

            height: viscontainer.height,
            'margin-top': (50 - viscontainer.height) / 2 + 'px'
          }
		}
		
		// Legend Position & Orientation
		var legend_v = {}
		var showlegend = true

		switch($scope.vis.params.legend_position) {
			case "right": 	legend_v = { x: 1, y: 0.5, orientation: "v" }; 		break;
			case "bottom": 	legend_v = { x: 0, y: -0.2, orientation: "h" }; 	break;
			case "top": 	legend_v = { x: 0, y: 1.1, orientation: "h" }; 		break;
			default:		showlegend = false;	
		}

		// Chart Layout
		var xaxis =  {
			showgrid: $scope.vis.params.gridlines,
			type: "category",
			autorange: $scope.vis.params.vertical ? undefined : "reversed",
			automargin: $scope.vis.params.vertical ? false : true
		};
		
		var yaxis = {
			showgrid: $scope.vis.params.gridlines,
			type: "linear",
			// automargin: true //$scope.vis.params.vertical ? true : false
		};

		var layout = {
			xaxis: $scope.vis.params.vertical ? xaxis : yaxis,
			yaxis: $scope.vis.params.vertical ? yaxis : xaxis,
			autosize: true,
			showlegend: showlegend,
			margin: { t: 0, l: 35, r: 5, b: 18},
			legend: legend_v
		};

		if($scope.vis.params.threshold)
			layout.shapes = [{
					type: 'line',
					xref: $scope.vis.params.vertical ? 'paper' : 'x',
					yref: $scope.vis.params.vertical ? 'y' : 'paper',
					x0: $scope.vis.params.vertical ? 0 : $scope.vis.params.threshold_value,
					y0: $scope.vis.params.vertical ? $scope.vis.params.threshold_value : 0,
					x1: $scope.vis.params.vertical ? 1 : $scope.vis.params.threshold_value,
					y1: $scope.vis.params.vertical ? $scope.vis.params.threshold_value : 1,
					line:{
						color: 'rgb(50, 50, 50)',
						width: 2,
						dash:'dot'
					}
			}]

		var gd3 = Plotly.d3.select(idchart[0])
		var gd = gd3.node()
		
		chartHover.destroy();

		$scope.chart = null
		$scope.chart = Plotly.newPlot(gd, total_data, layout, { showLink: false, responsive: true })

		$scope.$root.list_selected = null;

		function addMargin() {
			if(!$scope.vis.params.vertical) return Promise.resolve();

			layout.margin.b = $(gd).find('.xaxislayer-above')[0].getBBox().height+10;
			return Plotly.redraw(gd);
		}

		addMargin();

        if(viscontainer) {
        	gd.on('plotly_click', function(d){
	            var pts = d.points[0];
	            var queryFilter = Private(require('ui/filter_bar/query_filter'));
	            var buildQueryFilter = require('ui/filter_manager/lib/query');
				var buildRangeFilter = require('ui/filter_manager/lib/range');
				var bucket_name = pts.data.name;
				var bucket_type = $scope.vis.aggs.bySchemaName['buckets'].reduce(function(acc, cur){
					return acc ? acc : (cur.params.field.displayName === bucket_name ? cur.__type.name : acc)
				}, null)

				var value = $scope.vis.params.vertical ? pts.x : pts.y;
				var x_axis = $scope.vis.params.vertical ? 'x' : 'y';
				var is_total = pts.data.is_total[pts.pointIndex];

				if(is_total) return;

	            if(bucket_type === "terms") {
		            var match = {};
		            match[bucket_name] = { 'query': value, 'type': 'phrase' }
		            queryFilter.addFilters(buildQueryFilter({ 'match': match }, $scope.vis.indexPattern.id));
	        	}
	        	else if(bucket_type === "histogram") {
					var interval = $scope.vis.aggs.bySchemaName['buckets'].reduce(function(acc, cur){
						return acc ? acc : (cur.params.field.displayName === bucket_name ? cur.params.interval : acc)
					}, null)
					
	        		var match = {};
		            match[bucket_name] = { 'query': value, 'type': 'number' }
		            queryFilter.addFilters(buildRangeFilter({name: bucket_name},
	                                            {gte: pts[x_axis], lte: parseInt(pts[x_axis]) + interval - 1 },
	                                            $scope.vis.indexPattern));

	        	} else if(bucket_type === "range") {
	        		var filter_values = value.split('-')
	        		queryFilter.addFilters(buildRangeFilter({name: bucket_name},
	                                            {gte: filter_values[0], lte: filter_values[1] },
	                                            $scope.vis.indexPattern));
	        	}
          	});
          	chartHover.init(viscontainer, gd);
        }

		var resizing = false;
		new ResizeSensor(viscontainer, function() {
			if(!resizing) {
				resizing = true;
				setTimeout(function() {
					Plotly.Plots.resize(gd)
						.then(addMargin)
						.then(function() {
							resizing = false;
						});
				}, 250)
			}
		});
	};


	// Get data from ES
	$scope.processTableGroups = function (tableGroups) {
		tableGroups.tables.forEach(function (table) {
			table.columns.forEach(function (column, i) {
				var data = table.rows;
				var tmp = [];

				for (var val in data){
          			if(data[val][i] || data[val][i] === 0)
					  tmp.push(data[val][i]);
				}

				if (i > 0){

					$scope.$root.label_keys.push(column.title);
					chart_labels[column.title] = column.title;
					tmp.splice(0, 0, column.title);
					parsed_data.push(tmp);
			 
				} else {
			 
					x_label = column.title;
				}

				if(i >= table.columns.length-1) {
					y_label = column.title
				}
			});
		});

		$scope.$root.editorParams.label = chart_labels;
	};
		
	function renderResp(resp){
		if(!resp) { resp = lastResp; }

		if (resp) {
			lastResp = resp;
			if(!lastResp.aggregations[$scope.vis.aggs.bySchemaName['buckets'][0].id]) return;

			if (!$scope.vis.aggs.bySchemaName['buckets']){
				$scope.waiting = message;
				return;
			}
			timeseries.length = 0;
			parsed_data.length = 0;
			chart_labels = {};
			$scope.$root.label_keys = [];
			$scope.processTableGroups(tabifyAggResponse($scope.vis, resp));
			
			$scope.chartGen();
		}

	}
	$scope.$watch('esResponse', renderResp);

});

