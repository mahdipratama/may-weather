const WEATHER_API = 'https://api.weatherapi.com/v1/current.json?key=5496df2b6a93400cb0952759232503'
// const WEATHER_MAP_API = 'https://api.openweathermap.org/data/2.5/weather?q='
const WEATHER_MAP_API_CURRENT = 'https://api.openweathermap.org/data/2.5/weather?'
const WEATHER_MAP_API_HOURLY = 'https://pro.openweathermap.org/data/2.5/forecast/hourly?'

const WEATHER_MAP_API_KEY = '6717f6f86640f48b045c6df37d3ec6a2'

// Geolocation
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    // navigator.geolocation.getCurrentPosition(
    //   position => resolve(position),
    //   err => reject(err)
    // );
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};


const currentWeatherAPI = async function (location) {
  try {

    // Geolocation
    const position = await getPosition()
    const { latitude: lat, longitude: lon } = position.coords

    // Current Weather
    // const response = await fetch(`${WEATHER_API}&q=${location}`)
    // const response = await fetch(`${WEATHER_MAP_API}${location}&appid=${WEATHER_MAP_API_KEY}`)
    const currentResponse = await fetch(`${WEATHER_MAP_API_CURRENT}lat=${lat}&lon=${lon}&appid=${WEATHER_MAP_API_KEY}`)
    console.log(currentResponse);

    if (!currentResponse.ok) throw new Error('Error GETTING data')

    const currentData = await currentResponse.json();
    console.log(currentData);


    const hourlyResponse = await fetch(`${WEATHER_MAP_API_HOURLY}lat=${lat}&lon=${lon}&appid=${WEATHER_MAP_API_KEY}`)
    console.log(hourlyResponse);

    if (!hourlyResponse.ok) throw new Error('Error GETTING data')

    const hourlyData = await hourlyResponse.json();
    console.log(hourlyData);



  } catch (error) {
    console.error(error);
  }

}
currentWeatherAPI('prabumulih');




// getPosition().then(position => console.log(position));

// const whereAmI = function () {
//   getPosition()
//     .then(position => {
//       const { latitude: lat, longitude: lng } = position.coords;
//       return fetch(`https://geocode.xyz/${lat},${lng}?json=1`);
//     })
//     .then(response => {

//       if (!response.ok) {
//         throw new Error(
//           `Hang a second and Try Again! Error (${response.status}) `
//         );
//       }

//       return response.json();
//     })
//     .then(data => {
//       console.log(data);
//       console.log(`You are in ${data.city}, ${data.country}`);

//       return fetch(`https://restcountries.com/v2/name/${data.country}`); //
//     })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error(`Country not found (${response.status}) `);
//       }

//       return response.json();
//     })
//     .then(data => {
//       console.log(data);
//       renderCountry(data[0]);
//     })
//     .catch(err => {
//       console.error(`${err}💥`);
//       // renderError(`${err.message}`)
//     })
//     .finally(() => {
//       countriesContainer.style.opacity = 1;
//     });
// };

// btn.addEventListener('click', whereAmI);


// const apiCall = async function () {
//   try {
//     const data = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Prabumulih&appid=6717f6f86640f48b045c6df37d3ec6a2'
//     )
//     console.log(data);

//     const response = await data.json();
//     console.log(response);

//   } catch {

//   }

// }

// apiCall();


// const WEATHER_API = 'https://api.weatherapi.com/v1/current.json?key=5496df2b6a93400cb0952759232503'
// const WEATHER_MAP_API = 'api.openweathermap.org/data/2.5/weather?q='
// const WEATHER_MAP_API_KEY = '6717f6f86640f48b045c6df37d3ec6a2'

// const currentWeatherAPI = async function (location) {
//   try {
//     // const response = await fetch(`${WEATHER_API}&q=${location}`)
//     // const response = await fetch(`${WEATHER_MAP_API}${location}&APPID=${WEATHER_MAP_API_KEY}`)
//     const response = await fetch(`api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=6717f6f86640f48b045c6df37d3ec6a2`)
//     console.log(response);

//     if (!response.ok) throw new Error('Error GETTING data')

//     const data = await response.json();
//     console.log(data);

//   } catch (error) {
//     console.error(error);
//   }

// }

// currentWeatherAPI('prabumulih'); 