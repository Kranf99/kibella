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

module.controller('KbnPieVisController', function ($scope, $element, Private, $location) {
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

		
		function flatten(childrens, ind, arrays) {
			if(typeof arrays.values === "number")
				return;

			// total for percentage calculation
			var total = childrens.reduce(function(acc, child) {
				return acc + child.size
			}, 0)
	
			childrens.map(function(child) {
				arrays.values[ind].push(child.size)
				arrays.names[ind].push(child.name)
				arrays.parents[ind].push(child.parent)
				arrays.percents[ind].push(child.size / total * 100)
				//arrays.real_values[ind].push(child.real_value)

				if (child.children !== undefined) {
					if (arrays.values[ind + 1] === undefined) {
						Object.keys(arrays).map(function(key) {
							arrays[key].push([])
						})
					}
					flatten(child.children, ind+1, arrays)
				}
			})
		}
		function res(arrays, row_index, type) {
			return arrays.values.map(function (values, index) {
				var labels = arrays.names[index].map(function(label, i, arr) {
					var n = arr.slice(0,i).reduce(function(acc, l) {
						return acc + (l === label ? 1 : 0);
					}, 0);

					return label + Array(n).fill(' ').join('');
				});
				var first_tot = arrays.values[0].reduce(function(acc, val) {
					return acc + val;
				}, 0);
				var parents = arrays.parents[index].map(function(parent, i) {
					if(parent !== undefined) {
						delete parent.children
						delete parent.aggConfig
						delete parent.aggConfigResult
						parent.field =  $scope.vis.aggs.bySchemaName['segment'][index-1].params.field.displayName
						parent.percents = arrays.percents[index-1];
						if(parent.parent !== undefined) {
							var siblings = _.uniq(arrays.parents[index].reduce(function(acc, p) {
								return _.isEqual(p.parent, parent.parent) ? acc.concat(p) : acc;
							}, []));
							var tot = siblings.reduce(function(acc, s) {
								return acc + s.size;
							}, 0);
							parent.percent = parent.size / tot * 100;
						} else {
							parent.percent = parent.size / first_tot * 100;
						}
						
						if(index > 0) {
							var addParentPercent = function(par, v) {
								if(par.parent === undefined) {
									return v*(par.percent/100);
								}
								return addParentPercent(par.parent, v*(par.percent/100));
							}
							var percent = addParentPercent(parent, 1);
							parent.real_value = percent;
						}
					}
					return parent
				});

				var corrected_values = values;
				if(index > 0) {
					corrected_values = values.map(function(v, i) {
						return parents[i].real_value*arrays.percents[index][i];
					});
				}
				
				var set = {
					values: corrected_values,
					real_values: values,
					labels: labels,
					parents: parents,
					customdata: values,
					percents: arrays.percents[index],
					ind: index,
					field: $scope.vis.aggs.bySchemaName['segment'][index].params.field.displayName,
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
				else(type === "columns")
					set.domain.column = row_index

				if (index == 0 && $scope.vis.params.isDonut)
					set.hole = 0.3
					//		set.domain = {'x': [0.15,0.85], 'y': [0.15,0.85]}
				else if (index >= 1) {
					set.hole = 0.6 + (1 / arrays.values.length) * 0.6 * (index-1)
				}

				return set
			})
		}

		var arrays = {
			values: [],
			real_values: [],
			names: [],
			parents: [],
			percents: []
		}

		if (slices !== undefined) {
			arrays = {values: [[]], names: [[]], parents: [[]], percents: [[]], real_values: [[]]}
			flatten(slices.children, 0, arrays)
			total_data = res(arrays, 0, 'rows')
		} else {
			if (data.rows !== undefined)
				type = 'rows'
			else type = 'columns'

			data[type].map(function (row, i) {
				Object.keys(arrays).map(function(key) {
					arrays[key].push([])
					arrays[key][i].push([])
				})

				row_arrays = {values: arrays.values[i], names:arrays.names[i], parents:arrays.parents[i], percents:arrays.percents[i], real_values:arrays.real_values[i]}
				flatten(row.slices.children, 0, row_arrays)
				total_data = total_data.concat(res(row_arrays, i, type))
			})
		} 


		var viscontainer = idchart[0].parentElement.parentElement;

		// Chart Layout
		var layout = {
			//autosize: true,
			showlegend: $scope.vis.params.addLegend,
			hovermode: $scope.vis.params.addTooltip,
			grid: { rows: 1, columns: 1 }
		};

		if (type === 'rows')
			layout.grid.rows = arrays.values.length
		else if (type === 'columns')
			layout.grid.columns = arrays.values.length

		Plotly.newPlot(gd, total_data, layout, { showLink: false, showTips: false, responsive: true })
		chartHover.destroy();
		chartHover.init(viscontainer, gd, data, total_data);

		if (viscontainer && bucket_type) {
			var makeLegendItemsGoUp = function(item) {
				var v = item.transform.baseVal.getItem(0).matrix.f - 19;
				item.setAttribute('transform', 'translate(0,'+v+')');
				if(item.nextSibling) {
					return makeLegendItemsGoUp(item.nextSibling);
				}
			}
			
			if($(gd).find('.legend > .scrollbox')[0].getBBox().height < $(gd).find('.legend > .bg')[0].getBBox().height - 10) {
				$(gd).find('.legend')[0].addEventListener('wheel', function(e) {
					$(gd).find('.legend > .scrollbox').attr('transform', 'translate(0, 0)')
				});
			}
			
			//var lastClickTime = 0;
			//var numClicks = 0;
			gd.on('plotly_legendclick', function(d) {
				return false;
				// simulate a click on legend items of the same type, this is currently useless
				/*if(d.event.natural === false) { return; }
				clickTime = (new Date()).getTime();
				if(clickTime - lastClickTime < gd._context.doubleClickDelay) {
					numClicks = 2;
					lastClickTime = 0;
				} else {
					numClicks = 1;
					setTimeout(function() {
						if(numClicks > 1) { numClicks = 1; return; }
						$(gd).find('.groups > .traces').each(function(i) {
							var text = $(this).find('.legendtext').text();
							if(text !== d.label && text.trim() === d.label) {
								var toggle = $(this).find('.legendtoggle')[0];
	
								var down = new MouseEvent("mousedown");
								down.natural = false;
								toggle.dispatchEvent(down);
								gd._legendMouseDownTime = 0;
								var up = new MouseEvent("mouseup");
								up.natural = false;
								toggle.dispatchEvent(up);
							}
						});
					}, gd._context.doubleClickDelay)
				}
				lastClickTime = clickTime;*/
			});

			gd.on('plotly_afterplot', function() {
				$(gd).find('.groups > .traces').each(function(i) {
					if($(this.firstChild).text().slice(-1) === " ") {
						$(this).hide();
						if(this.nextSibling) {
							makeLegendItemsGoUp(this.nextSibling)
						}
					}
				});

				if($(gd).find('.legend > .scrollbox')[0].getBBox().height < $(gd).find('.legend > .bg')[0].getBBox().height - 10) {
					$(gd).find('.legend > .scrollbar').hide();
					$(gd).find('clipPath').hide();
					$(gd).find('.groups > .traces').each(function(i) {
						var t = $(this).attr("transform");
						$(this).attr("transform", t.slice(0,t.indexOf(')')+1));
					});
					$(gd).find('.legend')[0].addEventListener('wheel', function(e) {
						$(gd).find('.legend > .scrollbox').attr('transform', 'translate(0, 0)');
					});

					var event = document.createEvent("HTMLEvents");
					event.initEvent("wheel", true, true);
					event.eventName = "wheel";
					event = _.merge(event, { deltaX:0,deltaY:0 });

					$(gd).find('.legend')[0].dispatchEvent(event);
				}
			});

			gd.on('plotly_click', function (d) {
				var pts = d.points[0];
				var queryFilter = Private(require('ui/filter_bar/query_filter'));
				var buildQueryFilter = require('ui/filter_manager/lib/query');
				var buildRangeFilter = require('ui/filter_manager/lib/range');

				var row = type === 'rows' ? pts.data.domain.row : pts.data.domain.column;
				var field = total_data[pts.curveNumber].field;

				bucket_type = $scope.vis.aggs.bySchemaName['segment'][pts.data.ind].type.name;

				var rootdata; 
				if(type === "rows"  ||  type === "columns")
					rootdata = data[type][row]
				else
					rootdata = data	
					
				var raw_d;
				if(pts.i !== undefined) {
					raw_d = total_data[pts.curveNumber].labels[pts.i].toString()
				} else {
					raw_d = pts.label
				}

				var d = parseInt(raw_d.replace(',', ''))
				var d1;
				var ns = $scope.vis.aggs.length - 1

				var ii = pts.data.ind + 1
				if($scope.vis.aggs[1].__schema.name === "split")
					ii++

				var d0 = $scope.vis.aggs[ii].params.interval

				// if(total_data[pts.curveNumber].labels.length <= 1) {
					// d1 = d0;
				// }else{
					// d1 = parseInt(total_data[pts.curveNumber].labels[1].replace(',', '').split(': ')[1])
				// }
				// var d = raw_d
				
				if (bucket_type === "terms") {
					var match = {};
					match[field] = { 'query': raw_d, 'type': 'phrase' }
					queryFilter.addFilters(buildQueryFilter({ 'match': match }, $scope.vis.indexPattern.id));
				}
				else if (bucket_type === "histogram") {
					var match = {};
					// match[field] = { 'query': pts.v, 'type': 'number' }
					
					var lte;
					
					if(d1 == d0)
						lte = d
					else
						lte = d + (d0) - 1

					queryFilter.addFilters(buildRangeFilter({ name: field },
						{
							gte: d,
							lte: lte
						},
						$scope.vis.indexPattern));
				} else if (bucket_type === "range") {
					var range = {};
					var filter_values = raw_d.replace(',', '').replace(',', '').split(' to ')
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
			this.vis = $scope.vis;
			var bcd = _.bind(buildChartData, this, resp);
			Promise.resolve(bcd()).then(function (res) {
				data = res;
				slices = data.slices;
				$scope.chartGen();
			})
		}
	}
	$scope.$watch('esResponse', renderResp);
});