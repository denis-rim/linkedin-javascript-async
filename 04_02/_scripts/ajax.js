function get(url) {
  return new Promise(function(resolve, reject) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', url);
    httpRequest.onload = function() {
      if (httpRequest.status === 200) {
        // Resolve the promise with the response text
        // success(httpRequest.responseText);
        resolve(httpRequest.response);
      } else {
        // Reject the promise with the status text
        // fail(httpRequest.status);
        reject(Error(httpRequest.statusText));
      }
    };

    // Handle network errors
    httpRequest.onerror = function() {
      reject(Error('Network Error'));
    };

    httpRequest.send();
  });
}

function successHandler(data) {
  const dataObj = JSON.parse(data);
  // const weatherDiv = document.querySelector('#weather');
  const div = `
        <h2 class="top">
        <img
            src="http://openweathermap.org/img/w/${dataObj.weather[0].icon}.png"
            alt="${dataObj.weather[0].description}"
            width="50"
            height="50"
        />${dataObj.name}
        </h2>
        <p>
          <span class="tempF">${tempToF(dataObj.main.temp)}&deg;</span> | 
          ${dataObj.weather[0].description}
        </p>
    `;
  return div;
  // weatherDiv.innerHTML = weatherFragment;
}

function failHandler(status) {
  console.log(status);
}

function tempToF(kelvin) {
  return ((kelvin - 273.15) * 1.8 + 32).toFixed(0);
}

document.addEventListener('DOMContentLoaded', function() {
  const apiKey = ''; // ADD YOUR API KEY BETWEEN THE QUOTES
  //const apiKey = '';
  const weatherDiv = document.querySelector('#weather');

  const locations = [
    'los+angeles,us',
    'san+francisco,us',
    'lone+pine,us',
    'mariposa,us'
  ];
  const urls = locations.map(function(location) {
    return `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${apiKey}`;
  });

  // get(url, successHandler, failHandler);
  // Promise.all([get(urls[0]), get(urls[1]), get(urls[2]), get(urls[3])])
  //   .then(function(responses) {
  //     return responses.map(function(response) {
  //       return successHandler(response);
  //     });
  //   })
  //   .then(function(literals) {
  //     weatherDiv.innerHTML = `<h1>Weather</h1>${literals.join('')}`;
  //   })
  //   .catch(function(status) {
  //     failHandler(status);
  //   })
  //   .finally(function() {
  //     weatherDiv.classList.remove('hidden');
  //   });

  (async function() {
    try {
      let responses = [];
      responses.push(await get(urls[0]));
      responses.push(await get(urls[1]));
      responses.push(await get(urls[2]));
      responses.push(await get(urls[3]));
      let literals = responses.map(function(response) {
        return successHandler(response);
      });
      weatherDiv.innerHTML = `<h1>Weather</h1>${literals.join('')}`;
    } catch (status) {
      failHandler(status);
    } finally {
      weatherDiv.classList.remove('hidden');
    }
  })();
});
