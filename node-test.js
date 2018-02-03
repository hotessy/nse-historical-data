const nseHistoricalData = require("./lib/index");

let options = {
  date: {
    start: "2018-01-04",
    end: "2018-01-10"
  }
};

nseHistoricalData
  .default(options)
  .then(function(data) {
    console.log(JSON.stringify(data));
  })
  .catch(function(err) {
    console.error(err);
  });
