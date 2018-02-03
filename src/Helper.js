import { reduce, find, template, indexOf, forEach } from "lodash";
import moment from "moment-timezone";
import requestPromise from "request-promise";
import csvjson from "csvjson";
import indices from "./Indices";

const url = template(
  "https://www.nseindia.com/content/indices/ind_close_all_${datestamp}.csv"
);

export class Options {
  constructor(date) {
    this.method = "GET";
    this.uri = url({ datestamp: date });
  }
  get requestObject() {
    return {
      method: this.method,
      uri: this.uri,
      headers: {
        "User-Agent": "request-promise",
        Connection: "keep-alive"
      },
      json: true,
      resolveWithFullResponse: true
    };
  }
}

export function indexNamesChecker(indexNames) {
  let allowedIndexNames = [];

  forEach(indices, indexObject => {
    allowedIndexNames.push(indexObject.name);
  });

  if (
    typeof indexNames === "string" &&
    indexNames.replace(/\s/g, "").toLowerCase() === "all"
  ) {
    return allowedIndexNames;
  }

  let formattedIndexNames = [];

  for (let indexName of indexNames) {
    let index = find(allowedIndexNames, allowedIndexName => {
      return (
        allowedIndexName.replace(/\s/g, "").toLowerCase() ===
        indexName.replace(/\s/g, "").toLowerCase()
      );
    });

    if (index) {
      formattedIndexNames.push(index);
    } else {
      let err = template('indexName "${indexName}" do not exist');
      throw new Error(err({ indexNames: index }));
    }
  }
  return formattedIndexNames;
}

export function dateRangeChecker(dateRange) {
  let fromDate, toDate;

  if (!dateRange.hasOwnProperty("start")) {
    throw new Error("dateRange.start not defined");
  } else {
    try {
      fromDate = moment(dateRange.start).tz("Asia/Kolkata");
    } catch (err) {
      throw err;
    }
  }

  if (!dateRange.hasOwnProperty("end")) {
    toDate = moment()
      .tz("Asia/Kolkata")
      .subtract(1, "days");
  } else {
    try {
      toDate = moment(dateRange.end).tz("Asia/Kolkata");
    } catch (err) {
      throw err;
    }
  }

  return { start: fromDate, end: toDate };
}

export function metricsChecker(metrics) {
  let allowedMetrics = [
    "pb",
    "pe",
    "dy",
    "high",
    "low",
    "open",
    "close",
    "volume",
    "turnover"
  ];

  if (
    typeof metrics === "string" &&
    metrics.replace(/\s/g, "").toLowerCase() === "all"
  ) {
    return allowedMetrics;
  }

  let wantedMetrics = {};

  forEach(allowedMetrics, metric => {
    wantedMetrics[metric] = false;
  });

  for (let metric of metrics) {
    if (indexOf(allowedMetrics, metric) < 0) {
      let err = template('metric "${metric}" does not exist');
      throw new Error(err({ metric: metric }));
    } else {
      wantedMetrics[metric] = true;
    }
  }

  return wantedMetrics;
}

export function wayChecker(way) {
  let allowedWays = ["datewise", "metricwise", "indexwise"];

  if (indexOf(allowedWays, way) < 0) {
    let err = template('Formatting type "${way}" does not exist');
    throw new Error(err({ way: way }));
  } else {
    return way;
  }
}

export async function getHistoricalData(date) {
  let options = new Options(date).requestObject;
  try {
    const data = await requestPromise(options);
    if (data.statusCode == 200) {
      let json = csvjson.toObject(data.body);
      return Promise.resolve(json);
    } else if (data.statusCode == 404) {
      return Promise.resolve({});
    }
  } catch (err) {
    return Promise.reject(err);
  }
}
