const rp = require('request-promise')
const dsApiKey = process.env.DARK_SKY_KEY || null
const googleApiKey = process.env.GOOGLE_KEY || null

const infoString = (numberOfQueries) => `Averages are displayed in Fahrenheit (temperature), and inches (snow/rain). Average daily values are collected over the past ${numberOfQueries} years, while average monthly values are based on the most recent occurrence of the specified month`

// convert city, state to latitutde and longitude using Google Maps geocoding API
const fetchCoordinates = async (city, state) => {
    let formattedCity = city.replace(' ', '+')
    let options = {
        uri: `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedCity},+${state}&key=${googleApiKey}`,
        json: true
    }

    let geodata = await rp(options)

    if (geodata.err) {res.json({error: geodata.err})}
    else if (!geodata.results[0]){
        return {error: 'Invalid City/State'}
    } else {
        let coords = {
            lat: geodata.results[0].geometry.location.lat,
            lng: geodata.results[0].geometry.location.lng
        }
        return coords
    }
}

// make singular API call to Dark Sky using coordinates and date in YYYY-MM-DD format
const fetchDarkSky = async (coords, date) => {
    let options = {
        uri: `https://api.darksky.net/forecast/${dsApiKey}/${coords.lat},${coords.lng},${date}T00:00:00?exclude=currently,flags&units=us`,
        json: true
    }

    let weather = await rp(options)

    if (weather.err) {res.json({error: weather.err})}
    else {
        return weather
    }
}

// generate date strings for a single day over last X years (starts with previous year to avoid generating a future date)
const dayTypeArray = (dateString, points) => {
    let splitDate = dateString.split('-')
    let year = parseInt(splitDate)
    
    let dates = [...Array(points).keys()].map(i => {
        // generate date strings for past 10 years
        return `${year - i}-${splitDate[1]}-${splitDate[2]}`
    })
    return dates
}

// generate date strings spread over one month from previous year with points = x
const monthTypeArray = (dateString, points) => {
    let splitDate = dateString.split('-')
    let daySpread = (30/points).toFixed(0)
    
    let dates = [...Array(points).keys()].map(i => {
        // generate date strings over standard month
        return `${parseInt(splitDate[0])}-${splitDate[1]}-${('0' + (1 + i * daySpread)).slice(-2)}`
    })
    return dates
}

// takes an array of daily weather objects and calculates average high and low temperature
const calcAvgTemp = (dataArray, numberOfQueries) => {
    let temps = dataArray.reduce((obj, dayWeather) => {
        
        obj.totalHigh += dayWeather.daily.data[0].temperatureHigh
        obj.totalLow += dayWeather.daily.data[0].temperatureLow
        return obj
    }, {
        totalHigh: 0,
        totalLow: 0
    })
    
    let tempReport = {
        avgHigh: temps.totalHigh / numberOfQueries,
        avgLow: temps.totalLow / numberOfQueries
    }
    return tempReport
}

// takes an array of daily weather objects and calculates total rainfall and average rain / day
const calcAvgRain = (dataArray, numberOfQueries) => {
    let totalRain = dataArray.reduce((total, dayWeather) => {
        
        let hourReport = dayWeather.hourly.data
        // hourReport is array of hourly weather with precipitation intensity = inches/hr
        let dayRain = hourReport.reduce((total, hour) => {
            if (hour.precipType === 'rain') {
                hourlyRain = hour.precipIntensity
            } else {hourlyRain = 0}

            return total + hourlyRain
        }, 0)

        return total + dayRain
    }, 0)
    
    let rainReport = {
        totalRainfall: totalRain,
        avgRain: totalRain / numberOfQueries,
        info: infoString(numberOfQueries)
    }
    return rainReport
}

// takes an array of daily weather objects and calculates total snowfall and average snow / day
const calcAvgSnow = (dataArray, numberOfQueries) => {
    let totalSnow = dataArray.reduce((total, dayWeather) => {
        
        let hourReport = dayWeather.hourly.data
        // hourReport is array of hourly weather with precipitation intensity = inches/hr
        let daySnow = hourReport.reduce((total, hour) => {
            if (hour.precipType === 'snow') {
                hourlySnow = hour.precipIntensity
            } else {hourlySnow = 0}

            return total + hourlySnow
        }, 0)

        return total + daySnow
    }, 0)
    
    let snowReport = {
        totalSnowfall: totalSnow,
        avgSnow: totalSnow / numberOfQueries,
        info: infoString(numberOfQueries)
    }
    return snowReport
}

// takes an array of daily weather objects and calculates # of days with specified precipitation
const calcPrecipDays = (data, type) => {
    let rainyDays = data.reduce((counter, day) => {
        day.daily.data[0].precipType === type ? counter ++ : counter
        return counter
    }, 0)
    return rainyDays
}

// capitalizes every word in a string
const capitalize = (string) => string.split(' ').map(word => word[0].toUpperCase() + word.substring(1)).join(' ')


const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

module.exports = {
    fetchCoordinates: fetchCoordinates,
    fetchDarkSky: fetchDarkSky,
    dayTypeArray: dayTypeArray,
    monthTypeArray: monthTypeArray,
    calcAvgTemp: calcAvgTemp,
    calcAvgRain: calcAvgRain,
    calcAvgSnow: calcAvgSnow,
    capitalize: capitalize,
    asyncForEach: asyncForEach,
    calcPrecipDays: calcPrecipDays
}