var colors = require('components/colors/colors.js');
var uiModules = require('ui/modules');
var template = require('text!components/colors/colors.html');
var module = uiModules.get('kibana/c3_vis', ['kibana']);


module.directive('colorselector', function() {
    return {
      restrict: 'E',
      scope: {
        params: '=params'
      },
      template: template,
    };
  });