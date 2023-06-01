var startTime;
var today = dayjs().format('YYYY-MM-DD');
const apiKey = 'c65a83f1b41423a44ca059c4924fe1cd';

var inputs = {
  city: '',
  state: '',
  country: '',
  latitude: '',
  longitude: '',
  zoom: 1,
  style: 'default',
  date: today,
}

const dateInput = document.getElementById('date');
dateInput.value = today;
dateInput.min = today;
dateInput.max = dayjs().add(16, 'days').format("YYYY-MM-DD");


if(location.search !== '') {
  var searchString = location.search + '&';
  for(var i in inputs) {
    const inputString = i + '=';
    const startIndex = searchString.indexOf(inputString)+inputString.length;
    const ampIndex = searchString.indexOf('&');
    inputs[i] = searchString.slice(startIndex, ampIndex);
    searchString = searchString.slice(ampIndex+1);
    console.log(i, inputs[i]);
    document.getElementById(i).value = inputs[i];
  }

  // convert input from string to int
  inputs.zoom = parseInt(inputs.zoom);
  if(inputs.latitude === '' || inputs.longitude === '') {

    locationToCoordinates(formatLocationString());
  }
  else {
    inputs.latitude = parseFloat(inputs.latitude);
    inputs.longitude = parseFloat(inputs.longitude);
    displayMap(inputs.latitude, inputs.longitude);
  }
}

function formatLocationString() {
  var locationString = '';
  if(inputs.city !== '')
    locationString += inputs.city + ',';
  if(inputs.state !== '')
    locationString += inputs.state + ',';
  if(inputs.country !== '')
    locationString += inputs.city;
  return locationString;
}

async function locationToCoordinates(locationString) {
  await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${locationString}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      inputs.latitude = data.coord.lat;
      inputs.longitude = data.coord.lon;
      displayMap(inputs.latitude, inputs.longitude);
    })
    .catch(error => console.log(error));
}

function displayMap(lat, lon) {
  console.log(lat, lon);
  // Create a Leaflet map centered on the location
  const map = L.map('map').setView([lat, lon], 12);
  // Add a tile layer to the map 
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
    palette: {
    }
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
  const applicationId = "2783890d-6a79-4a53-85ea-a093142ad152";
  const applicationSecret ="31acc37032ad69c4d5f7928586e995f9f30116465cf5dbc9669b235b5d71362584d5ba854089cc09e823e2052b7d0b4d2a30ed06d6e1ca2bf2995fcfae759c8f8004d66ad88d304c3219be628bf106d4f2a6ccd2e52fa416d1d575ddeb9e87d9536f373b6af2e372b0f92e7a1f6478ed";
  const authString = btoa(`${applicationId}:${applicationSecret}`);

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${authString}`,
    },
    body: JSON.stringify({
      "style": inputs.style,
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
              "zoom": inputs.zoom
          }
      }
      })
  };
  console.log(options.body);
  const url = "https://api.astronomyapi.com/api/v2/studio/star-chart";
  startTime = new Date();
  console.log('timer started');
  await fetch(url, options)
    .then((response) => response.json())
    .then((responseData) => displayStarChart(responseData.data));
}

function displayStarChart(data) {
    console.log((new Date() - startTime)/1000); // display time to load chart
    console.log(data);
    console.log(data.imageUrl);
    document.getElementById("star-chart").src = data.imageUrl;
}

async function fetchData() {
  const applicationId = "2783890d-6a79-4a53-85ea-a093142ad152";
  const applicationSecret ="31acc37032ad69c4d5f7928586e995f9f30116465cf5dbc9669b235b5d71362584d5ba854089cc09e823e2052b7d0b4d2a30ed06d6e1ca2bf2995fcfae759c8f8004d66ad88d304c3219be628bf106d4f2a6ccd2e52fa416d1d575ddeb9e87d9536f373b6af2e372b0f92e7a1f6478ed";
  const authString = btoa(`${applicationId}:${applicationSecret}`);

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${authString}`,
    },
    body: JSON.stringify({
      "style": getStyle(),
      "observer": {
          "latitude": lat,
          "longitude": lon,
          "date": getDateString()
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
              "zoom": 3 //optional
          }
      }
      })
  };

  const url = "https://api.astronomyapi.com/api/v2/studio/star-chart";
  await fetch(url, options)
    .then((response) => response.json())
    .then((responseData) => displayStarChart(responseData.data));
}

function displayStarChart(data) {
    console.log(data);
    console.log(data.imageUrl);
    document.getElementById("star-chart").src = data.imageUrl;
}

function getStyle() {
  return document.getElementById("style").value;
}

function getDateString() {
  return dayjs().format("YYYY-MM-DD");
}


// moonphase

// var lat = 40.735657;
// var lon = -74.172364;

async function getMoon() {
  const applicationId = "2783890d-6a79-4a53-85ea-a093142ad152";
  const applicationSecret ="31acc37032ad69c4d5f7928586e995f9f30116465cf5dbc9669b235b5d71362584d5ba854089cc09e823e2052b7d0b4d2a30ed06d6e1ca2bf2995fcfae759c8f8004d66ad88d304c3219be628bf106d4f2a6ccd2e52fa416d1d575ddeb9e87d9536f373b6af2e372b0f92e7a1f6478ed";
  const authString = btoa(`${applicationId}:${applicationSecret}`);

  const options = {
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
          "latitude": lat,
          "longitude": lon,
          "date": getDateString(),
      },
      "view": {
          "type": "portrait-simple",
          "orientation": "south-up"
      }
  })
}
  const moonUrl = "https://api.astronomyapi.com/api/v2/studio/moon-phase";
  await fetch(moonUrl, options)
    .then((response) => response.json())
    .then((responseData) => displayMoon(responseData.data));
};

function displayMoon(data) {
  console.log(data);
  console.log(data.imageUrl);
  document.getElementById("moon-phase").src = data.imageUrl;
}