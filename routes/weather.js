const express = require('express')
const router = express.Router()
const wf = require('../functions/weatherFunctions')

// /weather/state/city?date=YYYY-MM-DD&period=[month || day]&type=[temp || rain || snow]

router.get('/:state/:city', async (req, res) => {
    let city = req.params.city
    let state = req.params.state

    let coords = await wf.fetchCoordinates(city, state)

    let datesArray = req.query.period === "day" ? wf.dayTypeArray(req.query.date) : wf.monthTypeArray(req.query.date)

    let darkSkyData = await Promise.all(datesArray.map(date => wf.fetchDarkSky(coords, date)))

    let report
    switch(req.query.type) {
        case 'temp':
            report = wf.calcAvgTemp(darkSkyData)
            break
        case 'rain':
            report = wf.calcAvgRain(darkSkyData)
            break
        case 'snow':
            report = wf.calcAvgSnow(darkSkyData)
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
        report: report,
        data: darkSkyData
    }

    res.json(responseObject)
})

module.exports = router