const express = require('express');
const app = express();
app.use(express.json());

require('dotenv').config();

const pgp = require('pg-promise')()
const connectionString = process.env.POSTGRES_STRING
global.db = pgp(connectionString)

// routes
const weatherRouter = require('./routes/weather')
const rentRouter = require('./routes/rent')
const comboRouter = require('./routes/combo')
app.use('/weather', weatherRouter)
app.use('/rent', rentRouter)
app.use('/combo', comboRouter)



app.get('/', (req, res) => {
    res.send('Documentation can be found at https://github.com/ersnover/rent-weather-api')
})


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('server running....')
})

