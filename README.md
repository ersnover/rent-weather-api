**Weather String:**

/weather/state/city?period=<month/day>&date=YYYY-MM-DD&datapoints=<integer>&type=<temp/rain/snow>&key=<API_KEY>

**Example:**

/weather/tx/houston?period=day&date=2019-02-04&datapoints=5&type=rain&key=<YOUR_API_KEY>

**Returns:** 


```
{

```



1. **<code>inputs: </code></strong>
2. <strong><code>{</code></strong>
    1. <strong><code>city: "Houston",</code></strong>
    2. <strong><code>state: "Tx",</code></strong>
    3. <strong><code>date: "2019-02-04",</code></strong>
    4. <strong><code>type: "Rain",</code></strong>
    5. <strong><code>period: "Day"</code></strong>
3. <strong><code>},</code></strong>
4. <strong><code>report: </code></strong>
5. <strong><code>{</code></strong>
    6. <strong><code>totalRainfall: 0.12310000000000001,</code></strong>
    7. <strong><code>avgRain: 0.024620000000000003,</code></strong>
    8. <strong><code>info: "Averages are displayed in Fahrenheit (temperature), and inches (snow/rain). Average daily values are collected over the past 5 years, while average monthly values are based on the most recent occurrence of the specified month"</code></strong>
6. <strong><code>}</code></strong>


```
}
```


**Parameters:**

**period**

Currently supports **day** or **month**. Specifying **day** will look up historical data for a specific day, starting one year earlier than specified in **date**, and over number of years specified in **datapoints. **Specifying **month** will look up data spread over a full month from the previous year, with corresponding **datapoints**.

**date**

In format YYYY-MM-DD. **Day** data will be taken beginning the current year, and **month** data will be taken from the most recent specified month. Future dates will result in an invalid data error. For example, specifying **month **and **2019-09-01** will look up data spread over September, 2019. Specifying **day** and **2019-09-01** will look up data for September 1st, starting in 2019 and including a number of years corresponding to the value of **datapoints**.

**datapoints**

Integer ranging from 0 to number of days for month specified in **date**. Specifies number of data points to query, higher numbers are more accurate, but incur additional cost and may decrease latency.

**type**

Type of weather to report on. Options are currently **temp**, **rain**, and **snow.** **Temp** will return average high and low temperatures (degrees Fahrenheit) over specified **period**. **Rain** and **snow** will return total rain/snowfall, and average rain/snowfall.

**key**

Private API Key (available on request)



---


**Rent String:**

/rent?compare=<greater/less>&cutoff=<integer>&quantity=<integer>&key=<API_KEY>

**Example:**

/rent?rent=1500&compare=less&citycount=5&key=bab811c0-2ee3-4213-85b3-12c617b12e21

**Returns:**


```
[

```



1. `{`
    1. **<code>city: "Houston",</code></strong>
    2. <strong><code>state: "TX",</code></strong>
    3. <strong><code>rent: 1430</code></strong>
2. <code>},</code>
3. <code>{</code>
    4. <strong><code>city: "Philadelphia",</code></strong>
    5. <strong><code>state: "PA",</code></strong>
    6. <strong><code>rent: 1212</code></strong>
4. <code>},</code>
5. <code>{</code>
    7. <strong><code>city: "Phoenix",</code></strong>
    8. <strong><code>state: "AZ",</code></strong>
    9. <strong><code>rent: 1247</code></strong>
6. <code>},</code>
7. <code>{</code>
    10. <strong><code>city: "Las Vegas",</code></strong>
    11. <strong><code>state: "NV",</code></strong>
    12. <strong><code>rent: 1239</code></strong>
8. <code>},</code>
9. <code>{</code>
    13. <strong><code>city: "San Antonio",</code></strong>
    14. <strong><code>state: "TX",</code></strong>
    15. <strong><code>rent: 1250</code></strong>
10. <code>}</code>


```
]
```


**Parameters:**

**compare**

Return cities with average rents **greater **or **less** than **cutoff**

**cutoff**

Breakpoint average rent

**citycount**

Number of cities to return. Cities are returned in order of population.

**key**

Private API Key (available on request)



---


**Combo String:**

/combo?rent=<integer>&rcompare=<less/greater>&citycount=<integer>&weather=<tempHi/tempLo/rain/snow>&wcompare=<less/greater>&value=<integer>&date=YYYY-MM-DD&period=<day/month>&datapoints=<integer>&key=<API_KEY>

**Example:**

/combo?rent=1800&rcompare=less&citycount=5&wcompare=greater&weather=tempLo&value=50&date=2019-02-04&period=day&datapoints=5&key=bab811c0-2ee3-4213-85b3-12c617b12e21

**returns:**


```
[

```



1. **<code>{</code></strong>
    1. <strong><code>city: "Houston",</code></strong>
    2. <strong><code>state: "TX",</code></strong>
    3. <strong><code>rent: 1430,</code></strong>
    4. <strong><code>coords: </code></strong>
    5. <strong><code>{</code></strong>
        1. <strong><code>lat: 29.7604267,</code></strong>
        2. <strong><code>lng: -95.3698028</code></strong>
    6. <strong><code>},</code></strong>
    7. <strong><code>weather: </code></strong>
    8. <strong><code>{</code></strong>
        3. <strong><code>date: "2019-02-04",</code></strong>
        4. <strong><code>period: "day",</code></strong>
        5. <strong><code>tempHi: 65.146,</code></strong>
        6. <strong><code>tempLo: 52.864,</code></strong>
        7. <strong><code>rain: null,</code></strong>
        8. <strong><code>snow: null</code></strong>
    9. <strong><code>}</code></strong>
2. <strong><code>}</code></strong>


```
]
```


**Parameters:**

**rent**

Breakpoint average rent

**rcompare**

Return cities with average rent **greater **or **less** than **rent**

**citycount**

Positive integer specifying number of cities to report on. Cities are returned in order of population, so higher **citycount** values have a greater chance of returning cities with smaller populations. However, the total number of queries will be equal to **(citycount * datapoints)**, so consider using high values for both parameters with caution.

**weather**

Type of weather to report on. Options are currently **tempHi**, **tempLo**, **rain**, and **snow.** **TempHi/Lo** will use average high or low temperatures (degrees Fahrenheit) as the criteria over specified **period**. **Rain** and **snow** will use days of rain/snow as the criteria. For example, you might request cities with fewer than 10 days of rain in August.

**wcompare**

Return cities with weather values **greater **or **less** than **value**

**value**

Breakpoint for weather report, either degrees Fahrenheit or days of precipitation / month, depending on **weather**.

**date**

In format YYYY-MM-DD. **Day** data will be taken beginning the current year, and **month** data will be taken from the most recent specified month. Future dates will result in an invalid data error. For example, specifying **month **and **2019-09-01** will look up data spread over September, 2019. Specifying **day** and **2019-09-01** will look up data for September 1st, starting in 2019 and including a number of years corresponding to the value of **datapoints**.

**period**

Currently supports **day** or **month**. Specifying **day** will look up historical data for a specific day, starting at the most recent occurence, and over number of years specified in **datapoints. **Specifying **month** will look up data spread over a full month from the most recent occurence, with corresponding **datapoints**.

**datapoints**

Integer ranging from 0 to number of days for month specified in **date (**if **period=month**). There is no upper limit for **period=day**. Specifies number of data points to query, higher numbers are more accurate, but incur additional cost and may decrease latency.

**key**

Private API Key (available on request)
