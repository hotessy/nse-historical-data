"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHistoricalData = exports.Options = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var getHistoricalData = exports.getHistoricalData = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(indexName, dateRange, metrics) {
    var options, data, json;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            options = new Options(indexName, dateRange, metrics).requestObject;
            _context.prev = 1;
            _context.next = 4;
            return (0, _requestPromise2.default)(options);

          case 4:
            data = _context.sent;
            json = _tabletojson2.default.convert(data)[0];

            json.splice(-1, 1);
            return _context.abrupt("return", Promise.resolve(json));

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](1);
            return _context.abrupt("return", Promise.reject(_context.t0));

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 10]]);
  }));

  return function getHistoricalData(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.indexNameChecker = indexNameChecker;
exports.dateRangeChecker = dateRangeChecker;
exports.metricsChecker = metricsChecker;

var _lodash = require("lodash");

var _momentTimezone = require("moment-timezone");

var _momentTimezone2 = _interopRequireDefault(_momentTimezone);

var _requestPromise = require("request-promise");

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _tabletojson = require("tabletojson");

var _tabletojson2 = _interopRequireDefault(_tabletojson);

var _indices = require("./indices");

var _indices2 = _interopRequireDefault(_indices);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Options = exports.Options = function () {
  function Options(indexName, dateRange, metrics) {
    _classCallCheck(this, Options);

    this.method = "GET";
    this.uri = "https://www.nseindia.com/products/dynaContent/equities/indices/historical_pepb.jsp";
    this.indexName = indexName;
    this.fromDate = dateRange.fromDate;
    this.toDate = dateRange.toDate;
    this.yield1 = metrics.pe ? "pe" : undefined;
    this.yield2 = metrics.pb ? "pb" : undefined;
    this.yield3 = metrics.dy ? "dy" : undefined;

    var all = (0, _lodash.reduce)([this.yield1, this.yield2, this.yield2], function (result, value) {
      result && value;
    });
    this.yield4 = all ? "all" : undefined;
  }

  _createClass(Options, [{
    key: "requestObject",
    get: function get() {
      return {
        method: this.method,
        uri: this.uri,
        headers: {
          "User-Agent": "request-promise",
          Connection: "keep-alive"
        },
        qs: {
          indexName: this.indexName,
          fromDate: this.fromDate,
          toDate: this.toDate,
          yield1: String(this.yield1),
          yield2: String(this.yield2),
          yield3: String(this.yield3),
          yield4: String(this.yield4)
        }
      };
    }
  }]);

  return Options;
}();

function indexNameChecker(indexName) {
  var name = void 0;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = _indices2.default[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var category = _step.value;

      name = (0, _lodash.find)(category.option, function (index) {
        return index.text.replace(/\s/g, "").toLowerCase() === indexName.replace(/\s/g, "").toLowerCase();
      });

      if (name) {
        return name.value;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (!name) {
    var err = (0, _lodash.template)('indexName "${indexName}" does not exist');
    throw new Error(err({ indexName: indexName }));
  }
}

function dateRangeChecker(dateRange) {
  var fromDate = void 0,
      toDate = void 0;

  if (!dateRange.hasOwnProperty("start")) {
    throw new Error("dateRange.start not defined");
  } else {
    try {
      fromDate = (0, _momentTimezone2.default)(dateRange.start).tz("Asia/Kolkata").format("DD-MM-YYYY");
    } catch (e) {
      throw e;
    }
  }

  if (!dateRange.hasOwnProperty("end")) {
    toDate = (0, _momentTimezone2.default)().tz("Asia/Kolkata").subtract(1, "days").format("DD-MM-YYYY");
  } else {
    try {
      toDate = (0, _momentTimezone2.default)(dateRange.end).tz("Asia/Kolkata").format("DD-MM-YYYY");
    } catch (e) {
      throw e;
    }
  }

  return { fromDate: fromDate, toDate: toDate };
}

function metricsChecker(metrics) {
  var allowedMetrics = ["pb", "pe", "dy"];

  var wantedMetrics = {
    pb: false,
    pe: false,
    dy: false
  };

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = metrics[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var metric = _step2.value;

      if ((0, _lodash.indexOf)(allowedMetrics, metric) < 0) {
        var err = (0, _lodash.template)('metric "${metric}" does not exist');
        throw new Error(err({ metric: metric }));
      } else {
        wantedMetrics[metric] = true;
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return wantedMetrics;
}
//# sourceMappingURL=Helper.js.map