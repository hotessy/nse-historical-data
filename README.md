# nse-historical-data

Get historical P/E, P/B and Dividend Yield values indices listed on the [National Stock Exchange](https://www.nseindia.com/products/content/equities/indices/historical_pepb.htm), India.

Written in E6. Requires [babelJS](https://babeljs.io).

Available as an [npm package](https://www.npmjs.com/package/nse-historical-data): `npm i -s nse-historical-data`

## Request

```
{
  indexName: "name of index",
  date: {
    start: "start date in ISO 8601 format",
    end: "end date in ISO 8601 format"
  },
  metrics: [ "pb" or/and "pe" or/and "dy" ]
}

pb - Price-To-Book Ratio (P/B Ratio)
pe - Price-To-Earning Ratio (P/E Ratio)
dy - Dividend Yield
```

## Examples

Defining options:

```
let options = {
  indexName: "NIFTY 50",
  date: {
    start: "2018-01-15",
    end: "2018-01-17"
  },
  metrics: ["pb", "pe", "dy"]
};
```

```
const nseHistoricalData = require("nse-historical-data");

nseHistoricalData.default(options)
  .then(function(data) {
    console.log(data);
  })
  .catch(function(err) {
    console.error(err);
  });
```

#### or ES6
```
async function getHistoricalData(options) {
  try {
    let response = await nseHistoricalData(options);
    console.log(response);
  } catch (e) {
    console.error(e);
  }
}

getHistoricalData(options);
```

### Response

```
[ { Date: '15-Jan-2018',
    'P/E': '27.06',
    'P/B': '3.62',
    'Div Yield': '1.06' },
  { Date: '16-Jan-2018',
    'P/E': '26.96',
    'P/B': '3.61',
    'Div Yield': '1.06' },
  { Date: '17-Jan-2018',
    'P/E': '27.18',
    'P/B': '3.64',
    'Div Yield': '1.05' } ]
```
