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

  // loading.style.display = 'grid';
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

  console.log(currentWeather);

  const {
    weather,
    dt: dateUnix,
    sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC },
    main: { temp, feels_like, pressure, humidity },
    visibility,
    timezone
  } = currentWeather

  const [{ description, icon }] = weather;

  const card = document.createElement('div');
  card.classList.add('card', 'card-lg', 'current-weather-card');

  card.innerHTML = `
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

  currentWeatherSection.appendChild(card);

};


export const error404 = function () { };