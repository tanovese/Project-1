var startTime;
var today = dayjs().format('YYYY-MM-DD');
document.getElementById('date-input').value = today;

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

if(location.search !== '') {
  var searchString = location.search + '&';
  for(var i in inputs) {
    const inputString = i + '=';
    const startIndex = searchString.indexOf(inputString)+inputString.length;
    const ampIndex = searchString.indexOf('&');
    inputs[i] = searchString.slice(startIndex, ampIndex);
    searchString = searchString.slice(ampIndex+1);
    console.log(i, inputs[i]);
  }
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
  console.log(options);
  const url = "https://api.astronomyapi.com/api/v2/studio/star-chart";
  startTime = new Date();
  console.log('timer started');
  await fetch(url, options)
    .then((response) => response.json())
    .then((responseData) => displayStarChart(responseData.data));
}

function displayStarChart(data) {
    console.log((new Date() - startTime)/1000);
    console.log(data.imageUrl);
    document.getElementById("star-chart").src = data.imageUrl;
}
