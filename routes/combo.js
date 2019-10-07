const express = require('express')
const router = express.Router()

const wf = require('../functions/weatherFunctions')
const cityLimit = 10

// combo?rent=[integer]&rcompare=[less / greater]&weather=[tempHi / tempLo / rain / snow]&wcompare=[less / greater]&value=[degF / dayspermonth]&date=YYYY-MM-DD&period=[day / month]

router.get('/', async (req,res) => {
    let rcompare = req.query.rcompare
    let rent = req.query.rent
    req.query.compare === 'greater' ? rcompare = '>' : rcompare = '<'

    let cities
    try {
        cities = await db.any(`SELECT city, state, rent FROM cities WHERE rent ${rcompare}= $1 LIMIT ${cityLimit}`, [rent])
    } catch {
        res.status(500).send
        return
    }

    // build city objects
    await wf.asyncForEach(cities, async city => {
        //add coords
        city.coords = await wf.fetchCoordinates(city.city, city.state)

        let datesArray = req.query.period === "day" ? wf.dayTypeArray(req.query.date) : wf.monthTypeArray(req.query.date)

        // get weather data
        let darkSkyData = await Promise.all(datesArray.map(date => wf.fetchDarkSky(city.coords, date)))

        // process and organize weather data
        let avgTemps = wf.calcAvgTemp(darkSkyData)
        
        city.weather = {
            date: req.query.date,
            period: req.query.period,
            tempHi: avgTemps.avgHigh,
            tempLo: avgTemps.avgLow,
            rain: req.query.period === 'month' ? wf.calcPrecipDays(darkSkyData, 'rain') : null,
            snow: req.query.period === 'month' ? wf.calcPrecipDays(darkSkyData, 'snow') : null
        }
    })

    // filter cities

    let filteredCities = cities.filter(city => {
        let key = req.query.weather
        switch(req.query.wcompare) {
            case 'greater':
                return city.weather[key] > parseInt(req.query.value)
            case 'less':
                return city.weather[key] < parseInt(req.query.value)
        }
    })

    res.send(filteredCities)
})




module.exports = router