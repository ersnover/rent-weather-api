const express = require('express')
const router = express.Router()
const wf = require('../functions/weatherFunctions')
const { check, validationResult } = require('express-validator');

// finds cutoff for monthly search
var date = new Date(), y = date.getFullYear(), m = date.getMonth();
var firstDay = new Date(y, m, 1);


router.get('/:state/:city',[
    check(['city', 'state'], 'Invalid Location').isString(),
    check('date', "Date must be earlier than the current month").isBefore(firstDay.toDateString()),
    check('date', 'Invalid date format').matches(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/),
    check('period', 'Invalid Period').isIn(['day', 'month']),
    check('type', 'Invalid Type').isIn(['rain', 'snow', 'temp']),
    check('datapoints', 'Invalid datapoints').isInt(),
    check('key', 'Invalid key value').equals(process.env.MY_KEY)
], async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    let city = req.params.city
    let state = req.params.state

    let coords = await wf.fetchCoordinates(city, state)
    if (coords.error) {
        return res.status(400).json({errors: coords.error})
    }

    let dataPoints = parseInt(req.query.datapoints)

    let datesArray = req.query.period === "day" ? wf.dayTypeArray(req.query.date, dataPoints) : wf.monthTypeArray(req.query.date, dataPoints)

    let darkSkyData = await Promise.all(datesArray.map(date => wf.fetchDarkSky(coords, date)))

    let report
    switch(req.query.type) {
        case 'temp':
            report = wf.calcAvgTemp(darkSkyData, dataPoints)
            break
        case 'rain':
            report = wf.calcAvgRain(darkSkyData, dataPoints)
            break
        case 'snow':
            report = wf.calcAvgSnow(darkSkyData, dataPoints)
            break
        default:
            break
    }

    let inputs = {
        city: wf.capitalize(city),
        state: wf.capitalize(state),
        date: req.query.date,
        type: wf.capitalize(req.query.type),
        period: wf.capitalize(req.query.period)
    }

    let responseObject = {
        inputs: inputs,
        report: report
        // data: darkSkyData
    }

    res.json(responseObject)
})

module.exports = router