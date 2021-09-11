const hour_text = document.querySelector('.hour');

generateWeather('Warszawa').then(response => {
  setInterval(function () {showTime(response,hour_text)}, 1000);
});

function showTime(response,hour_text) {
  let today = calculateTime(response.timezone);
  hour_text.innerHTML = today.toLocaleTimeString();
}

function calculateTime(offset) {
  let today = new Date();
  let utc = today.getTime() + (today.getTimezoneOffset() * 60000);
  let newDate = new Date(utc + (3600000 * (offset / 3600)));

  return newDate
}

async function generateWeather(city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=182090554f2a3753ab4e05f6b5343b36`, {mode: 'cors'})
  const weather = await response.json();
  
  return weather
}

