'use strict';

var _ = require('lodash');
var _module = require('ui/modules').get('kibana');

define(function (require) {
  _module.directive('wmsOverlay', function (Private) {

    return {
      restrict: 'E',
      replace: true,
      scope: {
        layer: '='
      },
      template: require('./wmsOverlay.html'),
      link: function link(scope, element, attrs) {}
    };
  });
});