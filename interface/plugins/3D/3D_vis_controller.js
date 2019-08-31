var uiModules = require('ui/modules');
var AggResponseTabifyTabifyProvider = require('ui/agg_response/tabify/tabify');
var errors = require('components/errors'); 

// get the kibana/table_vis module, and make sure that it requires the "kibana" module if it didn't already
var module = uiModules.get('kibana/3D_vis', ['kibana']);
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

module.controller('3DVisController', function($scope, $element, Private, $location){
function getrandom(num , mul) 
	{
   var value = [ ];
   for(i=0;i<=num;i++)
   {
    var rand = Math.random() * mul;
    value.push(rand);
   }
   return value;
  }


var data=[
    {
     opacity:0.4,
     type: 'scatter3d',
     x: getrandom(50 , -75),
     y: getrandom(50 , -75),
     z: getrandom(50 , -75),
    },
    {
     opacity:0.5,
     type: 'scatter3d',
     x: getrandom(50 , -75),
     y: getrandom(50 , 75),
     z: getrandom(50 , 75),
    },
  	{
     opacity:0.5,
     type: 'scatter3d',
     x: getrandom(50 , 100),
     y: getrandom(50 , 100),
     z: getrandom(50 , 100),
    }
];
var layout = {
  scene:{
	 aspectmode: "manual",
   aspectratio: {
     x: 1, y: 0.7, z: 1,
    },
   xaxis: {
    nticks: 9,
    range: [-200, 100],
  },
   yaxis: {
    nticks: 7,
    range: [-100, 100],
  },
   zaxis: {
   nticks: 10,
   range: [-150, 100],
  }},
};


var viscontainer = idchart[0].parentElement.parentElement;

var gd3 = Plotly.d3.select(idchart[0])
		var gd = gd3.node()
		$scope.chart = null
        $scope.chart = Plotly.newPlot(gd, total_data, layout, { showLink: false, responsive: true })
  
});

