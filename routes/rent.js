const express = require('express')
const router = express.Router()

const { check, validationResult } = require('express-validator');


router.get('/', [
    check('compare', 'Invalid compare string').isIn(['greater', 'less']),
    check('rent', 'Rent must be an integer').isInt(),
    check('citycount', 'Citycount must be an integer').isInt(),
    check('key', 'Invalid key value').equals(process.env.MY_KEY)
], (req,res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    let compare = req.query.compare
    let rent = req.query.rent
    let citycount = req.query.citycount
    compare === 'greater' ? compare = '>' : compare = '<'

    db.any(`SELECT city, state, rent FROM cities WHERE rent ${compare}= $1 LIMIT ${citycount}`, [rent])
    .then(cities => cities[0] ? res.json(cities) : res.json({errors: 'No cities matched your rent criteria'}))
    .catch(() => res.json({errors: 'No cities matched your rent criteria'}))
})

router.get('/:city', [
    check('city', 'Invalid city name').isString(),
    check('key', 'Invalid key value').equals(process.env.MY_KEY)
], (req,res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    let city = req.params.city

    // leaving this .any() to account for multiple cities by the same name e.g. Springfield
    db.any(`SELECT city, state, rent FROM cities WHERE LOWER(city) = LOWER($1)`, [city])
    .then(cities => cities[0] ? res.json(cities) : res.json({errors: 'No cities matched your search criteria'}))
    .catch(() => res.json({error: 'No cities matched your criteria'}))
})


module.exports = router