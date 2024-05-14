'use strict';

const APIKEY = "e346c47ffa2a6c14ce658653ac34daaf";

const dayEl = document.querySelector(".default_day");
const dateEl = document.querySelector(".default_date");
const btnEl = document.querySelector(".btn_search");
const inputEl = document.querySelector(".input_field");

const iconsContainer = document.querySelector(".icons");
const dayInfoEl = document.querySelector(".day_info");
const listContentEl = document.querySelector(".list_content ul");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// display the day
const day = new Date();
const dayName = days[day.getDay()];
dayEl.textContent = dayName;

// display date
let month = day.toLocaleString("default", { month: "long" });
let date = day.getDate();
let year = day.getFullYear();

console.log();
dateEl.textContent = date + " " + month + " " + year;

inputEl.addEventListener("keypress", function(event) {
  // Check if the key pressed is Enter (key code 13)
  if (event.key === 'Enter') {
      // Prevent the default action of the Enter key (form submission)
      event.preventDefault();
      
      // Call the function to fetch weather data
      if (inputEl.value.trim() !== "") {
          findLocation(inputEl.value.trim());
          inputEl.value = "";
      } else {
          console.log("Please enter a valid city or country name");
      }
  }
});

// add event
btnEl.addEventListener("click", (e) => {
  e.preventDefault();

  // check empty value
  if (inputEl.value !== "") {
    const Search = inputEl.value;
    inputEl.value = "";
    findLocation(Search);
  } else {
    console.log("Please Enter City or Country Name");
  }
});

async function findLocation(name) {
  iconsContainer.innerHTML = "";
  dayInfoEl.innerHTML = "";
  listContentEl.innerHTML = "";
  try {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${APIKEY}&units=metric`;
    const data = await fetch(API_URL);
    const result = await data.json();
    console.log(result);

    if (result.cod !== "404") {
      // display image content
      const ImageContent = displayImageContent(result);

      // display right side content
      const rightSide = rightSideContent(result);

      // forecast function
      displayForeCast(result.coord.lat, result.coord.lon);

      setTimeout(() => {
        iconsContainer.insertAdjacentHTML("afterbegin", ImageContent);
        iconsContainer.classList.add("fadeIn");
        dayInfoEl.insertAdjacentHTML("afterbegin", rightSide);
      }, );
    } else {
      const message = `<h2 class="weather_temp">${result.cod}</h2>
      <h3 class="cloudtxt">${result.message}</h3>`;
      iconsContainer.insertAdjacentHTML("afterbegin", message);
    }
  } catch (error) { }
}

// display image content and temp
function displayImageContent(data) {
  return `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon
    }@4x.png" alt="abc" />
    <h2 class="weather_temp">${Math.round(data.main.temp)}°C</h2>
    <h3 class="cloudtxt">${data.weather[0].description}</h3>`;
}



// display the right side content
function rightSideContent(result) {
  return `<div class="content">
          <p class="title">NAME</p>
          <span class="value">${result.name}</span>
        </div>
        <div class="content">
          <p class="title">TEMP</p>
          <span class="value">${Math.round(result.main.temp)}°C</span>
        </div>
        <div class="content">
          <p class="title">FEELS LIKE</p>
          <span class="value">${result.main.feels_like}°C</span>
        </div>
        <div class="content">
          <p class="title">HUMIDITY</p>
          <span class="value">${result.main.humidity}%</span>
        </div>
        <div class="content">
          <p class="title">VISIBILITY</p>
          <span class="value">${result.visibility / 1000} km</span>
        </div>
        <div class="content">
          <p class="title">WIND SPEED</p>
          <span class="value">${result.wind.speed} Km/h</span>
        </div>
        <div class="content">
          <p class="title">SUN RISE</p>
          <span class="value">${moment(new Date(result.sys.sunrise * 1000)).format("h:mm")} am</span>
        </div>
        <div class="content">
          <p class="title">SUN SET</p>
          <span class="value">${moment(new Date(result.sys.sunset * 1000)).format("h:mm")} pm</span>
        </div>
        
      `;
}

async function displayForeCast(lat, long) {
  const ForeCast_API = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${APIKEY}&units=metric`;
  const data = await fetch(ForeCast_API);
  const result = await data.json();
  // filter the forecast
  const uniqeForeCastDays = [];
  const daysForecast = result.list.filter((forecast) => {
    const forecastDate = new Date(forecast.dt_txt).getDate();
    if (!uniqeForeCastDays.includes(forecastDate)) {
      return uniqeForeCastDays.push(forecastDate);
    }
  });
  // console.log(daysForecast);

  daysForecast.forEach((content, indx) => {
    if (indx <= 3) {
      listContentEl.insertAdjacentHTML("afterbegin", forecast(content));
    }
  });
}

// forecast html element data
function forecast(frContent) {
  const day = new Date(frContent.dt_txt);
  const dayName = days[day.getDay()];
  const splitDay = dayName.split("", 3);
  const joinDay = splitDay.join("");

  // console.log(dayName);

  return `<li>
  <img src="https://openweathermap.org/img/wn/${frContent.weather[0].icon
    }@2x.png alt = "abc" />
  <span>${joinDay}</span>
  <span class="day_temp">${Math.round(frContent.main.temp)}°C</span>
</li>`;
}



