'use strict'

import { fetchData, url } from "./api.js"
import * as module from './module.js'
  ;

/**
 * 
 * @param {nodeList} elements Element node array 
 * @param {string} eventType event type e.g.: 'click', 'mouseover', etc..  
 * @param {function} callback callback function 
 */
const addEventOnElement = function (elements, eventType, callback) {
  elements.forEach(element => {
    element.addEventListener(eventType, callback);
  })
};

//////////////////////////
// Toggle search on mobile 

const searchView = document.querySelector('[data-search-view]');
const searchTogglers = document.querySelectorAll('[data-search-toggler]');

const toggleSearch = () => searchView.classList.toggle('active');
addEventOnElement(searchTogglers, 'click', toggleSearch);


//////////////////////////
// SEARCH INTEGRATION

const searchField = document.querySelector('[data-search-field]');
const searchResult = document.querySelector('[data-search-result]');

let searchTimeout = null;
const searchTimeoutDuration = 500;

searchField.addEventListener('input', function () {

  searchTimeout ?? clearTimeout(searchTimeout);

  if (!searchField.value) {
    searchResult.classList.remove('active');
    searchResult.innerHTML = '';
    searchField.classList.remove('searching');
  } else {
    searchField.classList.add('searching');
  }

  if (searchField.value) {

    searchTimeout = setTimeout(async () => {

      const locations = await fetchData(url.geo(searchField.value))

      // console.log(locations);

      searchField.classList.remove('searching');
      searchResult.classList.add('active');
      searchResult.innerHTML = `
        <ul class="view-list" data-search-list></ul>
      `;

      const /**{NodeList} | [] */ items = [];

      locations.forEach(({ name, lat, lon, country, state }) => {
        const searchItem = document.createElement('li');
        searchItem.classList.add('view-item');

        searchItem.innerHTML = `
          <span class="m-icon">
            <i class="fa-solid fa-location-dot fa-xl" style="color:  #f4f4f4;">
            </i>
          </span>

          <div>
            <p class="item-title">${name}</p>
            <p class="label-2 item-subtitle">${state || ''}, ${country}</p>
          </div>

          <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link" aria-label="${name} weather" data-search-toggler></a>
        `;

        searchResult.querySelector('[data-search-list]').appendChild(searchItem)

        items.push(searchItem.querySelector('[data-search-toggler]'))

        addEventOnElement(items, 'click', () => {
          toggleSearch()
          searchResult.classList.remove('active')
        })


      });
    }, searchTimeoutDuration)
  }
});

const container = document.querySelector('[data-container]');
const loading = document.querySelector('[data-loading]')
const currentLocationBtn = document.querySelector('[data-current-location-btn]');
const errorContent = document.querySelector('[data-error-content]');


/**
 * 
 * @param {number} lat Latitude
 * @param {number} lon Longitude
 */
