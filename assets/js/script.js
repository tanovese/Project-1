var startTime;
var today = dayjs().format('YYYY-MM-DD');
const apiKey = 'c65a83f1b41423a44ca059c4924fe1cd';
const applicationId = "2783890d-6a79-4a53-85ea-a093142ad152";
const applicationSecret = "31acc37032ad69c4d5f7928586e995f9f30116465cf5dbc9669b235b5d71362584d5ba854089cc09e823e2052b7d0b4d2a30ed06d6e1ca2bf2995fcfae759c8f8004d66ad88d304c3219be628bf106d4f2a6ccd2e52fa416d1d575ddeb9e87d9536f373b6af2e372b0f92e7a1f6478ed";
const authString = btoa(`${applicationId}:${applicationSecret}`);
const url = "https://api.astronomyapi.com/api/v2/studio/";
const submitButton = document.getElementById('show-charts-button');
const starChartEL = document.getElementById('star-chart');
const moonPhaseEl = document.getElementById('moon-phase');

var inputs = {
  city: '',
  state: '',
  country: '',
  latitude: '',
  longitude: '',
  date: today,
}

const dateInput = document.getElementById('date');
dateInput.min = today;
dateInput.max = dayjs().add(16, 'days').format("YYYY-MM-DD");

if (location.search !== '') {
  var searchString = location.search + '&';
  for (var i in inputs) {
    const inputString = i + '=';
    const startIndex = searchString.indexOf(inputString) + inputString.length;
    const ampIndex = searchString.indexOf('&');
    inputs[i] = searchString.slice(startIndex, ampIndex);
    searchString = searchString.slice(ampIndex + 1);
    console.log(i, inputs[i]);
    if ((i === 'latitude' || i === 'longitude') && inputs[i] !== '') {
      inputs[i] = parseFloat(inputs[i]);
    }
  }
  loadInputs();
  if (inputs.latitude === '' || inputs.longitude === '') {
    locationToCoordinates(formatLocationString());
  }
  else {
    loadWeatherAndCharts();
  }
  setLocalStorage();
}
else {
  var localStorageInfo = localStorage.getItem('stargazing-info');
  if (localStorageInfo !== null) {
    inputs = JSON.parse(localStorageInfo);

    const dateDiff = dayjs(inputs.date).diff(dayjs(), 'days');
    if (dateDiff < 0) {
      inputs.date = today;
      setLocalStorage();
    }
    loadInputs();
    if(inputs.latitude === '' || inputs.longitude === '') {
      locationToCoordinates(formatLocationString());
    }
    else {
      loadWeatherAndCharts();
    }
  }
}

function loadInputs() {
  for (var i in inputs) {
    var elem = document.getElementById(i);
    if (i === 'city')
      elem.value = changePlustoSpace(inputs[i]);
    else
      elem.value = inputs[i];
  }
}

function setLocalStorage() {
  localStorage.setItem('stargazing-info', JSON.stringify(inputs));
}

function formatLocationString() {
  var locationString = '';
  if (inputs.city !== '')
    locationString += inputs.city;
  if (inputs.state !== '')
    locationString += ',' + inputs.state;
  if (inputs.country !== '')
    locationString += ',' + inputs.country;
  return locationString;
}

async function locationToCoordinates(locationString) {
  await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${locationString}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      inputs.latitude = data[0].lat;
      inputs.longitude = data[0].lon;
      loadWeatherAndCharts();
    })
    .catch(error => console.log(error));
}

function loadWeatherAndCharts() {
  displayMap(inputs.latitude, inputs.longitude);
  getFiveDayForecast(inputs.latitude, inputs.longitude);
  fetchStarChart();
  fetchMoonPhase();
}

function displayMap(lat, lon) {
  console.log(lat, lon);
    // Create a Leaflet map centered on the location
  const map = L.map('map').setView([lat, lon], 9);
  // Add a tile layer to the map 
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map);
   // Add a tile layer for the cloud layer 
  var cloudLayer = L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`,
    {
      attribution: '',
      filter: [
        'brightness:80%',
        'contrast:100%',
        'saturate:100%',
        'hue:270deg',
        'sepia:100%',
        'opacity:1.0'
      ],
    }
  ).addTo(map);
  // Add tile layer for precipitation   
  var precipitationLayer = L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
    opacity: 1,
    attribution: '<a href="https://openweathermap.org/">OpenWeatherMap</a>',
  }).addTo(map);
  // Add a marker to the map at the location
  L.marker([lat, lon]).addTo(map);
  fetchStarChart();
}

async function fetchStarChart() {
  submitButton.disabled = true;

  const starOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${authString}`,
    },
    body: JSON.stringify({
      "style": "default",
      "observer": {
        "latitude": inputs.latitude,
        "longitude": inputs.longitude,
        "date": inputs.date
      },
      "view": {
        "type": "area",
        "parameters": {
          "position": {
            "equatorial": {
              "rightAscension": 0,
              "declination": 0
            }
          },
          "zoom": 4
        }
      }
    })
  };
  console.log(starOptions.body);
  const starUrl = url + 'star-chart';
  startTime = new Date();
  console.log('timer started');
  starChartEL.src = "assets/images/star-loading.gif";
  await fetch(starUrl, starOptions)
    .then((response) => response.json())
    .then((responseData) => displayStarChart(responseData.data))
    .catch(error => console.log(error));;
}

