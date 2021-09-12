// to hide API key
import WEATHER_API_KEY from "./config.js";

const search_btn    =             document.querySelector('.search');
const search_input  =             document.querySelector('.city-input');

const date_text     =             document.querySelector('.date');
const degrees_text  =             document.querySelector('.degrees');
const location_text =             document.querySelector('.location');
const desc_text     =             document.querySelector('.desc');
const type_degree   =             document.querySelector('.degree-type');
let   degree_value  =             "";       

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
    degrees_text.innerHTML = converTemp(degree_value, "Fahrenheit");
  } else {
    degrees_text.innerHTML = converTemp(degree_value, "Celcius");
  }
});

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
  
  let today = calculateTime(response.timezone);
  date_text.innerHTML = `${weekday[today.getDay()]}, ${today.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
}

function calculateTime(offset) {
  let today = new Date();
  let utc = today.getTime() + (today.getTimezoneOffset() * 60000);
  let newDate = new Date(utc + (3600000 * (offset / 3600)));

  return newDate
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

async function errorHandle() {

}

async function generateWeather(city) {
  try {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}`, {mode: 'cors'});
    let weather = await response.json().catch();
    
    return weather
  } catch (error) {
    return error
  }
}

// to set delay
const sleep = m => new Promise(r => setTimeout(r, m))

async function requestCall (cityName) {
  let response = await generateWeather(cityName);
  
  if (response.cod == 404) {
    console.error(response.message);
    search_input.value = "";
    const search = document.querySelector('.search-container');
    let default_shadow = search.style.boxShadow;
    search.style.boxShadow = "0px 0px 10px 3px rgba(255,0,0,0.5)";
    await sleep(2000);
    search.style.boxShadow = default_shadow;
    return
  }

  if(interval_id != ""){
    window.clearInterval(interval_id);
  }

  interval_id = window.setInterval(function () {showTime(response, date_text)}, 1000);  
  
  degrees_text.checked = true;
  degree_value = response.main.temp;
  degrees_text.innerHTML = converTemp(response.main.temp, "Celcius");
  
  desc_text.innerHTML = response.weather[0].description;
  // to recognize country name
  let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
  location_text.innerHTML = `${response.name}, ${regionNames.of(response.sys.country)}`;
  
  search_input.value = "";
}
