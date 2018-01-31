import nseData from "./index";

nseData({
  indexName: "NIFTY 50",
  date: {
    start: "2018-01-07",
    end: "2018-01-18"
  },
  metrics: ["pb", "pe", "dy"]
})
  .then(function(data) {
    console.log(data);
  })
  .catch(function(err) {
    console.log(err);
  });
