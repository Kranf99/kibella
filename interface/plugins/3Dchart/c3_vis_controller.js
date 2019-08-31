var uiModules = require('ui/modules');
var AggResponseTabifyTabifyProvider = require('ui/agg_response/tabify/tabify');
var errors = require('components/errors'); 

// get the kibana/table_vis module, and make sure that it requires the "kibana" module if it didn't already
var module = uiModules.get('kibana/c3_vis', ['kibana']);
var ResizeSensor = require('css-element-queries/src/ResizeSensor');

// Require Plotly
var Plotly = require('plotly.js/dist/plotly-gl3d');

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

var idchart = $element.children().find(".chartc3");
var viscontainer = idchart[0].parentElement.parentElement;
var tabifyAggResponse = Private(AggResponseTabifyTabifyProvider);
var x_axis_values = [];
var timeseries = [];
var parsed_data = [];
var chart_labels = {};
var x_label = "";
var time_format = "";
var lastResp = undefined;

var rootElement = $element;
var graph = null;
var width;
var height;
//var data = new vis3D.DataSet();
var data = {};
var margin = {
	top: 10,
	right: 10,
	bottom: 10,
	left: 10
};


$scope.$watch('esResponse', function (resp) {
    console.log("resp")
    if (resp) {
      const vis = $scope.vis;
      var counter = 0;

      width = $($element).width() - margin.left - margin.right;
      height = $($element).height() - margin.top - margin.bottom;

      var x = 0;
      var y = 0;
      var z = 0;
      var cols = 0;
      var rows = 0;

     // $scope.processTableGroups(tabifyAggResponse($scope.vis, resp));
 
      //data = new vis3D.DataSet();
      var data = []
      var x_values = []
      var y_values = []
      var z_values = []

      //console.log(resp)

      // Initialize a 100*100 Array
      var data = Array(100).fill(Array(100).fill(0))

     // Go from Elasticsearch resp object to vis.js Dataset
      _.map(resp.aggregations, function (xElementRoot) {
      //	console.log("xEr", xElementRoot)
        if (xElementRoot !== null) {


          _.map(xElementRoot.buckets, function (xElement) {
          	console.log("xEr", xElement)
            if (xElement !== null) {
              x = parseInt(xElement.key);

              cols++;
              _.map(xElement[3].buckets, function (yElementBucket) {

                y = parseInt(yElementBucket.key);
                rows++;

                if (yElementBucket.hasOwnProperty('1')) {
                  z = parseInt(yElementBucket[1].value);
                } else {
                  z = yElementBucket.doc_count;
                }

              //  console.log("hey", yElementBucket.key)

               // console.log(counter++, x, parseInt(yElementBucket.key), z)
               /** data.push({
                  id: counter++,
                  x: x,
                  y: parseInt(yElementBucket.key),
                  z: z,
                  style: z
                });
*/
				counter++

				data[cols][rows] = z

                x_values.push(x)
                y_values.push(parseInt(yElementBucket.key))
                z_values.push(z)
              });
            }
          });
        }
      });

      console.log(x_values.length,y_values.length,z_values.length)

      // Set Graphics Type
      let graphType = 'surface' //vis.params.graphSelect !== null ? vis.params.graphSelect.id : 'surface';

      // specify options
      var options = {
      //  width: width + 'px',
       // height: height + 'px',
       // style: graphType,
       // xBarWidth: 5,
       // yBarWidth: 5,
       // showPerspective: vis.params.showPerspective,
       // showGrid: vis.params.showGrid,
       // showShadow: vis.params.showShadow,
        //keepAspectRatio: vis.params.keepAspectRatio,
       // verticalRatio: 0.5,
       // xLabel: vis.params.xLabel !== null ? vis.params.xLabel : 'X',
      //  yLabel: vis.params.yLabel !== null ? vis.params.yLabel : 'Y',
      //  zLabel: vis.params.zLabel !== null ? vis.params.zLabel : 'Z',
       // legendLabel: 'This is a legend'
      };

		function getrandom(num , mul) {
			var value = [ ];
			for(i=0;i<=num;i++)
			{
			 var rand = Math.random() * mul;
			 value.push(rand);
			}
			return value;}


		  }



    var trace1 = {
		type:'surface',
	//	x: x_values, y: y_values, z: z_values,
		//color: 'pink',
		z: data
	};

	console.log(data)


	var layout = {
		scene: {
			xaxis:{title: 'X AXIS TITLE'},
			yaxis:{title: 'Y AXIS TITLE'},
			zaxis:{title: 'Z AXIS TITLE'},
			},
		autosize: false,
	
		margin: {
		 l: 0,
		 r: 0,
		 b: 50,
		 t: 50,
		 pad: 4
		},
	};


      // Instantiate our graph object.
      if (data !== null && data.length > 0) {
       // graph = new vis3D.Graph3d($element[0], data, options);

        var gd3 = Plotly.d3.select(idchart[0])
		var gd = gd3.node()
		$scope.chart = null
		$scope.chart = Plotly.newPlot(gd, [trace1], layout, { showLink: false, responsive: true, showSendToCloud: true })

		new ResizeSensor(viscontainer, function() {
			Plotly.Plots.resize(gd)
		});
      }

    });

/*

$scope.chartGen = function(){
	var data_colors = {};
	var data_types = {};
	var i = 0;
	var create_color_object = $scope.$root.label_keys.map(function(chart){
		data_colors[chart] = 'rgb(212, 115, 255)';
		data_types[chart] = 'bar';		
	});

	var bucket_type = $scope.vis.aggs.bySchemaName['buckets'][0].type.name;

var total_data = []
		var p_data = parsed_data

		function gen_data(x, y, type, text, name, color) {
			return {
				x: x,
				y: y,
				type: type,
				text: text,
				textposition: "top center",
				name: name,
				//yaxis: rightY ? "y2" : "y1",
				marker: {
					color: color,
			  		size: 6,
				}, 
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

			//var tot = gen_data(x_v, p_data[i], data_types[n], p_data[i], n, $scope.vis.params["color" + (i+1)], $scope.vis.params["rightY" + (i+1)])
			var tot = gen_data(x_v, p_data[i], data_types[n], p_data[i], n, "#000")
			total_data.push(tot)
		})



}
*/


/*p_data[i] = p_data[i]//.slice(1)
var z_values = p_data[i]
console.log("z", z_values)*/

//var y_values

/*




  	// Get data from ES
	$scope.processTableGroups = function (tableGroups) {
		tableGroups.tables.forEach(function (table) {
			console.log(table)
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

		//console.log($scope.$root)
		//$scope.$root.editorParams.label = chart_labels;
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
	//$scope.$watch('esResponse', renderResp);

*/

})

