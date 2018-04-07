define(function (require) {
    var module = require('ui/modules').get('kibana/kbn_circles_vis', ['kibana']);
    var d3 = require('d3');
    var _ = require('lodash');
    var $ = require('jquery');
    var formatNumber = d3.format(',.0f');
    var randomedColor = {};

    module.controller('KbnCirclesVisController', function ($scope, $element, $rootScope, Private) {

        var circlesAggResponse = Private(require('./lib/agg_response'));

        var svgRoot = $element[0];
        var colors = require('components/vislib/components/color/seed_colors')();
        var getRandomColor = require('components/vislib/components/color/random');
        var margin = 0;
        var div;
        var svg;

        var lastData;

        var r = innerWidth / 4;
        var x = d3.scale.linear().range([0,r]);
        var y = d3.scale.linear().range([0,r]);

        var node, root;

        var pack = d3.layout.pack()
        .size([r, r])
        .value(function (d) { return d.size; });

        var _buildVis = function (data) {
            var width = $(svgRoot).width();
            var height = $(svgRoot).height();
            var colorIndex = -1;

            if (!data.children.length) return;

            div = d3.select(svgRoot);

            svg = div.append('svg')
            .attr('width', '100%')
            .attr('style', 'overflow:hidden')
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + (width - r) / 2 + ',' + (height - r) / 2 + ')')
            .call(d3.behavior.zoom().scaleExtent([-18,18])
            .on("zoom", zoom))
            .append("g");

            node = root = data;

            var nodes = pack.nodes(data);

            svg.selectAll("circle").data(nodes).enter().append("svg:circle").attr("class", function (d) {
                return d.children ? "parent" : "child";
            }).attr("cx", function (d) {
                return d.x;
            }).attr("cy", function (d) {
                return d.y;
            }).attr("r", function (d) {
                return d.r;
            })
            .style("fill", function (d) {
                colorIndex++;

                if(!colors[colorIndex] && !randomedColor[colorIndex])
                  randomedColor[colorIndex] = getRandomColor();
                
                return colors[colorIndex] || randomedColor[colorIndex];
            });
            

            if ($scope.vis.params.showLabels) {
                svg.selectAll("text").data(nodes).enter().append("svg:text").attr("class", function (d) {
                    return d.children ? "parent" : "child";
                }).attr("x", function (d) {
                    return d.x;
                }).attr("y", function (d) {
                    return d.y;
                }).attr("dy", function (d) {
                    return d.children ? ".35em" : "-0.35em";
                }).attr("text-anchor", "middle").style("opacity", function (d) {
                    return d.r > 20 ? 1 : .5;
                }).text(function (d) {
                    return d.name == "flare" ? "" : d.name;
                });
            }

            if ($scope.vis.params.showValues) {
                svg.selectAll("text.value").data(nodes).enter().append("svg:text").attr("class", function (d) {
                    return "value";
                }).attr("x", function (d) {
                    return d.x;
                }).attr("y", function (d) {
                    return (d.y + 15);
                }).attr("dy", function (d) {
                    return d.children ? ".35em" : "-0.35em";
                }).attr("text-anchor", "middle").style("opacity", function (d) {
                    return d.r > 20 ? 1 : .5;
                }).text(function (d) {
                    return d.name == "flare" ? "" : d.value;
                });
            }

            if ($scope.vis.params.enableZoom) {
                d3.select(window).on("click", function() { zoom(root); });
            }

        };

        function zoom() {
            if ($scope.vis.params.enableZoom) {
                svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }
        }

        var _render = function (data) {
            d3.select(svgRoot).selectAll('svg').remove();
            _buildVis(data.children);
        };

        $scope.$watch('esResponse', function (resp) {
            if (resp) {
                var chartData = circlesAggResponse($scope.vis, resp);
                lastData = chartData;
                _render(chartData);
            }
        });
    });
});