export const updateWeather = async function (lat, lon) {

  loading.style.display = 'grid';
  container.style.overflowY = 'hidden';
  container.classList.remove('fade-in');
  errorContent.style.display = 'none';

  const currentWeatherSection = document.querySelector('[data-current-weather]');
  const highlightSection = document.querySelector('[data-highlights]');
  const hourlySection = document.querySelector('[data-hourly-forecast]');
  const forecastSection = document.querySelector('[data-5-day-forecast]');

  currentWeatherSection.innerHTML = '';
  highlightSection.innerHTML = '';
  hourlySection.innerHTML = '';
  forecastSection.innerHTML = '';

  if (window.location.hash === '#/current-location') {
    currentLocationBtn.setAttribute('disabled', '')
  } else {
    currentLocationBtn.removeAttribute('disabled')
  }


  //////////////////////////
  // CURRENT WEATHER SECTION 
  const currentWeather = await fetchData(url.currentWeather(lat, lon))

  const [{ name, country }] = await fetchData(url.reverseGeo(lat, lon))

  // console.log(currentWeather);

  const {
    weather,
    dt: dateUnix,
    sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC },
    main: { temp, feels_like, pressure, humidity },
    visibility,
    timezone
  } = currentWeather

  const [{ description, icon }] = weather;

  const cardCurrentWeather = document.createElement('div');
  cardCurrentWeather.classList.add('card', 'card-lg', 'current-weather-card');

  cardCurrentWeather.innerHTML = `
    <h2 class="title-2 card-title">Now</h2>

    <div class="weapper">

      <p class="heading">${parseInt(temp)}&deg;<sup>c</sup></p>
      <img src="./app/icons/${icon}.png" width="64" height="64" alt="${description}" class="weather-icon">

    </div>

    <p class="body-3">${description}</p>

    <ul class="meta-list">
      <li class="meta-item">
        <span class="m-icon">
          <i class="fa-regular fa-calendar fa-lg" style="color: #f4f4f4;">
          </i>
        </span>
        <p class="title-3 meta-text">
          ${module.getDate(dateUnix, timezone)}
        </p>
      </li>

      <li class="meta-item">
        <span class="m-icon">
          <i class="fa-solid fa-location-dot fa-xl" style="color:  #f4f4f4;">
          </i>
        </span>
        <p class="title-3 meta-text
        data-location">${name}, ${country}</p>
      </li>
    </ul>
  `;

  currentWeatherSection.appendChild(cardCurrentWeather);



  //////////////////////////
  // TODAY'S HIGHLIGHTS
  const airPollution = await fetchData(url.airPollution(lat, lon));

  const [{
    main: { aqi },
    components: { no2, o3, so2, pm2_5 },
  }] = airPollution.list;

  const cardHighlights = document.createElement('div');
  cardHighlights.classList.add('card', 'card-lg');

  cardHighlights.innerHTML = `
  <h2 class="title-2" id="highlights-label">
  Today's Highlights
  </h2>

  <div class="highlight-list">

  <div class="card card-sm highlight-card one">

    <h3 class="title-3">
      Air Quality Index
    </h3>

    <div class="wrapper">
      <span class="m-icon">
        <img src="./app/icons/wind.png" alt="wind" width="32" height="32">
      </span>

      <ul class="card-list">

        <li class="card-item">
          <p class="title-1">${pm2_5.toPrecision(3)}</p>
          <p class="label-1">
            PM<sub>2.5</sub>
          </p>
        </li>

        <li class="card-item">
          <p class="title-1">${so2.toPrecision(3)}</p>
          <p class="label-1">
            50<sub>2</sub>
          </p>
        </li>

        <li class="card-item">
          <p class="title-1">${no2.toPrecision(3)}</p>
          <p class="label-1">
            NO<sub>2</sub>
          </p>
        </li>

        <li class="card-item">
          <p class="title-1">${o3.toPrecision(3)}</p>
          <p class="label-1">
            O<sub>3</sub>
          </p>
        </li>

      </ul>
    </div>

    <span class="badge aqi-${aqi} label-${aqi}" title="${module.aqiText[aqi].message}">${module.aqiText[aqi].level}
    </span>

  </div>

  <div class="card card-sm highlight-card two">
    <h3 class="title-3">Sunrise & Sunset</h3>

    <div class="card-list">
      <div class="card-item">
        <span class="m-icon">
          <img src="./app/icons/sunrise.png" alt="sunrise" width="50" height="50">
        </span>
        <div>
          <p class="label-1">Sunrise</p>
          <p class="title-1">${module.getTime(sunriseUnixUTC, timezone)}</p>
        </div>
      </div>

      <div class="card-item">
        <span class="m-icon">
          <img src="./app/icons/sunset.png" alt="sunset" width="50" height="50">
        </span>
        <div>
          <p class="label-1">Sunset</p>
          <p class="title-1">${module.getTime(sunsetUnixUTC, timezone)}</p>
        </div>
      </div>
    </div>

  </div>

  <div class="card card-sm highlight-card">
    <h3 class="title-3">Humidity</h3>
    <div class="wrapper">
      <span class="m-icon">
        <img src="./app/icons/humidity.png" alt="humidity" width="32" height="32">
      </span>
      <p class="title-1">
        ${humidity}<sub>%</sub>
      </p>
    </div>
  </div>

  <div class="card card-sm highlight-card">
    <h3 class="title-3">Pressure</h3>
    <div class="wrapper">
      <span class="m-icon">
        <img src="./app/icons/haze.png" alt="pressure" width="32" height="32">
      </span>
      <p class="title-1">
        ${pressure}<sub>hPa</sub>
      </p>
    </div>
  </div>

  <div class="card card-sm highlight-card">
    <h3 class="title-3">Visibility</h3>
    <div class="wrapper">
      <span class="m-icon">
        <img src="./app/icons/visibility.png" alt="visibility" width="32" height="32">
      </span>
      <p class="title-1">
        ${visibility / 1000}<sup>km</sup>
      </p>
    </div>
  </div>

  <div class="card card-sm highlight-card">
    <h3 class="title-3">Feels Like</h3>
    <div class="wrapper">
      <span class="m-icon">
        <img src="./app/icons/thermometer .png" alt="feels like" width="32" height="32">
      </span>
      <p class="title-1">
        ${parseInt(feels_like)}&deg;<sup>c</sup>
      </p>
    </div>
  </div>

</div>
  `;

  highlightSection.appendChild(cardHighlights);


  //////////////////////////
  // 24H FORECAST SECTION
  const forecast = await fetchData(url.forecast(lat, lon));

  const {
    list: forecastList,
    city: { timezoneForecast },
  } = forecast;

  hourlySection.innerHTML = `
    <h2 class="title-2">Today at</h2>

    <div class="slider-container">
      <ul class="slider-list" data-temp></ul>

      <ul class="slider-list" data-wind></ul>
    </div>
  `;

  forecastList.forEach((data, index) => {
    if (index > 7) return;

    const {
      dt: dateTimeUnix,
      main: { temp },
      weather,
      wind: { deg: windDirection, speed: windSpeed }
    } = data;

    const [{ icon, description }] = weather;

    const tempLi = document.createElement('li');
    tempLi.classList.add('slider-item');

    tempLi.innerHTML = `
    <div class="card card-sm slider-card">
      <p class="body-3">
        ${module.getHours(dateTimeUnix, timezone)}
      </p>
      <img
          src="/app/icons/${icon}.png" alt="${description}"
          width="48"
          height="48"
          loading="lazy"
          class="weather-icon"
          title="${description}">
      <p class="body-3">${parseInt(temp)}&deg;</p>
    </div>
    `;

    hourlySection.querySelector('[data-temp]').appendChild(tempLi);

    const windLi = document.createElement('li');
    windLi.classList.add('slider-item');

    windLi.innerHTML = `
    <div class="card card-sm slider-card">
      <p class="body-3">${module.getHours(dateTimeUnix, timezone)}</p>
      <img
          src="/app/icons/direction.png" alt="overcast clouds"
          width="48"
          height="48"
          loading="lazy"
          class="weather-icon"
          style="transform: rotate(${windDirection - 180}deg)"
          title="overcast clouds">
      <p class="body-3">${parseInt(module.mps_to_kmh(windSpeed))} km/h</p>
    </div>
    `;

    hourlySection.querySelector('[data-wind]').appendChild(windLi);


    //////////////////////////
    // 5 DAY FORECAST SECTION
    forecastSection.innerHTML = `
    <h2 class="title-2" id="forecast-label">
      5 Days Forecast
    </h2>

    <div class="card card-lg forecast-card">
      <ul data-forecast-list></ul>
    </div>
  `;


    for (let i = 7, len = forecastList.length; i < len; i += 8) {

      const {
        main: { temp_max },
        weather,
        dt_txt
      } = forecastList[i];

      const [{ icon, description }] = weather;
      const date = new Date(dt_txt);

      const li = document.createElement('li');
      li.classList.add('card-item');

      li.innerHTML = `
      <p class="label-1">${date.getDate()} ${module.monthNames[date.getUTCMonth()]}</p>
      <div class="icon-wrapper">
        <img
             src="./app/icons/${icon}.png"
             width="36"
             height="36"
             alt="${description}" 
             class="weather-icon"
             title="${description}">
        <span class="title-2">
        ${parseInt(temp_max)}&deg;
        </span>
      </div>
      <p class="label-1">${module.weekDayNames[date.getUTCDay()]}</p>
      `;

      forecastSection.querySelector('[data-forecast-list]').appendChild(li);

    }

    loading.style.display = 'none';
    container.style.overflowY = 'overlay';
    container.classList.remove('fade-in');

  });
};


export const error404 = () => errorContent.style.display = 'flex';