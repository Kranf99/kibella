var uiModules = require('ui/modules');
var AggResponseTabifyTabifyProvider = require('ui/agg_response/tabify/tabify');
var errors = require('components/errors'); 

// get the kibana/table_vis module, and make sure that it requires the "kibana" module if it didn't already
var module = uiModules.get('kibana/c3_vis', ['kibana']);
var ResizeSensor = require('css-element-queries/src/ResizeSensor');

// Require Plotly
var Plotly = require('plotly.js/dist/plotly-basic');

function getValuesOfObject(obj) {
  var r = [];

  for(var i in obj)
    r.push(obj[i]);
  
  return r;
}

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};


var default_colors = [
 		'rgb(212, 115, 255)',
         'rgb(118, 93, 224)',
         'rgb(112, 145, 255)', 
         'rgb(142, 216, 243)',
         'rgb(188, 82, 188)',
]

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

	var data = {}
	var slices = []
	var type = ''

	// Identify the div element in the HTML
	var idchart = $element.children().find(".chartc3");
	var message = 'This chart require more than one data point. Try adding an X-Axis Aggregation.';
var gd3 = Plotly.d3.select(idchart[0])
			var gd = gd3.node()
				console.log(Plotly.d3, gd3, gd)

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

		var buckets = []
		var flat_buckets = []


		var i = 0;
		var create_color_object = $scope.$root.label_keys.map(function(chart){
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
		});

		// count bar charts and change bar ratio
		// var the_types = $scope.$root.label_keys.map(function(l) { return data_types[l]; });
		// var chart_count = {};
		// the_types.forEach(function(i){ chart_count[i] = (chart_count[i] || 0)+1; });

		// if (chart_count.bar){

		// 	var my_ratio = 5 / timeseries.length;
		// 	my_ratio = (my_ratio > 0.35) ? my_ratio = 0.3 : my_ratio;

		// 	if (chart_count.bar > 1){
			
		// 		my_ratio = (my_ratio < 0.02) ? my_ratio = 0.02 : my_ratio;
		// 		$scope.$root.activate_grouped = true;
			
		// 	} else {
				
		// 		my_ratio = (my_ratio < 0.01) ? my_ratio = 0.01 : my_ratio;
		// 		$scope.$root.activate_grouped = false;
		// 	}

		// }

		 console.log("mesgrossescouilles",$scope.vis.aggs)
		var bucket_type = $scope.vis.aggs.bySchemaName['segment'][0].type.name;
		console.log("bt",bucket_type)
		// function range_array_to_string(r_arr) {
		// 	return r_arr.map(function(r_obj) { return r_obj.gte + " - " + r_obj.lt })
		// }
		
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
				}, 
			}
		}
		// console.log("ppp",parsed_data)

		var v = []
		for(var i =0; i < buckets.length; i++) {
			v.push(buckets[i].doc_count)
		}

	//	total_data.push({ values: v,/* labels: ['caca', 'kiki', 'cucu'], */  type: 'pie', hole: 0.3 + (i/4), sort: false })

	//	var arrs = []
		var tmp = []
		/*function flat_slices(children) {
			return children.reduce(function(result, child) {	
				result.push(child.size)				//arrs.push(child.size)

			}, [])
		}*/

		// var arrs = [[], []]
		// for(var i=0; i<slices.children.length; i++) {
		// 	arrs[0].push(slices.children[i].size)
		// 	for(var j=0; j<slices.children[i].children.length; j++)
		// 		arrs[1].push(slices.children[i].children[j].size)
		// }
		//console.log("AOOAA", slices)
		//flat_slices(slices.children)
		//console.log(arrs)

		var result = [[]]
		var index = 0;
		function flatten(children, ind) {

			for(var i=0; i<children.length; i++) {
				result[ind].push(children[i].size)
				//if(i === children.length-1)
				if(children[i].children !== undefined) {
					// console.log("uuu")
					if(result[ind+1] === undefined) {
						// console.log("ooo")
						result.push([])
					}
					// console.log(children[i])
					flatten(children[i].children, ind+1)
				}
			}
		}

		function res(res, row_index, type) {
			
			result.map(function(el, indd, aaaa) {
				var set = {
					values: el,
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

				if(type === "rows")
					set.domain.row = row_index
				else
					set.domain.column = row_index
				
				console.log(indd)
				if(indd == 0) {
					if($scope.vis.params.isDonut)
						set.hole = 0.3
			//		set.domain = {'x': [0.15,0.85], 'y': [0.15,0.85]}
				}
				if(indd == 1) {
					set.hole = 0.7
				}
				total_data.push(set)

				

			})


			
		}

		

		if(slices !== undefined) {
			flatten(slices.children, index)
			res(result)
			console.log("connard",result)
			console.log("colorobject", create_color_object)
			
			
		} else if(data.rows !== undefined){
			type = 'rows'
			data.rows.map(function(row, ind) {
				flatten(row.slices.children, 0)
				res(result, ind, type )
			})
		} else if(data.columns !== undefined) {
			type = 'columns'
			data.columns.map(function(row, ind) {
				flatten(row.slices.children, 0)
				res(result, ind, type)
			})
		}
		
		console.log("tota", total_data)


		var viscontainer = idchart[0].parentElement.parentElement;

	// Chart Layout
			var layout = {
				//autosize: true,
				showlegend: $scope.vis.params.addLegend,
				hovermode: $scope.vis.params.addTooltip,
				grid: {rows:1, columns: 1}
			};

			if(type === 'rows')
				layout.grid.rows = total_data.length
			else if(type === 'columns')
				layout.grid.columns = total_data.length
			// if($scope.vis.params.grouped)
			// 	layout.barmode = 'stack'

			// if(bucket_type === "histogram")
			// 	layout.xaxis.dtick = $scope.vis.aggs[1].params.interval

			
	        Plotly.newPlot(gd, total_data, layout, { showLink: false, responsive: true })


         if(viscontainer) {
        	gd.on('plotly_click', function(d){
        	
            var pts = d.points[0];
            var queryFilter = Private(require('ui/filter_bar/query_filter'));
            var buildQueryFilter = require('ui/filter_manager/lib/query');
            var buildRangeFilter = require('ui/filter_manager/lib/range');
            console.log("pts",pts, $scope.vis.aggs.bySchemaName['segment'][0].params.field.displayName)
            if(bucket_type === "terms") {
            	var field = $scope.vis.aggs.bySchemaName['segment'][0].params.field.displayName;
	            var match = {};
	            match[field] = { 'query': pts.v, 'type': 'phrase' }
	            queryFilter.addFilters(buildQueryFilter({ 'match': match }, $scope.vis.indexPattern.id));
        	}
        	else if(bucket_type === "histogram") {
        
        		var field = $scope.vis.aggs.bySchemaName['segment'][0].params.field.displayName;
        		var match = {};
	            match[field] = { 'query': pts.v, 'type': 'number' }
        		//queryFilter.addFilters(buildQueryFilter({ 'match': match }, $scope.vis.indexPattern.id));
	            queryFilter.addFilters(buildRangeFilter({name: field},
                                            {gte: parseInt(data.slices.children[pts.i].name),
                                            lte: parseInt(data.slices.children[pts.i].name) + parseInt(data.slices.children[1].name) - parseInt(data.slices.children[0].name) - 1 },
                                            $scope.vis.indexPattern));
         	} else if(bucket_type === "range") {
        		var field = $scope.vis.aggs.bySchemaName['segment'][0].params.field.displayName;
        		var range = {};
        		 var filter_values = data.slices.children[pts.i].name.split(' to ')
        		 console.log(filter_values, data.slices.children[pts.i].name)
        		queryFilter.addFilters(buildRangeFilter({name: field},
                                            {gte: filter_values[0]   , lte: filter_values[1] - 1 },
                                            $scope.vis.indexPattern));
        	}
          });
        }

		new ResizeSensor(viscontainer, function() {
			Plotly.Plots.resize(gd)
		});
	};


