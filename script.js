
// Object containing the image paths for each planet
let planetImages = {
  mercury: 'images/mercury.png',
  venus: 'images/venus.png',
  earth: 'images/earth.png',
  mars: 'images/mars.png',
  jupiter: 'images/jupiter.png',
  saturn: 'images/saturn.png',
  uranus: 'images/uranus.png',
  neptune: 'images/neptune.png'
}

// Object containing the description for each planet
let planetDescr = {
  mercury: 'Mercury, the closest planet to the Sun, boasts the shortest year, completing an orbit in just 88 Earth days. Its extreme temperatures fluctuate dramatically, with scorching highs and freezing lows, due to its lack of a significant atmosphere.',
  venus: "Known as Earth's sister planet, Venus is similar in size but harbors a hostile environment. Thick clouds of sulfuric acid shroud its surface, trapping heat and creating a runaway greenhouse effect, resulting in surface temperatures that can melt lead.",
  earth: "Our home planet, Earth, teems with life and diverse ecosystems. It's the only known celestial body to support a rich tapestry of flora and fauna, with its moderate climate, liquid water, and protective atmosphere fostering conditions suitable for life.",
  mars: 'Mars, often called the "Red Planet," is characterized by its rusty-hued surface. It has a thin atmosphere, and its landscape features vast deserts, polar ice caps, and the tallest volcano in the solar system, Olympus Mons.',
  jupiter: 'Jupiter, the largest planet, is a gas giant with a striking array of bands and storms. Its iconic Great Red Spot is a colossal storm system, and its strong magnetic field generates powerful radiation belts, making it a captivating celestial giant.',
  saturn: 'Saturn is renowned for its stunning ring system, consisting of thousands of individual rings made of ice and rock particles. This gas giant also boasts a diverse collection of moons, with Titan being the second-largest moon in the solar system.',
  uranus: 'Uranus, a distant ice giant, rotates on its side, resulting in extreme seasonal variations. It has a unique blue-green hue due to the presence of methane in its atmosphere and is encircled by a system of narrow rings.',
  neptune: 'Neptune, the farthest known planet from the Sun, is another ice giant with a vibrant blue atmosphere. It experiences powerful storms, including the infamous Great Dark Spot, and has a dynamic system of rings and moons.',
}

// Object containing the different temperatures for each planet
let inKelvin = 0;
let inFahrenheit = 0;
let inCelsius = 0;
let nextTemp;

// Initial planet is earth
let button = document.getElementById('earthBtn');
button.classList.add('active');

fetchPlanetData('earth');

/*
 * Function to navigate to a specific planet
 */
function navigateTo(planet) {
  // Remove the 'active' class from all buttons
  const buttons = document.querySelectorAll('.planets-list button');
  buttons.forEach(button => button.classList.remove('active'));

  // Add the 'active' class to the clicked button
  const currentButton = document.getElementById(`${planet}Btn`);
  currentButton.classList.add('active');

  // Change the planet image
  const imgPath = planetImages[planet];
  document.getElementById('planet-image').src = imgPath;

  // Change the planet's info
  const planetInfo = document.getElementById('planet-info');
  planetInfo.textContent = planetDescr[planet];

  // Fetch and change the planet's information
  fetchPlanetData(planet);
}

/*
 * Function to change temperature scales
 */
function changeTemp() {
  switch (nextTemp) {
    case inFahrenheit:
      document.getElementById('planet-temp').textContent = inFahrenheit.toFixed(2) + '\xB0F';
      nextTemp = inCelsius;
      break;
    case inCelsius:
      document.getElementById('planet-temp').textContent = inCelsius.toFixed(2) + '\xB0C';
      nextTemp = inKelvin;
      break;
    case inKelvin:
      document.getElementById('planet-temp').textContent = inKelvin.toFixed(2) + '\xB0K';
      nextTemp = inFahrenheit;
      break;

  }
}

/*
 * Convert from Kelvin to Fahrenheit
 */
function kelvinToFahrenheit(kelvin) {
  return (kelvin - 273.15) * 9 / 5 + 32;
}

/*
 * Convert from Kelvin to Celsius
 */
function kelvinToCelsius(kelvin) {
  return kelvin - 273.15;
}

/*
 * Function to create # of stars and place them randomly in the background
*/
document.addEventListener('DOMContentLoaded', function() {
  let starsContainer = document.getElementById('stars');
  let numberOfStars = 100;

  for (let i = 0; i < numberOfStars; i++) {
    // Create star element 
    let star = document.createElement('div');
    star.className = 'star';

    // Place in random position 
    let xy = getRandPosition();
    star.style.left = xy[0] + 'px';
    star.style.top = xy[1] + 'px';

    // Adjust star appearance
    star.style.width = star.style.height = (Math.random() * 6) + 'px';
    star.style.opacity = Math.random();

    starsContainer.appendChild(star)
  }

  function getRandPosition() {
    let x = window.innerWidth;
    let y = window.innerHeight;
    let randX = Math.floor(Math.random() * x);
    let randY = Math.floor(Math.random() * y);

    return [randX, randY];
  }
})

/*
 * Function to fetch planet data from the Solar System OpenData API
 */
function fetchPlanetData(planet) {
  // Fetch planet data from the API
  fetch(`https://api.le-systeme-solaire.net/rest.php/bodies?data=avgTemp%2CenglishName%2CsideralOrbit%2Cgravity%2CpolarRadius&filter%5B%5D=englishName%2Ceq%2CMercury&filter%5B%5D=englishName%2Ceq%2CVenus&filter%5B%5D=englishName%2Ceq%2CEarth&filter%5B%5D=englishName%2Ceq%2CMars&filter%5B%5D=englishName%2Ceq%2CJupiter&filter%5B%5D=englishName%2Ceq%2CSaturn&filter%5B%5D=englishName%2Ceq%2CUranus&filter%5B%5D=englishName%2Ceq%2CNeptune&satisfy=any`)
    .then(response => response.json())
    .then(data => {
      // Find the planet data in the 'bodies' response array
      const planetData = data.bodies.find(p => p.englishName.toLowerCase() === planet.toLowerCase());
      console.log('Name : ' + planetData.englishName); // Check

      // Check if planet data was found
      if (planetData) {
        // Update the DOM with the new data
        document.getElementById('planet-name').textContent = planetData.englishName.toUpperCase();
        document.getElementById('planet-revolution').textContent = planetData.sideralOrbit + ' days';
        document.getElementById('planet-gravity').textContent = planetData.gravity + ' m/s\u00B2';
        document.getElementById('planet-radius').textContent = planetData.polarRadius + ' km';

        // Converting temperatures to other scales
        inKelvin = planetData.avgTemp;
        inCelsius = kelvinToCelsius(planetData.avgTemp);
        inFahrenheit = kelvinToFahrenheit(planetData.avgTemp);

        // Updating UI
        nextTemp = inCelsius;
        document.getElementById('planet-temp').textContent = inFahrenheit.toFixed(2) + '\xB0F';

      } else {
        console.error('Planet data not found.');
      }
    })
    .catch(error => console.error('Error fetching data:', error));
}
