var stateString = ""
var valueToFetchWeather = ""

function getStateString(state) {
    if (state === "") {
        stateString = "";
        return stateString;
    }
    else {
        stateString = `${state},`;
        return stateString;
    }
    console.log(stateString);
}

function searchLocation() {
    var cityInput = document.getElementById("locationCity");
    var cityVal = cityInput.value;
    var cityEncodedVal = encodeURIComponent(cityVal);
    var cityToFetch = `${cityEncodedVal},`;
    var stateInput = document.getElementById("locationState");
    var stateValue = stateInput.value;
    var countryInput = document.getElementById("countrySelect");
    var countryValue = countryInput.value;

    getStateString(stateValue);

    valueToFetchWeather = `${cityToFetch}${stateString}${countryValue}`
    console.log(cityEncodedVal, countryValue, valueToFetchWeather);

    getWeatherAndMaps(valueToFetchWeather);
}

const apiKey = 'c65a83f1b41423a44ca059c4924fe1cd';


//Call geolocation
function getWeatherData() {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${valueToFetchWeather}&appid=${apiKey}`)
        .then(response => response.json())
        .then((data) => this.displayLocation(data[0]));
}

function displayLocation(data) {
    locationName = data.name;
    lon = data.lon;
    lat = data.lat;
    country = data.country;
    console.log(locationName, lat, lon, country);
}

//Call the weather
function getWeatherDesc() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(response => response.json())
        .then((data) => this.displayWeather(data[0]));
}

function displayWeather(data) {
    weatherMain = data.weather[0].main;
    weatherDesc = data.weather[0].description;
    humidity = data.main.humidity;
    wind = data.wind.speed;
    sunrise = data.sys.sunrise;
    sunset = data.sys.sunset;
    console.log(weatherMain, description, humidity, wind, sunrise, sunset);
    concertEpoch()
}

//Convert sunrise/sunset Epoch to hh:mm
function convertEpoch() {
    let sunriseTime = new Date(sunrise * 1000);
    let sunriseHours = sunriseTime.getUTCHours().toString().padStart(2, 0);
    let sunriseMinutes = sunriseTime.getUTCMinutes().toString().padStart(2, 0);

    let sunsetTime = new Date(sunset * 1000);
    let hours = sunsetTime.getUTCHours().toString().padStart(2, 0);
    let minutes = sunsetTime.getUTCMinutes().toString().padStart(2, 0);

    console.log(sunriseHours + ':' + sunriseMinutes + ' AM');
    console.log(sunsetHours + ':' + sunsetMinutes + ' PM');
}


//Call Weather Map
function getWeatherAndMaps() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${valueToFetchWeather}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            // Extract the coordinates of the location
            //      const { lat, lon } = data.coord;
            lat = data.coord.lat;
            lon = data.coord.lon;
            console.log(data);
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
        })
        .catch(error => console.log(error));
}

// Search button
document.getElementById("searchLocation").addEventListener("click", searchLocation);
