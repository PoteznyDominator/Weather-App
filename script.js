const date_text =                document.querySelector('.date');
const degrees_text =             document.querySelector('.degrees');
const location_text =            document.querySelector('.location');
const desc_text =                document.querySelector('.desc');
const type_degree =              document.querySelector('.degree-type');

generateWeather('warszawa').then(response => {
  setInterval(function () {showTime(response, date_text)}, 1000);

  type_degree.addEventListener('click', () => {
    if(type_degree.checked) {
      degrees_text.innerHTML = converTemp(response.main.temp, "Fahrenheit");
    } else {
      degrees_text.innerHTML = converTemp(response.main.temp, "Celcius");
    }
  });
  degrees_text.checked = true;
  degrees_text.innerHTML = converTemp(response.main.temp, "Celcius");
  desc_text.innerHTML = response.weather[0].description;
  // to recognize country name
  let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
  location_text.innerHTML = `${response.name}, ${regionNames.of(response.sys.country)}`;
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

async function generateWeather(city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=182090554f2a3753ab4e05f6b5343b36`, {mode: 'cors'})
  const weather = await response.json();
  
  return weather
}

