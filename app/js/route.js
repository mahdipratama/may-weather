'use strict'

import { updateWeather, error404 } from './app.js';


const defaultLocation = '#/weather?lat=-3.4023388&lon=104.2744922' // Prabumulih

// Geolocation
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const currentLocation = async function () {
  try {
    const position = await getPosition()
    const { latitude: lat, longitude: lon } = position.coords;

    updateWeather(`lat=${lat}`, `lon=${lon}`);

  } catch (err) {
    window.location.hash = defaultLocation;
  };
};

const searchLocation = query => updateWeather(...query.split('&'));
// updateWeather("lat=51.5073", "lon=-0.1276474")

const routes = new Map([
  ['/current-location', currentLocation],
  ['/weather', searchLocation]
]);

const checkHash = function () {
  const requestURL = window.location.hash.slice(1);

  // Split the request URL into a route and a query string (if present)
  const [route, query] = requestURL.includes ? requestURL.split('?') : [requestURL]

  // Look up the corresponding function to handle the route
  if (routes.get(route)) {
    // Call the function with the query string as its argument
    routes.get(route)(query);
  } else {
    // Call the error404 function if the route is not found
    error404();
  }
}

window.addEventListener('hashchange', checkHash);

window.addEventListener('load', function () {
  if (!window.location.hash) {
    window.location.hash = '#/current-location'
  } else {
    checkHash();
  }
})


/*
'route.js' is to define the routes for the Weather App and handle the logic for navigating between different pages based on the current URL hash. Here's an overview of what each part of the code does:

+ 'import { updateWeather, error404 } from "./app.js";:' 
   Imports two functions from another file, app.js. updateWeather() is used to update the weather data based on a given query, while error404() is used to display an error page when an invalid URL is requested.


+ 'const defaultLocation = '#/weather?lat=51.5073219&lon=-0.1276474' // London:' 
   Defines a default location for the app to display weather information for when no other location is specified. In this case, it's set to London.


+ 'const currentLocation = function () { ... }:' 
   Defines a function that gets the current location of the user and updates the weather data for that location using the updateWeather() function. If the user denies location access, it falls back to the default location.


+ 'const searchedLocation = query => updateWeather(...query.split('&'));:'
   Defines a function that updates the weather data based on a given query, which should be in the format lat=<latitude>&lon=<longitude>. The query.split('&') method converts the query string into an array of two values, which are then spread into the updateWeather() function.


+ 'const routes = new Map([...]):'
   Defines a map of routes for the app, where each key is a URL path and each value is a function to handle that path. The /current-location path maps to the currentLocation() function, while the /weather path maps to the searchedLocation() function.
   The query variable is defined as a parameter in the searchedLocation function.

   This function is called with query passed as an argument when the URL hash contains a string starting with /weather, as in #/weather?lat=51.5073&lon=-0.1276474.

   In this case, the query variable is set to the string lat=51.5073&lon=-0.1276474, which is obtained by splitting the hash string on the ? character and taking the second part. The split() method returns an array with two elements, and the spread operator ... is used to pass these two elements as separate arguments to the updateWeather() function.


+ The checkHash function reads the current hash fragment
  from the URL, splits it into a route and a query string (if present), and looks up the corresponding function to handle the route from the routes map. If the route is found, the function is called with the query string as its argument. If the route is not found, the error404 function is called.


+ The window.addEventListener('hashchange', checkHash)
  attaches an event listener to the hashchange event of the window object. Whenever the hash fragment of the URL changes, this event is fired, and the checkHash function is called.


+ The window.addEventListener('load', function () {...}) 
  attaches an event listener to the load event of the window object. This event is fired when the page has finished loading, including all resources like images and scripts. The function checks if there is a hash fragment in the URL, and if not, it sets the hash fragment to #/current-location. Otherwise, it calls the checkHash function to process the current hash fragment.
*/