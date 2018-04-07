'use strict';

L.Control.MeasureScale = L.Control.Scale.extend({
  _addScales: function _addScales(options, className, container) {
    L.Control.Scale.prototype._addScales.call(this, options, className, container);

    this._container = container;
    var self = this;
    L.DomEvent.on(this._container, 'click', function (e) {
      self.startMeasure();
    });
  },
  onRemove: function onRemove(map) {
    L.Control.Scale.prototype.onRemove.call(this, map);
    L.DomEvent.off(this._container, 'click');
  },
  initMeasure: function initMeasure() {
    var options = {
      error: '<strong>Error:</strong> shape edges cannot cross!',
      tooltip: {
        start: 'Click to start drawing line.',
        cont: 'Click to continue drawing line.',
        end: 'Click last point to finish line.'
      }
    };
    this.polyline = new L.Draw.Polyline(this._map, options);
  },
  startMeasure: function startMeasure() {
    if (!this.polyline) this.initMeasure();
    this.polyline.enable();
  }
});

L.control.measureScale = function (options) {
  return new L.Control.MeasureScale(options);
};