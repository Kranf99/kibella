'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

module.exports = function (kibana) {
  return new kibana.Plugin({
    name: 'extended_metric_vis',
    require: ['kibana', 'elasticsearch'],
    uiExports: {
      visTypes: ['plugins/extended_metric_vis/extended_metric_vis']
    }

  });
};

