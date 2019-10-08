const express = require('express')
const router = express.Router()

const { check, validationResult } = require('express-validator');

const wf = require('../functions/weatherFunctions')

// finds cutoff for monthly search
var date = new Date(), y = date.getFullYear(), m = date.getMonth();
var firstDay = new Date(y, m, 1);


router.get('/', [
    check('rent', 'Rent must be an integer').isInt(),
    check('rcompare', 'Invalid compare string').isIn(['greater', 'less']),
    check('citycount', 'Citycount must be an integer').isInt(),
    check('weather', 'Invalid weather type').isIn(['rain', 'snow', 'tempLo', 'tempHi']),
    check('wcompare', 'Invalid compare string').isIn(['greater', 'less']),
    check('value', 'Value must be an integer').isInt(),
    check('date', "Date must be earlier than the current month").isBefore(firstDay.toDateString()),
    check('date', 'Invalid date format').matches(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/),
    check('period', 'Invalid Period').isIn(['day', 'month']),
    check('datapoints', 'Invalid datapoints').isInt(),
    check('key', 'Invalid key value').equals(process.env.MY_KEY)
], async (req,res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    let rcompare = req.query.rcompare
    let rent = req.query.rent
    let citycount = req.query.citycount
    rcompare === 'greater' ? rcompare = '>' : rcompare = '<'

    let cities
    try {
        cities = await db.any(`SELECT city, state, rent FROM cities WHERE rent ${rcompare}= $1 LIMIT ${citycount}`, [rent])
    } catch {
        res.status(500).json({errors: "Database error"})
        return
    }

    // build city objects
    try{
        await wf.asyncForEach(cities, async city => {
            //add coords
            city.coords = await wf.fetchCoordinates(city.city, city.state)

            let dateString = req.query.date
            let dataPoints = parseInt(req.query.datapoints)

            let datesArray = req.query.period === "day" ? wf.dayTypeArray(dateString, dataPoints) : wf.monthTypeArray(dateString, dataPoints)

            console.log(datesArray)

            // get weather data
            let darkSkyData = await Promise.all(datesArray.map(date => wf.fetchDarkSky(city.coords, date)))

            // process and organize weather data
            let avgTemps = wf.calcAvgTemp(darkSkyData, dataPoints)

            city.weather = {
                date: dateString,
                period: req.query.period,
                tempHi: avgTemps.avgHigh,
                tempLo: avgTemps.avgLow,
                rain: req.query.period === 'month' ? wf.calcPrecipDays(darkSkyData, 'rain') : null,
                snow: req.query.period === 'month' ? wf.calcPrecipDays(darkSkyData, 'snow') : null
            }
        })
        console.log(cities)
    } catch {
        res.status(500).json({errors: "External server error"})
    }

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