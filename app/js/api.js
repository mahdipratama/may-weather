'use strict'

const API_KEY = '6717f6f86640f48b045c6df37d3ec6a2';


/**
 * 
 * @param {string} URL API url 
 * @returns data as promises
 */
export const fetchData = async function (URL) {
  try {
    const res = await fetch(`${URL}&appid=${API_KEY}`)

    if (!res.ok) throw new Error('Error Fetching Data!');

    const data = await res.json();

    return data

  } catch (err) {
    console.error(err);
  }
}

export const url = {
  currentWeather(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/weather?${lat}&${lon}&units=metric`
  },

  forecast(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/forecast?${lat}&${lon}&units=metric`
  },

  airPollution(lat, lon) {
    return `http://api.openweathermap.org/data/2.5/air_pollution?${lat}&${lon}`
  },

  reverseGeo(lat, lon) {
    return `http://api.openweathermap.org/geo/1.0/reverse?${lat}&${lon}&limit=5`
  },

  /**
   * @param {string} query Search query e.g.: 'London', 'New York' and etc  
   */
  geo(query) {
    return `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`
  },
}
