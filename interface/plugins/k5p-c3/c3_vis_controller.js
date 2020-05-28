var uiModules = require('ui/modules');
var AggResponseTabifyTabifyProvider = require('ui/agg_response/tabify/tabify');
var errors = require('components/errors'); 

// get the kibana/table_vis module, and make sure that it requires the "kibana" module if it didn't already
var module = uiModules.get('kibana/c3_vis', ['kibana']);
var ResizeSensor = require('css-element-queries/src/ResizeSensor');

// Require Plotly
var Plotly = require('plotly.js/dist/plotly-basic');

var chartHover = require('components/chart_hover/chart_hover')

function getValuesOfObject(obj) {
  var r = [];

  for(var i in obj)
    r.push(obj[i]);
  
  return r;
}

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

module.controller('KbnC3VisController', function($scope, $element, Private, $location){
	var hold ="";
	var wold= "";
	$scope.$root.label_keys = [];
	$scope.$root.editorParams = {};
	$scope.$root.activate_grouped = false;
	var tabifyAggResponse = Private(AggResponseTabifyTabifyProvider);
	var x_axis_values = [];
	var timeseries = [];
	var parsed_data = [];
	var chart_labels = {};
	var x_label = "";
	var time_format = "";
	var lastResp = undefined;


	// Identify the div element in the HTML
	var idchart = $element.children().find(".chartc3");
	var message = 'This chart require more than one data point. Try adding an X-Axis Aggregation.';


	// Be alert to changes in vis_params
	$scope.$watch('vis.params', function (params) {

		if (!$scope.$root.show_chart) return;
		//if (Object.keys(params.editorPanel).length == 0 && params.enableZoom == previo_zoom) return;
		renderResp();
	});


	// C3JS chart generator
	
	$scope.chartGen = function(){
		$scope.chart = null;
		// change bool value
		$scope.$root.show_chart = true;

		//create data_colors object
		var data_colors = {};
		var data_types = {};

		var create_color_object = $scope.$root.label_keys.map(function(chart, i) {
			data_colors[chart] = $scope.vis.params['color' + (i+1)];
			data_types[chart] = $scope.vis.params['type' + (i+1)];
			/*if (i == 0){
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
			}*/
		});

		// count bar charts and change bar ratio
		var the_types = $scope.$root.label_keys.map(function (l){ return data_types[l];});
		var chart_count = {};
		the_types.forEach(function (i){ chart_count[i] = (chart_count[i] || 0)+1 });

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

		function range_array_to_string(r_arr) {
			return r_arr.map(function(r_obj) { return r_obj.gte + " - " + r_obj.lt })
		}
		
		var total_data = []
		var p_data = parsed_data

		function gen_data(x, y, type, text, name, color, rightY) {
			return {
				x: x,
				y: y,
				type: type,
				text: text,
				textposition: "top center",
				name: name,
				yaxis: rightY ? "y2" : "y1",
				marker: {
					color: color,
			  		size: 6,
				}
			}
		}
		
		p_data.map(function(el, i) {
			var n = p_data[i][0]
			p_data[i] = p_data[i].slice(1) // Remove first string

			var x_v={};

			if(bucket_type === "histogram" || bucket_type === "terms" || bucket_type === "filters") {
				x_v = x_axis_values[0]
			} else {
				x_v = range_array_to_string(x_axis_values[0])
			}

			var tot = gen_data(x_v, p_data[i], data_types[n], p_data[i], n, $scope.vis.params["color" + (i+1)], $scope.vis.params["rightY" + (i+1)])

			switch($scope.vis.params["type"+(i+1)]) {
				case "line":
					tot.mode = "lines";
					break;
				case "scatter": 
					tot.type = "scatter";
					tot.mode = "";
					break;
				case "bar":
					tot.mode = "bar";
					break;
				case "spline":
					tot.line = {shape: "spline"};
					tot.mode = "lines";
					tot.type = "scatter";
					break;
				case "area":
					tot.mode = "lines"
					tot.fill = "tozeroy"
					break;
				case "step":
					tot.line = {shape: "hvh"}
					tot.mode = "lines"
					break;
				case "area-spline":
					tot.line = {shape: "spline"}
					tot.mode = "lines"
					tot.fill = "tozeroy"
					break;
				case "area-step":
					tot.line = {shape: "hvh"}
					tot.mode = "lines"
					tot.fill = "tozeroy"
					break;
				default:
					tot.mode = "bar";
					break;

			}

			// "Hide Point" Parameter
			if(!$scope.vis.params.hidePoints)
				tot.mode = tot.mode.concat("+markers")

			// "Data Labels" Parameter
			if($scope.vis.params.dataLabels)
				tot.mode = tot.mode.concat("+text")
			
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

		// configurate C3 object
		var config = {};

		// timeseries config
		if (bucket_type == "date_histogram" || bucket_type == "date_range"){

			config.bar = {"width": {"ratio": my_ratio}};

			var last_timestapm = timeseries[timeseries.length-1];
			var first_timestamp = timeseries[1];
			var timestamp_diff = last_timestapm - first_timestamp;

			// Time format 
			if (timestamp_diff > 86400000){
				time_format = "%Y-%m-%d";
			} else {
				time_format = "%H:%M";
			}

			var bool_fit = false;
			bool_fit = (timeseries.length < 4) ? bool_fit = true : bool_fit = false;

			config.axis = {"x": {"label": {"text": x_label, "position": 'outer-center'}, "type":"timeseries", "tick": {"fit": bool_fit, "multiline": false,"format": time_format}}, "y": {"min": global_min, "padding": {"top": 30, "bottom": 0 }}};
			config.tooltip = {"format": {"title": function (x) {return x;} }};

			if ($scope.vis.params.legend_position == "bottom"){
				config.padding = {"right": 20};
			}
		}

		// Group bar charts, we need 2+ bar charts and checked checkbox in params
		if ($scope.$root.activate_grouped && $scope.vis.params.grouped){

			var los_keys = $scope.$root.label_keys;
			var los_values = $scope.$root.label_keys.map(function(l) { return data_types[l]; });
			var group_charts = [];
			var i = 0;
			var are_they = los_values.map(function(chart_type){
				if (chart_type == "bar"){
					group_charts.push(los_keys[i]);
				}

				i++;
			});

			config.data.groups = [group_charts];
		}

		if ($scope.vis.params.gridlines){
			config.grid = {"x": {"show": true}, "y": {"show": true}};
		}

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
		var layout = {
			autosize: true,
			xaxis: {
				title: x_label,
				showgrid: $scope.vis.params.gridlines,
				fixedrange: !$scope.vis.params.enableZoom,
				type: 'category'
			},
			yaxis: { 
				showgrid: $scope.vis.params.gridlines,
				fixedrange: !$scope.vis.params.enableZoom,
				automargin: true,
				
			},
			yaxis2: {
				overlaying: 'y',
				side: 'right',
				automargin: true
			},
			margin: { t: 0, l: 35, r: 5, b: 50},
			hovermode: 'closest',
			showlegend: showlegend,
			legend: legend_v,
		};

		if($scope.vis.params.threshold)
			layout.shapes = [{
					type: 'line',
					xref: 'paper',
					x0: 0,
					y0: $scope.vis.params.threshold_value,
					x1: 1,
					y1: $scope.vis.params.threshold_value,
					line:{
						color: 'rgb(50, 50, 50)',
						width: 2,
						dash:'dot'
					}
			}]

		if($scope.vis.params.grouped)
			layout.barmode = 'stack'

		if(bucket_type === "histogram")
			layout.xaxis.dtick = $scope.vis.aggs[1].params.interval

		var gd3 = Plotly.d3.select(idchart[0])
		var gd = gd3.node()
		
		chartHover.destroy();

		$scope.chart = null
        $scope.chart = Plotly.newPlot(gd, total_data, layout, { showLink: false, responsive: true })

        if(viscontainer) {
        	gd.on('plotly_click', function(d){
	            var pts = d.points[0];
	            var queryFilter = Private(require('ui/filter_bar/query_filter'));
	            var buildQueryFilter = require('ui/filter_manager/lib/query');
	            var buildRangeFilter = require('ui/filter_manager/lib/range');

	            if(bucket_type === "terms") {
		            var field1 = $scope.vis.aggs.bySchemaName.buckets[0].params.field.displayName;
		            var match = {};
		            match[field1] = { 'query': pts.x, 'type': 'phrase' }
		            queryFilter.addFilters(buildQueryFilter({ 'match': match }, $scope.vis.indexPattern.id));
	        	}
	        	else if(bucket_type === "histogram") {
	        		var field = $scope.vis.aggs.bySchemaName.buckets[0].params.field.displayName;
	        		var match = {};
		            match[field] = { 'query': pts.x, 'type': 'number' }
	        		//queryFilter.addFilters(buildQueryFilter({ 'match': match }, $scope.vis.indexPattern.id));
		            queryFilter.addFilters(buildRangeFilter({name: $scope.vis.aggs.bySchemaName.buckets[0].params.field.displayName},
	                                            {gte: pts.x, lte: pts.x + (pts.data.x[pts.data.x.length-1] - pts.data.x[pts.data.x.length-2] - 1) },
	                                            $scope.vis.indexPattern));

	        	} else if(bucket_type === "range") {
	        		var field = $scope.vis.aggs.bySchemaName.buckets[0].params.field.displayName;
	        		var range = {};
	        		var filter_values = pts.x.split(' - ')
	        		queryFilter.addFilters(buildRangeFilter({name: $scope.vis.aggs.bySchemaName.buckets[0].params.field.displayName},
	                                            {gte: filter_values[0]   , lte: filter_values[1] },
	                                            $scope.vis.indexPattern));
	        	}
          	});

          	chartHover.init(viscontainer, gd);
        }

		new ResizeSensor(viscontainer, function() {
			Plotly.Plots.resize(gd)
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
					x_axis_values.push(tmp);
				}
			});
		});

		$scope.$root.editorParams.label = chart_labels;
	};
		
	function renderResp(resp){
		if(!resp) { resp = lastResp; }

		if (resp) {

			if (!$scope.vis.aggs.bySchemaName['buckets']){
				$scope.waiting = message;
				return;
			}

			x_axis_values.length = 0;
			timeseries.length = 0;
			parsed_data.length = 0;
			chart_labels = {};
			$scope.$root.label_keys = [];
			$scope.processTableGroups(tabifyAggResponse($scope.vis, resp));

			
			// avoid reference between arrays!!!
			timeseries = x_axis_values[0].slice();   
			timeseries.splice(0,0,'x1');
			
			$scope.chartGen();
		}

	}
	$scope.$watch('esResponse', renderResp);

});

