'use strict';

var _ = require('lodash');
var _module = require('ui/modules').get('kibana');

define(function (require) {
  require('plugins/enhanced_tilemap/directives/wmsOverlay');

  _module.directive('wmsOverlays', function (Private) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        layers: '='
      },
      template: require('./wmsOverlays.html'),
      link: function link(scope, element, attrs) {
        scope.addLayer = function () {
          if (!scope.layers) scope.layers = [];
          scope.layers.push({});
        };
        scope.removeLayer = function (layerIndex) {
          scope.layers.splice(layerIndex, 1);
        };
      }
    };
  });
});