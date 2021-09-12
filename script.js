// to hide API key
import WEATHER_API_KEY from "./config.js";

const search_btn          =             document.querySelector('.search');
const search_input        =             document.querySelector('.city-input');
 
const date_text           =             document.querySelector('.date');
const degrees_text        =             document.querySelector('.degrees');
const location_text       =             document.querySelector('.location');
const desc_text           =             document.querySelector('.desc');
const type_degree         =             document.querySelector('.degree-type');
let   degree_value        =             "";       

const forecast_container  =             document.querySelector('.forecast-container');

// created to delete unnecessary intervals
let interval_id = "";
window.onload = requestCall('London');

search_btn.addEventListener('click', async () => {
  if(search_input.value === ""){
    return
  }

  await requestCall(search_input.value);
});

search_input.addEventListener('keypress', async (e) => {
  if(search_input.value === ""){
    return
  }

  if(e.key === 'Enter') {
    await requestCall(search_input.value);
  }
});

type_degree.addEventListener('click', () => {
  if(type_degree.checked) {
    changeDegreeType('Fahrenheit')
  } else {
    changeDegreeType('Celcius')
  }
});

function changeDegreeType(type) {
  const day_temp = document.querySelectorAll('.forecast-temp');
  day_temp.forEach(element => {
    let re = /\d+/
    let value = element.innerHTML.match(re);
    element.innerHTML = convertCelciusFahrenheit(value[0], type);
  });
  degrees_text.innerHTML = converTemp(degree_value, type);
}

function showTime(response, date_text) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  
  let today = calculateTime(response.city.timezone);
  date_text.innerHTML = `${weekday[today.getDay()]}, ${today.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
}

function calculateTime(offset) {
  let today = new Date();
  let utc = today.getTime() + (today.getTimezoneOffset() * 60000);
  let newDate = new Date(utc + (3600000 * (offset / 3600)));

  return newDate
}

function getShortDay(dayID) {
  const weekday = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
  ];

  return weekday[dayID];
}

function converTemp(value, type) {
  if(type == "Celcius") {
    value = value - 273.15;
    return `${Math.ceil(value)}\xB0C`

  } else if(type == "Fahrenheit") {
    value = ((value - 273.15) * 1.8) + 32;
    return `${Math.ceil(value)}\xB0F`
  
  } else {
    return `${Math.ceil(value)} K`
  
  }
}

function convertCelciusFahrenheit(value, type) {
  if(type == "Fahrenheit"){
    return `${Math.ceil((value * 1.8) + 32)}\xB0F`;
  }
  return `${Math.ceil((value - 32) * (5 / 9))}\xB0C`
}

async function generateWeather(city) {
    let responseForecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${WEATHER_API_KEY}`, {mode: 'cors'});
    let forecast = await responseForecast.json();

    return forecast
}

// to set delay
const sleep = m => new Promise(r => setTimeout(r, m))

async function requestCall (cityName) {
  let responseForecast = await generateWeather(cityName);
  if (responseForecast.cod == 404) {
    alert(responseForecast.message);
    search_input.value = "";
    const search = document.querySelector('.search-container');
    let default_shadow = search.style.boxShadow;
    search.style.boxShadow = "0px 0px 10px 3px rgba(255,0,0,0.5)";
    await sleep(2000);
    search.style.boxShadow = default_shadow;
    return
  }
  console.log(responseForecast);
  if(interval_id != ""){
    window.clearInterval(interval_id);
  }

  interval_id = window.setInterval(function () {showTime(responseForecast, date_text)}, 1000);  
  
  degrees_text.checked = true;
  degree_value = responseForecast.list[0].main.temp;
  degrees_text.innerHTML = converTemp(responseForecast.list[0].main.temp, "Celcius");
  
  desc_text.innerHTML = responseForecast.list[0].weather[0].description;
  // to recognize country name
  let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
  location_text.innerHTML = `${responseForecast.city.name}, ${regionNames.of(responseForecast.city.country)}`;
  
  search_input.value = "";

  forecast_container.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    let day = document.createElement('div');
    day.classList.add('weather-day');
    day.innerHTML = `
    <p class="forecast-day"></p>
    <img src="">
    <p class="forecast-temp"></p>`;

    let icon     = day.getElementsByTagName('img')[0];
    let day_name = day.getElementsByTagName('p')[0];
    let temp     = day.getElementsByTagName('p')[1];

    // multiple by 8 because that's full 24h change from API
    day_name.innerHTML = getShortDay(new Date(responseForecast.list[i*8].dt_txt).getDay());
    icon.src = `icons/${responseForecast.list[i*8].weather[0].icon}.png`
    temp.innerHTML = converTemp(responseForecast.list[i*8].main.temp, 'Celcius')

    forecast_container.appendChild(day);
  }

}
