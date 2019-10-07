**Weather String:**

/weather/state/city?period=<month/day>&date=YYYY-MM-DD&data-points=<integer>&type=<temp/rain/snow>

**Parameters:**

**period**

Currently supports **day** or **month**. Specifying **day** will look up historical data for a specific day, starting one year earlier than specified in **date**, and over number of years specified in **data-points. **Specifying **month** will look up data spread over a full month from the previous year, with corresponding **data-points**.

**date**

In format YYYY-MM-DD. **Day** data will be taken beginning the previous year, and **month** data will be taken from the specified month in the previous year. This is to avoid drawing inaccurate data from months that have not occurred yet. For example, specifying **month **and **2019-10-01** will look up data spread over October, 2018. Specifying **day** and **2019-10-01** will look up data for October 1st, starting in 2018 and including a number of years corresponding to the value of **data-points**.

**data-points**

Integer ranging from 0 to number of days for month specified in **date**. Specifies number of data points to query, higher numbers are more accurate, but incur additional cost and may decrease latency.

**type**

Type of weather to report on. Options are currently **temp**, **rain**, and **snow.** **Temp** will return average high and low temperatures (degrees Fahrenheit) over specified **period**. **Rain** and **snow** will return total rain/snowfall, and average rain/snowfall.

**Rent String:**

/rent?compare=<greater/less>&cutoff=<integer>

**Parameters:**

**compare**

Return cities with average rents **greater **or **less** than **cutoff**

**cutoff**

Breakpoint average rent

**Combo String:**

/combo?rent=<integer>&rcompare=<less/greater>&city-count=<integer>&weather=<tempHi/tempLo/rain/snow>&wcompare=<less/greater>&value=<integer>&date=YYYY-MM-DD&period=<day/month>&data-points=<integer>

**rent**

Breakpoint average rent

**rcompare**

Return cities with average rent **greater **or **less** than **rent**

**city-count**

Positive integer specifying number of cities to report on. Cities are returned in order of population, so higher **city-count** values have a greater chance of returning cities with smaller populations. However, the total number of queries will be equal to **(city-count * data-points)**, so consider using high values for both parameters with caution.

**weather**

Type of weather to report on. Options are currently **tempHi**, **tempLo**, **rain**, and **snow.** **TempHi/Lo** will use average high or low temperatures (degrees Fahrenheit) as the criteria over specified **period**. **Rain** and **snow** will use days of rain/snow as the criteria. For example, you might request cities with fewer than 10 days of rain in August.

**wcompare**

Return cities with weather values **greater **or **less** than **value**

**value**

Breakpoint for weather report, either degrees Fahrenheit or days of precipitation / month, depending on **weather**.

**date**

In format YYYY-MM-DD. **Day** data will be taken beginning the previous year, and **month** data will be taken from the specified month in the previous year. This is to avoid drawing inaccurate data from months that have not occurred yet. For example, specifying **month **and **2019-10-01** will look up data spread over October, 2018. Specifying **day** and **2019-10-01** will look up data for October 1st, starting in 2018 and including a number of years corresponding to the value of **data-points**.

**period**

Currently supports **day** or **month**. Specifying **day** will look up historical data for a specific day, starting one year earlier than specified in **date**, and over number of years specified in **data-points. **Specifying **month** will look up data spread over a full month from the previous year, with corresponding **data-points**.

**data-points**

Integer ranging from 0 to number of days for month specified in **date (**if **period=month**). There is no upper limit for **period=day**. Specifies number of data points to query, higher numbers are more accurate, but incur additional cost and may decrease latency.