async function fetchMoonPhase() {
  const moonOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${authString}`,
    },
    body: JSON.stringify({
      "format": "png",
      "style": {
        "moonStyle": "default",
        "backgroundStyle": "stars",
        "backgroundColor": "red",
        "headingColor": "white",
        "textColor": "white"
      },
      "observer": {
          "latitude": inputs.latitude,
          "longitude": inputs.longitude,
          "date": inputs.date
      },
      "view": {
        "type": "portrait-simple",
        "orientation": "south-up"
      }
    })
  }
  const moonUrl = url + "moon-phase";
  moonPhaseEl.src = "assets/images/moon-loading.gif";
  await fetch(moonUrl, moonOptions)
    .then((response) => response.json())
    .then((responseData) => displayMoon(responseData.data))
    .catch(error => console.log(error));
   submitButton.disabled = false;
}

function displayStarChart(data) {
  console.log((new Date() - startTime)/1000); // display time to load chart
  console.log(data);
  console.log(data.imageUrl);
  starChartEL.src = data.imageUrl;
}

function displayMoon(data) {
  console.log(data);
  console.log(data.imageUrl);
  moonPhaseEl.src = data.imageUrl;
}

function changePlustoSpace(inputString) {
  while (inputString.indexOf('+') >= 0) {
    var idx = inputString.indexOf('+');
    inputString = inputString.slice(0, idx) + ' ' + inputString.slice(idx + 1);
  }
  return inputString.trim();
}

async function getFiveDayForecast(lat, lon) {
  await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      forecastData = data;
      makeCurrentWeatherCard();
      getWeatherDays();
    })
}

function makeCurrentWeatherCard() {
  console.log(forecastData);
  var currWeatherCard = document.getElementById('currWeatherCard');
  var sunrise = dayjs((forecastData.city.sunrise) * 1000).format('h:mma');
  var sunset = dayjs((forecastData.city.sunset) * 1000).format('h:mma');
  var currWeatherDate = dayjs((forecastData.list[0].dt) * 1000).format('MM/DD/YYYY');
  var currWeatherIcon = forecastData.list[0].weather[0].icon;
  var currWeatherDesc = forecastData.list[0].weather[0].description;
  var currWeatherHumidity = forecastData.list[0].main.humidity;
  var currWeatherWind = Math.round(forecastData.list[0].wind.speed);
  var currWeatherTemp = Math.round(forecastData.list[0].main.temp);
  var currWeatherLow = Math.round(forecastData.list[0].main.temp_min);
  var currWeatherHigh = Math.round(forecastData.list[0].main.temp_max);
  var lgWeatherTitleEl = document.createElement("h2");
  var lgWeatherIconEl = document.createElement("img");
  var lgWeatherTempEl = document.createElement("p");
  var lgWeatherHighLowEl = document.createElement("p");
  var lgWeatherHighLowSpanEl = document.createElement("span");
  var lgWeatherHumidEl = document.createElement("p");
  var lgWeatherWindEl = document.createElement("p");
  var lgWeatherDescEl = document.createElement("p");
  var lgSunriseSunsetEl = document.createElement("div");
  var lgWeatherSunriseEl = document.createElement("p");
  var lgWeatherSunsetEl = document.createElement("p");

  lgWeatherTitleEl.textContent = currWeatherDate;
  //lgWeatherIconEl.textContent = currWeatherIcon;
  lgWeatherTempEl.textContent = `Temp:\u00A0\u00A0${currWeatherTemp}\u00A0\u00B0F`;
  lgWeatherHighLowEl.textContent = `High/Low:\u00A0\u00A0${currWeatherHigh}\u00B0F`;
  lgWeatherHighLowSpanEl.textContent = `\u00A0/\u00A0${currWeatherLow}\u00B0F`;
  lgWeatherHumidEl.textContent = `Humidity:\u00A0\u00A0${currWeatherHumidity}%`;
  lgWeatherWindEl.textContent = `Wind Speed:\u00A0\u00A0${currWeatherWind}\u00A0mph`;
  lgWeatherDescEl.textContent = `Summary:\u00A0\u00A0${currWeatherDesc}`;
  lgWeatherSunriseEl.textContent = `Sunrise:\u00A0\u00A0${sunrise}`;
  lgWeatherSunsetEl.textContent = `Sunset:\u00A0\u00A0${sunset}`;

  lgWeatherIconEl.setAttribute("src", "http://openweathermap.org/img/w/" + currWeatherIcon + ".png");
  lgWeatherIconEl.setAttribute("class", "card-icons");
  lgSunriseSunsetEl.setAttribute("class", "sunrise-sunset");

  currWeatherCard.append(lgWeatherTitleEl);
  currWeatherCard.append(lgWeatherIconEl);
  currWeatherCard.append(lgWeatherTempEl);
  lgWeatherHighLowEl.append(lgWeatherHighLowSpanEl);
  currWeatherCard.append(lgWeatherHighLowEl);
  currWeatherCard.append(lgWeatherHumidEl);
  currWeatherCard.append(lgWeatherWindEl);
  currWeatherCard.append(lgWeatherDescEl);
  currWeatherCard.append(lgWeatherSunriseEl);
  currWeatherCard.append(lgWeatherSunsetEl);

  currWeatherCard.setAttribute("class", "largecards-div");
}

function getWeatherDays() {
  var forecastObj = forecastData.list;
  weatherDays = [];
  for (i = 0; i < (forecastObj).length; i++) {
    var fullTextDate = forecastObj[i].dt_txt;
    console.log(fullTextDate);
    var textArray = fullTextDate.split(" ");
    var dayDate = textArray[0];
    var dayHours = textArray[1];
    if (dayHours === '21:00:00') {
      weatherDays.push(forecastObj[i]);
      console.log(weatherDays, dayDate, dayHours)
    }
  }
  makeForecastCards();
}

function makeForecastCards() {
  var smallWeatherCard = document.getElementById('smallWeatherCards');
  for (i = 0; i < weatherDays.length; i++) {
    var smallWeatherDate = dayjs(((weatherDays[i].dt) * 1000)+12960).format('MM/DD/YYYY'); //9pm date-time second upd +1 day(86400)- 20 hrs(72000) - 4 hrs utc adj(14400)
    var smallWeatherIcon = weatherDays[i].weather[0].icon;
    var smallWeatherDesc = weatherDays[i].weather[0].description;
    var smallWeatherHumidity = weatherDays[i].main.humidity;
    var smallWeatherWind = Math.round(weatherDays[i].wind.speed);
    var smallWeatherTemp = Math.round(weatherDays[i].main.temp);
    var smallWeatherDivEl = document.createElement("div");
    var smWeatherTitleEl = document.createElement("h3");
    var smWeatherSubtitleEl = document.createElement("p");
    var smWeatherIconEl = document.createElement("img");
    var smWeatherTempEl = document.createElement("p");
     var smWeatherHumidEl = document.createElement("p");
    var smWeatherWindEl = document.createElement("p");
    var smWeatherDescEl = document.createElement("p");

    smWeatherTitleEl.textContent = smallWeatherDate;
    smWeatherSubtitleEl.textContent = "Forecasted";
    smWeatherTempEl.textContent = `Temp:\u00A0\u00A0${smallWeatherTemp}\u00A0\u00B0F`;
    smWeatherHumidEl.textContent = `Humidity:\u00A0\u00A0${smallWeatherHumidity}%`;
    smWeatherWindEl.textContent = `Wind Speed:\u00A0\u00A0${smallWeatherWind}\u00A0mph`;
    smWeatherDescEl.textContent = `Summary:\u00A0\u00A0${smallWeatherDesc}`;

    smWeatherIconEl.setAttribute("src", "http://openweathermap.org/img/w/" + smallWeatherIcon + ".png");
    smWeatherIconEl.setAttribute("class", "card-icons");
    smWeatherSubtitleEl.setAttribute("class", "smcard-subtitle");

    smallWeatherDivEl.append(smWeatherSubtitleEl);
    smallWeatherDivEl.append(smWeatherTitleEl);
    smallWeatherDivEl.append(smWeatherIconEl);
    smallWeatherDivEl.append(smWeatherTempEl);
    smallWeatherDivEl.append(smWeatherHumidEl);
    smallWeatherDivEl.append(smWeatherWindEl);
    smallWeatherDivEl.append(smWeatherDescEl);
    smallWeatherCard.append(smallWeatherDivEl);
    smallWeatherDivEl.setAttribute("class", "sm-card");
  }
}


