const id = "64f9aba9-e53c-48d7-9fee-89973929550e"
const appSecret= "9b30891c97e7d90108aa570704309243ee1842c0b90b8f76345ffc67806a5d4674f482e8cf8b9b3aedab3445ef189c91b29585881f0b09a8b5133e874a7b3b08c6167cc6cb38f3c1b7890909b2c988ff67c150b267209e06f849c7338a639ffca87457f676dfae18cf251cc66e0561a7"
const origin = "https://tanovese.github.io/myStars/"
const authString = btoa(`${id}:${appSecret}`);
const authorize ="Authorization: Basic url"
const starChartUrl = "https://api.astronomyapi.com/api/v2/studio/star-chart"
const starChartImage= document.getElementById("start-chart-img");
const search = document.getElementById("get-stars-button");

// curl --location --request GET 'https://api.astronomyapi.com/api/v2/bodies' 
// \ --header 'Authorization: Basic <authString>'

search.addEventListener("click", starChart);

function starChart() {
  fetch('https://api.astronomyapi.com/api/v2/star-chart', {
  method: "POST",
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${authString}`
    },
      body: JSON.stringify ({
      "observer": {
        "latitude": 33.775867,
        "longitude": -84.39733,
        "date": "2019-12-20"
    },
    "view": {
        "type": "area",
        "parameters": {
            "position": {
                "equatorial": {
                    "rightAscension": 14.83,
                    "declination": -15.23
                }
            },
            "zoom": 3 //optional
        }
    }
  })
  
})
  .then(response => response.json())
  .then(data => {
  console.log("Data check", data)
  })
}
  //   body: {
  //     "observer": {
  //       "latitude": 33.775867,
  //       "longitude": -84.39733,
  //       "date": "2019-12-20"
  //   },
  //   "view": {
  //       "type": "area",
  //       "parameters": {
  //           "position": {
  //               "equatorial": {
  //                   "rightAscension": 14.83,
  //                   "declination": -15.23
  //               }
  //           },
  //           "zoom": 3 //optional
  //       }
  //   }
  // }
  
//   })
//   .then(response => response.json())
//   .then(data => {
//   console.log(data)
//   })
//   renderImage(data);
// };

function renderImage(data) {
  console.log("Check data transfer",data);
  starChartImage.src = response.data.imageUrl;
}


// const applicationId = "2783890d-6a79-4a53-85ea-a093142ad152";
// const applicationSecret ="31acc37032ad69c4d5f7928586e995f9f30116465cf5dbc9669b235b5d71362584d5ba854089cc09e823e2052b7d0b4d2a30ed06d6e1ca2bf2995fcfae759c8f8004d66ad88d304c3219be628bf106d4f2a6ccd2e52fa416d1d575ddeb9e87d9536f373b6af2e372b0f92e7a1f6478ed";
// const authString = btoa(`${applicationId}:${applicationSecret}`);

// const options = {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: `Basic ${authString}`,
//   },
//   body: JSON.stringify({
//     "style": "default",
//     "observer": {
//         "latitude": 40.735657,
//         "longitude": -74.172363,
//         "date": "2023-05-23"
//     },
//     "view": {
//         "type": "area",
//         "parameters": {
//             "position": {
//                 "equatorial": {
//                     "rightAscension": 0,
//                     "declination": 0
//                 }
//             },
//             "zoom": 2 
//         }
//     }
//     })
// };

// const starChartImage= document.getElementById("start-chart-img");
// let route = `/api/v2/studio/star-chart`;
// const url = "https://api.astronomyapi.com" + route;

// const data = fetch(url, options)
//   .then((response) => response.json())
//   .then((response) => {
//     console.log(response);
//     console.log(response.data.imageUrl);
//     document.getElementById("star-chart").src = response.data.imageUrl;
//   })
//   .catch((err) => console.error(err));
