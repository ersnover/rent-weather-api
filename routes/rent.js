const express = require('express')
const router = express.Router()

// rent?compare=[greater, less]&cutoff=[integer]

router.get('/', (req,res) => {
    let compare = req.query.compare
    let cutoff = req.query.cutoff
    req.query.compare === 'greater' ? compare = '>' : compare = '<'

    db.any(`SELECT city, state, rent FROM cities WHERE rent ${compare}= $1 LIMIT 50`, [cutoff])
    .then(cities => res.json(cities))
    .catch(() => res.json({error: 'No cities matched your rent criteria'}))
})

router.get('/:city', (req,res) => {
    let city = req.params.city

    // leaving this .any() to account for multiple cities by the same name e.g. Springfield
    db.any(`SELECT city, state, rent FROM cities WHERE LOWER(city) = LOWER($1)`, [city])
    .then(cities => res.json(cities))
    .catch(() => res.json({error: 'No cities matched your criteria'}))
})


module.exports = router