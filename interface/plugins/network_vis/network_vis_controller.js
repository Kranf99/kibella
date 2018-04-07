define(function (require) {
  // get the kibana/table_vis module, and make sure that it requires the "kibana" module if it
  // didn't already
  var module = require('ui/modules').get('kibana/network_vis', ['kibana']);

  //import the npm modules
  var visN = require('vis');
  var randomColor = require('randomcolor');
  var ElementQueries = require('css-element-queries/src/ElementQueries');
  var ResizeSensor = require('css-element-queries/src/ResizeSensor');


  // add a controller to tha module, which will transform the esResponse into a
  // tabular format that we can pass to the table directive
	module.directive('networkVis', function() {
		return {
			restrict: 'E',
			replace: true,
			template: function() {
		  	var id = Math.floor(Math.random() * 10000);
				
				return '<div ng-controller="KbnNetworkVisController" ng-init="getId(' + id + ')"class="network-vis" id="' + id + '" ng-style="{\'background-color\':vis.params.canvasBackgroundColor}"></div>';
			}
		}
	});
  
	module.controller('KbnNetworkVisController', function ($scope, $sce, Private) {
		var lastResp;

		$scope.getId = function(id) {
			$scope.id = id;
		}

    $scope.errorNodeColor = function(){
      $($scope.id).hide();
      $("#loading").hide();
      $("#errorHtml").html("<h1><strong>ERROR</strong>: Node Color must be the LAST selection</h1>");
      $("#errorHtml").show();

    }

    $scope.errorNodeNodeRelation = function(){
      $($scope.id).hide();
      $("#loading").hide();
      $("#errorHtml").html("<h1><strong>ERROR</strong>: You can only choose Node-Node or Node-Relation</h1>");
      $("#errorHtml").show();
    }

    $scope.initialShows = function(){
      $($scope.id).show();
      $("#loading").show();
      $("#errorHtml").hide();
    }

    $scope.startDynamicResize = function(network){
      for (var i = 0; i < $("visualize").length; i++) {
         if($("visualize")[i].children[1].children[1] && $("visualize")[i].children[1].children[1].id == $scope.id){
           var viscontainer = $("visualize")[i];
           break;
         }
      };
      new ResizeSensor(viscontainer, function() {
				network.renderer._requestRedraw();
        network.setSize('100%', viscontainer.children[1].clientHeight);
      });
    }

    $scope.drawColorLegend = function(usedColors, colorDicc){
       var canvas = document.getElementsByTagName("canvas")[0];
       var context = canvas.getContext("2d");

       context.fillStyle="#FFE8D6";
       var totalheight = usedColors.length * 25
       context.fillRect(canvas.width*(-2)-10, canvas.height*(-2)-18, 350, totalheight);

       context.fillStyle = "black";
       context.font = "bold 30px Arial";
       context.textAlign = "start";
       context.fillText("LEGEND OF COLORS:", canvas.width*(-2), canvas.height*(-2));

       var p=canvas.height*(-2) + 40;
       for(var key in colorDicc){
         context.fillStyle = colorDicc[key];
         context.font = "bold 20px Arial";
         context.fillText(key, canvas.width*(-2), p);
         p = p +22;
       }
    }
		
   	$scope.$watchMulti(['esResponse', 'vis.params'], function (resp) {
			lastResp = resp;
	 		render(resp);
	 	});
		
		function render(resp) {
      if (resp && resp[0]) {
        $("#loading").hide();
        if($scope.vis.aggs.bySchemaName['first'].length >= 1 && !$scope.vis.aggs.bySchemaName['second']){ //This is when we have 2 nodes
            $scope.initialShows();
            $(".secondNode").show();
            // Retrieve the id of the configured tags aggregation
            var firstFieldAggId = $scope.vis.aggs.bySchemaName['first'][0].id;
            if($scope.vis.aggs.bySchemaName['first'].length > 1){
              var secondFieldAggId = $scope.vis.aggs.bySchemaName['first'][1].id;
            }

            if($scope.vis.aggs.bySchemaName['colornode']){
              var colorNodeAggId = $scope.vis.aggs.bySchemaName['colornode'][0].id;
              var colorNodeAggName = $scope.vis.aggs.bySchemaName['colornode'][0].params.field.displayName;
              var colorDicc = {};
              var usedColors = [];
            }

            //Names of the terms that have been selected
            var firstFieldAggName = $scope.vis.aggs.bySchemaName['first'][0].params.field.displayName;
            if($scope.vis.aggs.bySchemaName['first'].length > 1){
              var secondFieldAggName = $scope.vis.aggs.bySchemaName['first'][1].params.field.displayName;
            }

            // Retrieve the metrics aggregation configured
            if($scope.vis.aggs.bySchemaName['size_node']){
              var metricsAgg_sizeNode = $scope.vis.aggs.bySchemaName['size_node'][0];
            }
            if($scope.vis.aggs.bySchemaName['size_edge']){
              var metricsAgg_sizeEdge = $scope.vis.aggs.bySchemaName['size_edge'][0];
            }
						
            // Get the buckets of that aggregation
            var buckets = resp[0].aggregations[firstFieldAggId].buckets;

            //////////////////////////////////////////////////DATA PARSED AND BULDING NODES//////////////////////////////////////////////////////////
            var dataParsed = [];
            // Iterate the buckets
            var i = 0;
            var dataNodes = buckets.map(function(bucket) {

              dataParsed[i] = {};
              dataParsed[i].keyFirstNode = bucket.key;


              //Metrics are for the sizes
              if(metricsAgg_sizeNode){
                // Use the getValue function of the aggregation to get the value of a bucket
                var value = metricsAgg_sizeNode.getValue(bucket);
                var sizeVal = Math.min($scope.vis.params.maxCutMetricSizeNode, value);

                //No show nodes under the value
                if($scope.vis.params.minCutMetricSizeNode > value){
                  dataParsed.splice(i, 1);
                  return;
                }
              }else{
                var sizeVal = 20;
              }

              dataParsed[i].valorSizeNode = sizeVal;
              dataParsed[i].nodeColorValue = "default";
              dataParsed[i].nodeColorKey = "default";


              //Iterate subbucket and choose the edge size
              if($scope.vis.aggs.bySchemaName['first'].length > 1){
                dataParsed[i].relationWithSecondNode = bucket[secondFieldAggId].buckets.map(function(buck) {
                  if(metricsAgg_sizeEdge){
                    var value_sizeEdge = metricsAgg_sizeEdge.getValue(buck);
                    var sizeEdgeVal = Math.min($scope.vis.params.maxCutMetricSizeEdge, value_sizeEdge);
                  }else{
                    var sizeEdgeVal = 0.1;
                  }

                  //Get the color of the node, save in the diccionary
                  if(colorNodeAggId && buck[colorNodeAggId].buckets.length > 0){
                    if(colorDicc[buck[colorNodeAggId].buckets[0].key]){
                      dataParsed[i].nodeColorKey = buck[colorNodeAggId].buckets[0].key;
                      dataParsed[i].nodeColorValue = colorDicc[buck[colorNodeAggId].buckets[0].key];
                    }else{
                      //repeat to find a NO-REPEATED color
                      while(true){
                        var confirmColor = randomColor();
                        if(usedColors.indexOf(confirmColor) == -1){
                          colorDicc[buck[colorNodeAggId].buckets[0].key] = confirmColor;
                          dataParsed[i].nodeColorKey = buck[colorNodeAggId].buckets[0].key;
                          dataParsed[i].nodeColorValue = colorDicc[buck[colorNodeAggId].buckets[0].key];
                          usedColors.push(confirmColor);
                          break;
                        }
                      }

                    }
                  }

                  return {
                    keySecondNode: buck.key,
                    countMetric: buck.doc_count,
                    widthOfEdge: sizeEdgeVal
                  };
                });
              }

              //assing color and the content of the popup
              var inPopup = "<p>" + bucket.key + "</p>"
              if(dataParsed[i].nodeColorValue != "default"){
                var colorNodeFinal = dataParsed[i].nodeColorValue;
                inPopup += "<p>" + dataParsed[i].nodeColorKey + "</p>";
              }else{
                var colorNodeFinal = $scope.vis.params.firstNodeColor;
              }

              i++;
              //Return the node totally builded
              var nodeReturn = {
                id: i,
                key: bucket.key,
                color: colorNodeFinal,
                shape: $scope.vis.params.shapeFirstNode,
                //size: sizeVal
                value: sizeVal
              }

              //If activated, show the labels
              if($scope.vis.params.showLabels){
                nodeReturn.label = bucket.key;
              }

              //If activated, show the popups
              if($scope.vis.params.showPopup){
                nodeReturn.title = inPopup;
              }

              return nodeReturn;
            });
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////

            //////////////////////////////////////////////////BULDING EDGES//////////////////////////////////////////////////////////
            //Clean "undefinded" in the array
            dataNodes = dataNodes.filter(Boolean);
            var dataEdges = [];
            for(var n = 0; n<dataParsed.length; n++){
              //Find in the array the node with the keyFirstNode
              var result = $.grep(dataNodes, function(e){ return e.key == dataParsed[n].keyFirstNode;   });
              if (result.length == 0) {
                console.log("Error: Node not finded");
              } else if (result.length == 1) {
                //Finded the node, access to its id
                if($scope.vis.aggs.bySchemaName['first'].length > 1){
                  for(var r = 0; r<dataParsed[n].relationWithSecondNode.length; r++){
                    //Find in the relations the second node to relate
                    var nodeOfSecondType = $.grep(dataNodes, function(e){ return e.key == dataParsed[n].relationWithSecondNode[r].keySecondNode;   });
                    if (nodeOfSecondType.length == 0) {
                      //Not finded, added to the DataNodes - node of type 2
                      i++;
                      var newNode = {
                        id : i,
                        key: dataParsed[n].relationWithSecondNode[r].keySecondNode,
                        label : dataParsed[n].relationWithSecondNode[r].keySecondNode,
                        color: $scope.vis.params.secondNodeColor,
                        shape: $scope.vis.params.shapeSecondNode
                      };
                      //Add new node
                      dataNodes.push(newNode);
                      //And create the relation (edge)
                      var edge = {
                        from : result[0].id,
                        to : dataNodes[dataNodes.length-1].id,
                        value: dataParsed[n].relationWithSecondNode[r].widthOfEdge
                      }
                      dataEdges.push(edge);

                    } else if (nodeOfSecondType.length == 1) {
                      //Exist the node, create only the edge
                      var enlace = {
                        from : result[0].id,
                        to : nodeOfSecondType[0].id,
                        value: dataParsed[n].relationWithSecondNode[r].widthOfEdge
                      }
                      dataEdges.push(enlace);
                    } else {
                      console.log("Error: Multiples nodes with same id finded");
                    }
                  }
                }
              } else {
                console.log("Error: Multiples nodes with same id finded");
              }
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////


            ////////////////////////////////////Creation the network with the library//////////////////////////////////
            var nodesDataSet = new visN.DataSet(dataNodes);
            var edgesDataSet = new visN.DataSet(dataEdges);

            var container = document.getElementById($scope.id);
            container.style.height = container.parentElement.getBoundingClientRect().height;
            container.height = container.parentElement.getBoundingClientRect().height;

            var data = {
              nodes: nodesDataSet,
              edges: edgesDataSet
            };
            //If it is too much edges, chnage the options to better optimization
            var options = {height: container.parentElement.getBoundingClientRect().height.toString()};
            if(dataEdges.length > 200){
              var options = {
                height: container.parentElement.getBoundingClientRect().height.toString(),
                physics:{
                  barnesHut:{
                    gravitationalConstant: -35000,
                    springConstant:0.01
                  }
                },
                "edges": {
                  "smooth": {
                    "forceDirection": "none",
                    "type": "continuous"
                  },
                  scaling:{
                    min:$scope.vis.params.minEdgeSize,
                    max:$scope.vis.params.maxEdgeSize
                  }
                },
                nodes: {
                  scaling:{
                    min:$scope.vis.params.minNodeSize,
                    max:$scope.vis.params.maxNodeSize
                  }
                },
                layout: {
                  improvedLayout: false
                },
                interaction: {
                  hover: true
                }
              };
            }
            console.log("Create network now");
            var network = new visN.Network(container, data, options);

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////

            $scope.startDynamicResize(network);

            network.on("afterDrawing", function (canvasP) {
              $("#loading").hide();
              /// Draw the color legend if Node Color is activated
              if($scope.vis.aggs.bySchemaName['colornode'] && $scope.vis.params.showColorLegend){
                $scope.drawColorLegend(usedColors, colorDicc);
              }
            });

        }else if($scope.vis.aggs.bySchemaName['first'].length == 1 && $scope.vis.aggs.bySchemaName['second']){ //Node-Relation
          $scope.initialShows();
          $(".secondNode").hide();
           // Retrieve the id of the configured tags aggregation
          var firstFieldAggId = $scope.vis.aggs.bySchemaName['first'][0].id;
          var secondFieldAggId = $scope.vis.aggs.bySchemaName['second'][0].id;

          if($scope.vis.aggs.bySchemaName['colornode']){
            var colorNodeAggId = $scope.vis.aggs.bySchemaName['colornode'][0].id;
            var colorNodeAggName = $scope.vis.aggs.bySchemaName['colornode'][0].params.field.displayName;
            var colorDicc = {};
            var usedColors = [];

            //Check if "Node Color" is the last selection
            if($scope.vis.aggs.indexOf($scope.vis.aggs.bySchemaName['colornode'][0]) <= $scope.vis.aggs.indexOf($scope.vis.aggs.bySchemaName['second'][0])){
              $scope.errorNodeColor();
              return;
            }
          }

          //Names of the terms that have been selected
          var firstFieldAggName = $scope.vis.aggs.bySchemaName['first'][0].params.field.displayName;
          var secondFieldAggName = $scope.vis.aggs.bySchemaName['second'][0].params.field.displayName;

          // Retrieve the metrics aggregation configured
          if($scope.vis.aggs.bySchemaName['size_node']){
            var metricsAgg_sizeNode = $scope.vis.aggs.bySchemaName['size_node'][0];
          }
          if($scope.vis.aggs.bySchemaName['size_edge']){
            var metricsAgg_sizeEdge = $scope.vis.aggs.bySchemaName['size_edge'][0];
          }

          // Get the buckets of that aggregation
          if(resp[0].aggregations[firstFieldAggId]){
            var buckets = resp[0].aggregations[firstFieldAggId].buckets;
          }else{
            var buckets = resp[0].aggregations[secondFieldAggId].buckets;
          }

          //////////////////////////////////////////////////DATA PARSED AND BULDING NODES//////////////////////////////////////////////////////////
          var dataParsed = [];
          // Iterate the buckets
          var i = 0;
          var dataNodes = buckets.map(function(bucket) {

            dataParsed[i] = {};
            dataParsed[i].keyNode = bucket.key;

            //Metrics are for the sizes
            if(metricsAgg_sizeNode){
              // Use the getValue function of the aggregation to get the value of a bucket
              var value = metricsAgg_sizeNode.getValue(bucket);
              var sizeVal = Math.min($scope.vis.params.maxCutMetricSizeNode, value);

              //No show nodes under the value
              if($scope.vis.params.minCutMetricSizeNode > value){
                dataParsed.splice(i, 1);
                return;
              }
            }else{
              var sizeVal = 20;
            }

            dataParsed[i].valorSizeNode = sizeVal;
            dataParsed[i].nodeColorValue = "default";
            dataParsed[i].nodeColorKey = "default";


            //It depends of the priority of the selection to obtain the buckets
            if(bucket[secondFieldAggId]){
              var orderId = secondFieldAggId;
            }else{
              var orderId = firstFieldAggId;
            }

            dataParsed[i].relationWithSecondField = bucket[orderId].buckets.map(function(buck) {
              if(metricsAgg_sizeEdge){
                var value_sizeEdge = metricsAgg_sizeEdge.getValue(buck);
                var sizeEdgeVal = Math.min($scope.vis.params.maxCutMetricSizeEdge, value_sizeEdge);
              }else{
                var sizeEdgeVal = 0.1;
              }

              //Get the color of the node, save in the diccionary
              if(colorNodeAggId && buck[colorNodeAggId].buckets.length > 0){
                if(colorDicc[buck[colorNodeAggId].buckets[0].key]){
                  dataParsed[i].nodeColorKey = buck[colorNodeAggId].buckets[0].key;
                  dataParsed[i].nodeColorValue = colorDicc[buck[colorNodeAggId].buckets[0].key];
                }else{
                  while(true){
                    var confirmColor = randomColor();
                    if(usedColors.indexOf(confirmColor) == -1){
                      colorDicc[buck[colorNodeAggId].buckets[0].key] = confirmColor;
                      dataParsed[i].nodeColorValue = colorDicc[buck[colorNodeAggId].buckets[0].key];
                      usedColors.push(confirmColor);
                      break;
                    }
                  }

                }
              }

              return {
                keyRelation: buck.key,
                countMetric: buck.doc_count,
                widthOfEdge: sizeEdgeVal
              };
            });

            var inPopup = "<p>" + bucket.key + "</p>"
            if(dataParsed[i].nodeColorValue != "default"){
              var colorNodeFinal = dataParsed[i].nodeColorValue;
              inPopup += "<p>" + dataParsed[i].nodeColorKey + "</p>";
            }else{
              var colorNodeFinal = $scope.vis.params.firstNodeColor;
            }

            i++;
            //Return the node totally builded
            var nodeReturn = {
              id: i,
              key: bucket.key,
              color: colorNodeFinal,
              shape: $scope.vis.params.shapeFirstNode,
              //size: sizeVal
              value: sizeVal
            }

            //If activated, show the labels
            if($scope.vis.params.showLabels){
              nodeReturn.label = bucket.key;
            }

            //If activated, show the popus
            if($scope.vis.params.showPopup){
              nodeReturn.title = inPopup;
            }

            return nodeReturn;
          });
          //////////////////////////////////////////////////////////////////////////////////////////////////////////////

          //////////////////////////////////////////////////BULDING EDGES//////////////////////////////////////////////////////////
          //Clean "undefinded" in the array
          dataNodes = dataNodes.filter(Boolean);
          var dataEdges = [];

          //Iterate parsed nodes
          for(var n = 0; n<dataParsed.length; n++){
            //Obtain id of the node
            var NodoFrom = $.grep(dataNodes, function(e){ return e.key == dataParsed[n].keyNode;   });
            if (NodoFrom.length == 0) {
              console.log("Error: Node not finded");
            } else if (NodoFrom.length == 1) {
              var id_from = NodoFrom[0].id;
              //Iterate relations that have with the second field selected
              for(var p = 0; p<dataParsed[n].relationWithSecondField.length; p++){
                //Iterate again the nodes
                for(var z = 0; z<dataParsed.length; z++){
                  //Check that we dont compare the same node
                  if(dataParsed[n] != dataParsed[z]){
                      var NodoTo = $.grep(dataNodes, function(e){ return e.key == dataParsed[z].keyNode;   });
                      if (NodoTo.length == 0) {
                        console.log("Error: Node not finded");
                      } else if (NodoTo.length == 1) {
                        var id_to = NodoTo[0].id;
                        //Have relation?
                        var sameRelation = $.grep(dataParsed[z].relationWithSecondField, function(e){ return e.keyRelation == dataParsed[n].relationWithSecondField[p].keyRelation;   });
                        if (sameRelation.length == 1) {
                          //Have relation the nodes, create the edge
                          var edgeExist = $.grep(dataEdges, function(e){ return (e.to == id_from && e.from == id_to) || (e.to == id_to && e.from == id_from);   });
                          if (edgeExist.length == 0) {
                            //The size of the edge is the total of the common
                            var sizeEdgeTotal = sameRelation[0].widthOfEdge + dataParsed[n].relationWithSecondField[p].widthOfEdge;
                            var edge = {
                              from : id_from,
                              to : id_to,
                              value: sizeEdgeTotal
                            };
                            dataEdges.push(edge);
                          }
                        }
                      } else {
                        console.log("Error: Multiples nodes with same id finded");
                      }
                  }
                }
              }

            } else {
              console.log("Error: Multiples nodes with same id finded");
            }
          }

          //////////////////////////////////////////////////////////////////////////////////////////////////////////////

          ////////////////////////////////////Creation the network with the library//////////////////////////////////
          var nodesDataSet = new visN.DataSet(dataNodes);
          var edgesDataSet = new visN.DataSet(dataEdges);

          // Creation of the network
          var container = document.getElementById($scope.id);
          //Set the Heigth
          container.style.height = container.getBoundingClientRect().height;
          container.height = container.getBoundingClientRect().height;
          //Set the Data
          var data = {
            nodes: nodesDataSet,
            edges: edgesDataSet
          };
          //Set the Options
          var options = {
            height: container.getBoundingClientRect().height.toString(),
            physics: {
              barnesHut: {
                gravitationalConstant: -3500,
                springConstant: 0.001,
                springLength: 500
              }
            },
            "edges": {
              "smooth": {
                "type": "continuous"
              },
              scaling:{
                min:$scope.vis.params.minEdgeSize,
                max:$scope.vis.params.maxEdgeSize
              }
            },
            interaction: {
              hideEdgesOnDrag: true,
              hover: true
            },
            nodes: {
              scaling:{
                min:$scope.vis.params.minNodeSize,
                max:$scope.vis.params.maxNodeSize
              }
            },
            layout: {
              improvedLayout: false
            }
          }
          console.log("Create network now");
          var network = new visN.Network(container, data, options);
          //////////////////////////////////////////////////////////////////////////////////////////////////////////////

          $scope.startDynamicResize(network);

          network.on("afterDrawing", function (canvasP) {
            $("#loading").hide();
            /// Draw the color legend if Node Color is activated
            if($scope.vis.aggs.bySchemaName['colornode'] && $scope.vis.params.showColorLegend){
              $scope.drawColorLegend(usedColors, colorDicc);
            }
          });

        }else{
          $scope.errorNodeNodeRelation();
        }
      }

    }
  });

});
