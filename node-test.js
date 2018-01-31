const nseHistoricalData = require("./lib/index");

let options = {
  indexName: "NIFTY 50",
  date: {
    start: "2018-01-15",
    end: "2018-01-17"
  },
  metrics: ["pb", "pe", "dy"]
};

nseHistoricalData.default(options)
  .then(function(data) {
    console.log(data);
  })
  .catch(function(err) {
    console.error(err);
  });
