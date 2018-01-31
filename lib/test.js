"use strict";

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index2.default)({
  indexName: "NIFTY 50",
  date: {
    start: "2018-01-07",
    end: "2018-01-18"
  },
  metrics: ["pb", "pe", "dy"]
}).then(function (data) {
  console.log(data);
}).catch(function (err) {
  console.log(err);
});
//# sourceMappingURL=test.js.map