var uiModules = require('ui/modules');
var AggResponseTabifyTabifyProvider = require('ui/agg_response/tabify/tabify');
var errors = require('components/errors');

// get the kibana/table_vis module, and make sure that it requires the "kibana" module if it didn't already
var module = uiModules.get('kibana/c3_vis', ['kibana']);
var ResizeSensor = require('css-element-queries/src/ResizeSensor');

// Require Plotly
var Plotly = require('plotly.js/dist/plotly-basic');

var chartHover = require('components/chart_hover/chart_hover')

var data = {}
var slices = []
var type = ''
function getValuesOfObject(obj) {
	var r = [];

	for (var i in obj)
		r.push(obj[i]);

	return r;
}

Array.prototype.min = function () {
	return Math.min.apply(null, this);
};

var default_colors = [
	'rgb(212, 115, 255)',
	'rgb(118, 93, 224)',
	'rgb(112, 145, 255)',
	'rgb(142, 216, 243)',
	'rgb(188, 82, 188)',
]

module.controller('KbnC3VisController', function ($scope, $element, Private, $location) {
	var hold = "";
	var wold = "";
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
	var gd3 = Plotly.d3.select(idchart[0])
	var gd = gd3.node()
	// console.log(Plotly.d3, gd3, gd)

	// Be alert to changes in vis_params
	$scope.$watch('vis.params', function (params) {

		if (!$scope.$root.show_chart) return;
		//if (Object.keys(params.editorPanel).length == 0 && params.enableZoom == previo_zoom) return;
		renderResp();
	});


	// C3JS chart generator
	$scope.chartGen = function () {
		$scope.chart = null;
		// change bool value
		$scope.$root.show_chart = true;
		//create data_colors object
		var data_colors = {};
		var data_types = {};
		var buckets = []
		var flat_buckets = []

		if($scope.vis.aggs.bySchemaName['segment'])
			var bucket_type = $scope.vis.aggs.bySchemaName['segment'][0].type.name;
	
			var total_data = []
		var p_data = parsed_data
		var i = 0;
		var create_color_object = $scope.$root.label_keys.map(function (chart) {
			if (i == 0) {
				data_colors[chart] = $scope.vis.params.color1;
				data_types[chart] = $scope.vis.params.type1;
			} else if (i == 1) {
				data_colors[chart] = $scope.vis.params.color2;
				data_types[chart] = $scope.vis.params.type2;

			} else if (i == 2) {
				data_colors[chart] = $scope.vis.params.color3;
				data_types[chart] = $scope.vis.params.type3;

			} else if (i == 3) {
				data_colors[chart] = $scope.vis.params.color4;
				data_types[chart] = $scope.vis.params.type4;

			} else if (i == 4) {
				data_colors[chart] = $scope.vis.params.color5;
				data_types[chart] = $scope.vis.params.type5;
			}
			i++;
		});

		var v = []
		for (var i = 0; i < buckets.length; i++) {
			v.push(buckets[i].doc_count)
		}

		var result = []
		var result_names = []
		var index = 0;
		function flatten(children, ind, arr, names) {
			// console.log(children, arr)

			if(typeof arr === "number") return;
			// arr.push([])
			for (var i = 0; i < children.length; i++) {
				//if(i === children.length-1)
				console.log("children", children[i])
				arr[ind].push(children[i].size)
				names[ind].push(children[i].name)
				if (children[i].children !== undefined) {
					// console.log("uuu")
					if (arr[ind + 1] === undefined) {
						// console.log("ooo")
						 arr.push([])
						 names.push([])
					}
					// console.log(children[i])
					//arr[i].push([])
					flatten(children[i].children, ind+1, arr, names)
				}
			}
		}

		function res(ress, resname, row_index, type) {
			return ress.map(function (el, indd, arr) {
				console.log("bonjour", data, resname, ress, indd, arr, el)
				var set = {
					values: el,
					
					labels: resname[indd],
					type: 'pie',
					sort: false,
					marker: {
						colors: default_colors
					},
					direction: 'clockwise',
					textinfo: 'none',
					domain: {
						row: 0,
						column: 0
					},
				}

				if (type === "rows")
					set.domain.row = row_index
				else
					set.domain.column = row_index

				if (indd == 0 && $scope.vis.params.isDonut)
					set.hole = 0.3
					//		set.domain = {'x': [0.15,0.85], 'y': [0.15,0.85]}
				else if (indd >= 1) {
					set.hole = 0.6 + (1 / arr.length) * 0.6 * (indd-1)
				}

				return set
			})
		}

		if (slices !== undefined) {
			result = [[]]
			flatten(slices.children, 0, result)
			total_data = res(result)
		} else if (data.rows !== undefined) {
			type = 'rows'
			result = []
			data.rows.map(function (row, ind) {
				result.push([])
				result[ind].push([])
				result_names.push([])
				result_names[ind].push([])
				flatten(row.slices.children, 0, result[ind], result_names[ind])
				total_data  =  total_data.concat(res(result[ind], result_names[ind], ind, type))
			})
		} else if (data.columns !== undefined) {
			type = 'columns'
			result = []
			data.columns.map(function (row, ind) {
				result.push([])
				result[ind].push([])
				flatten(row.slices.children, 0, result[ind])
				total_data = total_data.concat(res(result[ind], result_names[ind], ind, type))
			})
		}
		var viscontainer = idchart[0].parentElement.parentElement;

			console.log("result", result)
			console.log("tot", total_data)
		// Chart Layout
		var layout = {
			//autosize: true,
			showlegend: $scope.vis.params.addLegend,
			hovermode: $scope.vis.params.addTooltip,
			grid: { rows: 1, columns: 1 }
		};

		if (type === 'rows')
			layout.grid.rows = result.length
		else if (type === 'columns')
			layout.grid.columns = result.length
		// if($scope.vis.params.grouped)
		// 	layout.barmode = 'stack'

		// if(bucket_type === "histogram")
		// 	layout.xaxis.dtick = $scope.vis.aggs[1].params.interval

		Plotly.newPlot(gd, total_data, layout, { showLink: false, responsive: true })
       // chartHover.init(viscontainer, gd);

		if (viscontainer && bucket_type) {
			gd.on('plotly_click', function (d) {
				var pts = d.points[0];
				var queryFilter = Private(require('ui/filter_bar/query_filter'));
				var buildQueryFilter = require('ui/filter_manager/lib/query');
				var buildRangeFilter = require('ui/filter_manager/lib/range');
				// console.log("pts", pts, $scope.vis.aggs.bySchemaName['segment'][0].params.field.displayName)
				// console.log(data.slices, pts.i)
				console.log(pts, data)
				var row = type === 'rows' ? pts.data.domain.row : pts.data.domain.column;
				var field = $scope.vis.aggs.bySchemaName['segment'][0].params.field.displayName;

				var rootdata; 
				if(type === "rows"  ||  type === "columns")
					rootdata = data[type][row]
				else
					rootdata = data	

				console.log("AH ",d, rootdata, row, pts)
				
				var raw_d;
				if(pts.i !== undefined) {
					raw_d = total_data[pts.curveNumber].labels[pts.i].toString()//[pts.curveNumber]//.children[pts.i].name;
				} else {
					raw_d = pts.label
				}
				
				console.log("rawd", raw_d, row, pts.curveNumber, pts.i)
				var d = parseInt(raw_d.replace(',', ''))
				var d1;
				var d0 = parseInt(total_data[pts.curveNumber].labels[0].replace(',', ''))
				if(total_data[pts.curveNumber].labels.length <= 1) {
					d1 = d0;
				}else{
					d1 = parseInt(total_data[pts.curveNumber].labels[1].replace(',', ''))
				}
				// var d = raw_d
				

				console.log("yuuuuu", d1, d0, bucket_type, "ok" )
				if (bucket_type === "terms") {
					var match = {};
					match[field] = { 'query': raw_d, 'type': 'phrase' }
					queryFilter.addFilters(buildQueryFilter({ 'match': match }, $scope.vis.indexPattern.id));
				}
				else if (bucket_type === "histogram") {
					var match = {};
					// match[field] = { 'query': pts.v, 'type': 'number' }
					
					var lte;
					console.log(d1, d0, "OKOKOK")
					if(d1 == d0)
						lte = d
					else
						lte = d + (d1 - d0) - 1

					queryFilter.addFilters(buildRangeFilter({ name: field },
						{
							gte: d,
							lte: lte
						},
						$scope.vis.indexPattern));
				} else if (bucket_type === "range") {
					var range = {};
					var filter_values = raw_d.replace(',', '').replace(',', '').split(' to ')
					// console.log(filter_values, raw_d)
					queryFilter.addFilters(buildRangeFilter({ name: field },
						{ gte: filter_values[0], lte: filter_values[1] - 1 },
						$scope.vis.indexPattern));
				}
			});
		}

		new ResizeSensor(viscontainer, function () {
			Plotly.Plots.resize(gd)
		});
	};

	function renderResp(resp) {
		if (!resp) { resp = lastResp; }
		if (resp) {
			var buildChartData = Private(require('plugins/vis_types/vislib/_build_chart_data'));
			this.vis = $scope.vis
			var bcd = _.bind(buildChartData, this, resp)
			console.log("resp", resp)
			var chartData = Promise.resolve(bcd()).then(function (res) {
				data = res
				slices = data.slices
				console.log("res", res)
				$scope.chartGen();
			})
		}
	}
	$scope.$watch('esResponse', renderResp);
});

