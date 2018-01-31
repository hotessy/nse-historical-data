import { reduce, find, template, indexOf, forEach } from "lodash";
import moment from "moment-timezone";
import requestPromise from "request-promise";
import tabletojson from "tabletojson";
import indices from "./indices";

export class Options {
  constructor(indexName, dateRange, metrics) {
    this.method = "GET";
    this.uri =
      "https://www.nseindia.com/products/dynaContent/equities/indices/historical_pepb.jsp";
    this.indexName = indexName;
    this.fromDate = dateRange.fromDate;
    this.toDate = dateRange.toDate;
    this.yield1 = metrics.pe ? "pe" : undefined;
    this.yield2 = metrics.pb ? "pb" : undefined;
    this.yield3 = metrics.dy ? "dy" : undefined;

    let all = reduce(
      [this.yield1, this.yield2, this.yield2],
      (result, value) => {
        result && value;
      }
    );
    this.yield4 = all ? "all" : undefined;
  }

  get requestObject() {
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
}

export function indexNameChecker(indexName) {
  let name;
  for (let category of indices) {
    name = find(category.option, index => {
      return (
        index.text.replace(/\s/g, "").toLowerCase() ===
        indexName.replace(/\s/g, "").toLowerCase()
      );
    });

    if (name) {
      return name.value;
    }
  }

  if (!name) {
    let err = template('indexName "${indexName}" does not exist');
    throw new Error(err({ indexName: indexName }));
  }
}

export function dateRangeChecker(dateRange) {
  let fromDate, toDate;

  if (!dateRange.hasOwnProperty("start")) {
    throw new Error("dateRange.start not defined");
  } else {
    try {
      fromDate = moment(dateRange.start)
        .tz("Asia/Kolkata")
        .format("DD-MM-YYYY");
    } catch (e) {
      throw e;
    }
  }

  if (!dateRange.hasOwnProperty("end")) {
    toDate = moment()
      .tz("Asia/Kolkata")
      .subtract(1, "days")
      .format("DD-MM-YYYY");
  } else {
    try {
      toDate = moment(dateRange.end)
        .tz("Asia/Kolkata")
        .format("DD-MM-YYYY");
    } catch (e) {
      throw e;
    }
  }

  return { fromDate: fromDate, toDate: toDate };
}

export function metricsChecker(metrics) {
  let allowedMetrics = ["pb", "pe", "dy"];

  let wantedMetrics = {
    pb: false,
    pe: false,
    dy: false
  };

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

export async function getHistoricalData(indexName, dateRange, metrics) {
  let options = new Options(indexName, dateRange, metrics).requestObject;
  try {
    const data = await requestPromise(options);
    let json = tabletojson.convert(data)[0];
    json.splice(-1, 1);
    return Promise.resolve(json);
  } catch (err) {
    return Promise.reject(err);
  }
}
