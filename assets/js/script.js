var lat = 40.735657;
var lon = -74.172364;

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

function getZoom() {
  return parseInt(document.getElementById("zoom").value);
}

function getDateString() {
  return dayjs().format("YYYY-MM-DD");
}