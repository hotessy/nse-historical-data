# nse-historical-data

### v2 released!

Get historical data from all indices listed on the [National Stock Exchange](https://www.nseindia.com/products/content/equities/indices/historical_pepb.htm), India.

Install via [npm](https://www.npmjs.com/package/nse-historical-data): `npm i -S nse-historical-data`

## Request

```
{
  date : {
    start: "start date in ISO 8601 format",
    end: "end date in ISO 8601 format"
  }
}
```

## Examples

Defining options:

```js
let options = {
  date: {
    start: "2018-01-12",
    end: "2018-01-16"
  }
};
const nseHistoricalData = require("nse-historical-data");
```

```js
nseHistoricalData
  .default(options)
  .then(function(data) {
    console.log(JSON.stringify(data));
  })
  .catch(function(err) {
    console.error(err);
  });
```

#### or ES6

```js
async function getHistoricalData(options) {
  try {
    let response = await nseHistoricalData(options);
    console.log(JSON.stringify(response));
  } catch (e) {
    console.error(e);
  }
}

getHistoricalData(options);
```

### Response

```js
{
  "2018-01-12": [
    {
      "Index Name": "Nifty 50",
      "Index Date": "12-01-2018",
      "Open Index Value": "10682.55",
      "High Index Value": "10690.4",
      "Low Index Value": "10597.1",
      "Closing Index Value": "10681.25",
      "Points Change": "30.05",
      "Change(%)": ".28",
      "Volume": "180592153",
      "Turnover (Rs. Cr.)": "11005.12",
      "P/E": "27.28",
      "P/B": "3.6",
      "Div Yield": "1.06"
    },
    {
      "Index Name": "Nifty Next 50",
      "Index Date": "12-01-2018",
      "Open Index Value": "31786.75",
      "High Index Value": "31825",
      "Low Index Value": "31382.7",
      "Closing Index Value": "31704.85",
      "Points Change": "9.05",
      "Change(%)": ".03",
      "Volume": "141247328",
      "Turnover (Rs. Cr.)": "3822.06",
      "P/E": "38.81",
      "P/B": "3.7",
      "Div Yield": ".97"
    },
    {
      "Index Name": "Nifty 100",
      "Index Date": "12-01-2018",
      "Open Index Value": "11165.05",
      "High Index Value": "11173.4",
      "Low Index Value": "11067.6",
      "Closing Index Value": "11159.1",
      "Points Change": "26.7",
      "Change(%)": ".24",
      "Volume": "325389855",
      "Turnover (Rs. Cr.)": "14917.22",
      "P/E": "28.75",
      "P/B": "3.61",
      "Div Yield": "1.04"
    },
    ...
  ],

  "2018-01-15" : [ ... ]
}
```

**NOTE:** _Other dates have been excluded from the response because the market was closed._
