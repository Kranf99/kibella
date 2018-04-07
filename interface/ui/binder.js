'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _binder = require('utils/binder');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UiBinder = function (_Binder) {
  _inherits(UiBinder, _Binder);

  function UiBinder($scope) {
    _classCallCheck(this, UiBinder);

    // support auto-binding to $scope objects
    var _this = _possibleConstructorReturn(this, (UiBinder.__proto__ || Object.getPrototypeOf(UiBinder)).call(this));

    if ($scope) {
      $scope.$on('$destroy', function () {
        return _this.destroy();
      });
    }
    return _this;
  }

  _createClass(UiBinder, [{
    key: 'jqOn',
    value: function jqOn(el) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var $el = (0, _jquery2.default)(el);
      $el.on.apply($el, args);
      this.disposal.push(function () {
        return $el.off.apply($el, args);
      });
    }
  }, {
    key: 'fakeD3Bind',
    value: function fakeD3Bind(el, event, handler) {
      var _this2 = this;

      this.jqOn(el, event, function (e) {
        // mimick https://github.com/mbostock/d3/blob/3abb00113662463e5c19eb87cd33f6d0ddc23bc0/src/selection/on.js#L87-L94
        var o = _d2.default.event; // Events can be reentrant (e.g., focus).
        _d2.default.event = e;
        try {
          handler.apply(_this2, [_this2.__data__]);
        } finally {
          _d2.default.event = o;
        }
      });
    }
  }]);

  return UiBinder;
}(_binder.Binder);

exports.default = UiBinder;
