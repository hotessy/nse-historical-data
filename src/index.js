import moment from "moment-timezone";
import * as Helper from "./Helper";

export default function(arg) {
  let indexNames = arg.indexNames || "all";
  let metrics = arg.metrics || "all";
  let way = arg.way || "datewise";
  try {
    indexNames = Helper.indexNamesChecker(indexNames);
    let dateRange = Helper.dateRangeChecker(arg.date);
    metrics = Helper.metricsChecker(metrics);
    way = Helper.wayChecker(way);

    let data = extractData(dateRange);
    if (way === "datewise") {
      return Promise.resolve(data);
    } else {
      let transformedData = transformData(data, indexNames, metrics, way);
      return Promise.resolve(transformedData);
    }
  } catch (err) {
    return Promise.reject(err);
  }
}

function transformData(data, indexNames, metrics, way) {
  // TODO: write transformation function
  return "Only ``way : datewise` supported right now ";
}

async function extractData(dateRange) {
  let allData = {};
  for (
    let i = dateRange.start;
    i.format("DDMMYYYY") !== dateRange.end.format("DDMMYYYY");
    i.add(1, "days")
  ) {
    try {
      let data = await Helper.getHistoricalData(i.format("DDMMYYYY"));
      allData[i.format("YYYY-MM-DD")] = data;
    } catch (err) {
      // console.error(err);
    }
  }

  return allData;
}
