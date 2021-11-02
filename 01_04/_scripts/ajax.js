// add global variable containing XHR object here

// add get() function here
function get(url) {
  return new Promise(function (resolve, reject) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", url);
    httpRequest.onload = function () {
      if (httpRequest.status === 200) {
        resolve(httpRequest.responseText);
      } else {
        reject(Error(httpRequest.status));
      }
    };

    httpRequest.onerror = function () {
      reject(Error("Network error"));
    };

    httpRequest.send();
  });
}

function tempToF(kelvin) {
  return ((kelvin - 273.15) * 1.8 + 32).toFixed(0);
}

function successHandler(data) {
  const dataObj = JSON.parse(data);
  const weatherDiv = document.querySelector("#weather");
  const weatherFragment = `
        <h1>Weather</h1>
        <h2 class="top">
        <img
            src="http://openweathermap.org/img/w/${dataObj.weather[0].icon}.png"
            alt="${dataObj.weather[0].description}"
            width="50"
            height="50"
        />${dataObj.name}
        </h2>
        <p>
        <span class="tempF">${tempToF(dataObj.main.temp)}&deg;</span> | ${
    dataObj.weather[0].description
  }
        </p>
    `;
  weatherDiv.innerHTML = weatherFragment;
  weatherDiv.classList.remove("hidden");
}

function failHandler(status) {
  console.log(status);
  const weatherDiv = document.querySelector("#weather");
  weatherDiv.classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", function () {
  // const apiKey = ""; // ADD YOUR API KEY BETWEEN THE QUOTES
  const apiKey = "7846cfbfd1b49dad9cb82c1ff2a4250e"; // ADD YOUR API KEY BETWEEN THE QUOTES
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=los+angeles&APPID=" +
    apiKey;
  get(url)
    .then(function (response) {
      successHandler(response);
    })
    .catch(function (status) {
      failHandler(status);
    });
});