// 	// Get data from ES
// 	$scope.processTableGroups = function (tableGroups) {
// 		console.log(tableGroups)
// 		tableGroups.tables.forEach(function (table) {
// 			table.columns.forEach(function (column, i) {
// 				var data = table.rows;
// 				var tmp = [];

// 				// console.log("cc", column, i)

// 				for (var val in data){
//           			if(data[val][i] || data[val][i] === 0)
// 					  tmp.push(data[val][i]);
// 				}

// // console.log("tmp",tmp)
// 				// if (i > 0){

// 					$scope.$root.label_keys.push(column.title);
// 					chart_labels[column.title] = column.title;
// 					tmp.splice(0, 0, column.title);
// 					parsed_data.push(tmp);
			 
// 				// } else {
			 
// 				// 	x_label = column.title;
// 				// 	x_axis_values.push(tmp);
// 				// }
// 			});
// 		});

// 		$scope.$root.editorParams.label = chart_labels;
// 	};
		

// function convertToPercentage(slices) {
//       (function assignPercentages(slices) {
//         if (slices.sumOfChildren != null) return;

//         var parent = slices;
//         var children = parent.children;
//         var parentPercent = parent.percentOfParent;

//         var sum = parent.sumOfChildren = Math.abs(children.reduce(function (sum, child) {
//           return sum + Math.abs(child.size);
//         }, 0));

//         children.forEach(function (child) {
//           child.percentOfGroup = Math.abs(child.size) / sum;
//           child.percentOfParent = child.percentOfGroup;

//           if (parentPercent != null) {
//             child.percentOfParent *= parentPercent;
//           }

//           if (child.children) {
//             assignPercentages(child);
//           }
//         });
//       }(slices));
//     };

var kiki = Private(require('components/agg_response/hierarchical/build_hierarchical_data'))
console.log(kiki)
console.log(this)
var that = this
	function renderResp(resp){


		if(!resp) { resp = lastResp; }

		if (resp) {
		/*	console.log($scope.vis.aggs)
			if (!$scope.vis.aggs.bySchemaName['buckets']){
				console.log("hey", resp)
				$scope.waiting = message;
				return;
			}
			*/

			
			data = kiki($scope.vis, resp)
			slices = data.slices

			
console.log("kikikiki",slices)

	

console.log("resp", resp)
console.log("data", data)
			// buckets = resp.aggregations[2].buckets
			// console.log("b", buckets)
			// var aa = kiki($scope.vis, resp)
			
			
			$scope.chartGen();
		}

	}
	$scope.$watch('esResponse', renderResp);

});

