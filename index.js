import * as Helper from "./Helper";

export default function(arg) {
  let indexName, dateRange, metrics;
  try {
    indexName = Helper.indexNameChecker(arg.indexName);
    dateRange = Helper.dateRangeChecker(arg.date);
    metrics = Helper.metricsChecker(arg.metrics);
    return Helper.getHistoricalData(indexName, dateRange, metrics);
  } catch (e) {
    return Promise.reject(e);
  }
}
