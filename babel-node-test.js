import nseHistoricalData from "./src/index";

let options = {
  date: {
    start: "2018-01-12",
    end: "2018-01-16"
  }
};

nseHistoricalData(options)
  .then(function(data) {
    console.log(JSON.stringify(data));
  })
  .catch(function(err) {
    console.error(err);
  });
