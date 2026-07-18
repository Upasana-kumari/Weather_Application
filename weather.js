/* ✅ Search weather by city
✅ Fetch current weather from OpenWeather API
✅ Display temperature, humidity, wind speed, visibility, feels like, sunrise, sunset
✅ Weather icon
✅ Press Enter to search
✅ Loading indicator
✅ Error handling    */


// =========================================
// Weather App - Part 1
// Current Weather
// =========================================

// ----------------------------
// API KEY
// ----------------------------

const API_KEY = "YOUR_API_KEY";

// ----------------------------
// DOM Elements
// ----------------------------

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const loader = document.getElementById("loader");

const cityName = document.getElementById("cityName");
const dateTime = document.getElementById("dateTime");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const weatherIcon = document.getElementById("weatherIcon");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const visibility = document.getElementById("visibility");
const feels = document.getElementById("feels");

const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

// ----------------------------
// Loader
// ----------------------------

function showLoader() {
    loader.style.display = "block";
}

function hideLoader() {
    loader.style.display = "none";
}

// ----------------------------
// Search Weather
// ----------------------------

async function getWeather(city) {

    showLoader();

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();

        hideLoader();

        if (response.status !== 200) {

            alert("City not found");

            return;
        }

        updateWeatherUI(data);

        // Forecast function will be added in Part-2
        getForecast(city);

    } catch (error) {

        hideLoader();

        console.log(error);

        alert("Something went wrong!");

    }

}

// ----------------------------
// Update Weather UI
// ----------------------------

function updateWeatherUI(data) {

    cityName.innerHTML =
        `${data.name}, ${data.sys.country}`;

    temperature.innerHTML =
        `${Math.round(data.main.temp)}°C`;

    condition.innerHTML =
        capitalize(data.weather[0].description);

    humidity.innerHTML =
        `${data.main.humidity}%`;

    wind.innerHTML =
        `${data.wind.speed} m/s`;

    visibility.innerHTML =
        `${(data.visibility / 1000).toFixed(1)} km`;

    feels.innerHTML =
        `${Math.round(data.main.feels_like)}°C`;

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    sunrise.innerHTML =
        formatTime(data.sys.sunrise);

    sunset.innerHTML =
        formatTime(data.sys.sunset);

    updateDate();

}

// ----------------------------
// Format Unix Time
// ----------------------------

function formatTime(time) {

    const date = new Date(time * 1000);

    return date.toLocaleTimeString([], {

        hour: "2-digit",

        minute: "2-digit"

    });

}

// ----------------------------
// Current Date
// ----------------------------

function updateDate() {

    const now = new Date();

    dateTime.innerHTML =
        now.toLocaleString();

}

// ----------------------------
// Capitalize Text
// ----------------------------

function capitalize(text) {

    return text
        .split(" ")
        .map(word =>
            word.charAt(0).toUpperCase() +
            word.slice(1))
        .join(" ");

}

// ----------------------------
// Search Button
// ----------------------------

searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (city === "") {

        alert("Please enter a city name");

        return;

    }

    getWeather(city);

});

// ----------------------------
// Press Enter
// ----------------------------

cityInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        searchBtn.click();

    }

});

// ----------------------------
// Default City
// ----------------------------

window.onload = () => {

    getWeather("Delhi");

};


/* This part:

✅ Fetches the 5-day forecast
✅ Filters one forecast per day (around 12:00 PM)
✅ Displays forecast cards
✅ Shows weather icons
✅ Displays Min/Max temperatures    */

// =========================================
// WEATHER APP - PART 2
// 5-Day Forecast
// =========================================

// ----------------------------
// Forecast Container
// ----------------------------

const forecastContainer = document.getElementById("forecastContainer");

// ----------------------------
// Fetch 5-Day Forecast
// ----------------------------

async function getForecast(city) {

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();

        if (data.cod !== "200") {
            console.log("Forecast not available");
            return;
        }

        displayForecast(data.list);

    } catch (error) {

        console.log(error);

    }

}

// ----------------------------
// Display Forecast
// ----------------------------

function displayForecast(list) {

    forecastContainer.innerHTML = "";

    // Select forecast around 12:00 PM each day
    const dailyForecast = list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    dailyForecast.forEach(day => {

        const date = new Date(day.dt_txt);

        const dayName = date.toLocaleDateString("en-US", {
            weekday: "short"
        });

        const icon =
            `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

        const card = document.createElement("div");

        card.className = "forecast-card";

        card.innerHTML = `
            <h3>${dayName}</h3>

            <img src="${icon}" alt="Weather Icon">

            <p>${capitalize(day.weather[0].description)}</p>

            <h4>${Math.round(day.main.temp)}°C</h4>

            <p>
                Min:
                ${Math.round(day.main.temp_min)}°C
            </p>

            <p>
                Max:
                ${Math.round(day.main.temp_max)}°C
            </p>

            <p>
                💧 ${day.main.humidity}%
            </p>
        `;

        forecastContainer.appendChild(card);

    });

}

// ----------------------------
// Refresh Forecast
// ----------------------------

function refreshForecast(city) {

    forecastContainer.innerHTML = "";

    getForecast(city);

}


/* Part 3 (Next)

The final JavaScript part will include:

Current Location Weather
Dark Mode
°C ⇄ °F Toggle
Search History (Local Storage)
Dynamic Background (Sunny, Rainy, Snow, Clouds)
Loading Spinner Improvements
Better Error Handling
Favorite Cities  */

// =========================================
// WEATHER APP - PART 3
// Current Location + Dark Mode + Background
// =========================================

// ----------------------------
// Current Location Weather
// ----------------------------

const locationBtn = document.getElementById("locationBtn");

locationBtn.addEventListener("click", () => {

    if (!navigator.geolocation) {

        alert("Geolocation is not supported.");

        return;

    }

    showLoader();

    navigator.geolocation.getCurrentPosition(getPosition, showLocationError);

});

async function getPosition(position) {

    const lat = position.coords.latitude;

    const lon = position.coords.longitude;

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();

        hideLoader();

        updateWeatherUI(data);

        getForecast(data.name);

        cityInput.value = data.name;

    } catch (error) {

        hideLoader();

        alert("Unable to fetch weather.");

        console.log(error);

    }

}

function showLocationError(error) {

    hideLoader();

    switch (error.code) {

        case error.PERMISSION_DENIED:
            alert("Location permission denied.");
            break;

        case error.POSITION_UNAVAILABLE:
            alert("Location unavailable.");
            break;

        case error.TIMEOUT:
            alert("Request timed out.");
            break;

        default:
            alert("Unknown error.");
    }

}

// =========================================
// Dark Mode
// =========================================

const body = document.body;

themeBtn.addEventListener("click", () => {

    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {

        themeBtn.innerHTML = "☀️";

        localStorage.setItem("theme", "dark");

    } else {

        themeBtn.innerHTML = "🌙";

        localStorage.setItem("theme", "light");

    }

});

window.addEventListener("load", () => {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {

        body.classList.add("dark-mode");

        themeBtn.innerHTML = "☀️";

    }

});

// =========================================
// Search History
// =========================================

function saveCity(city) {

    let cities = JSON.parse(localStorage.getItem("cities")) || [];

    if (!cities.includes(city)) {

        cities.unshift(city);

    }

    cities = cities.slice(0, 5);

    localStorage.setItem("cities", JSON.stringify(cities));

}

// Save searched city
const oldGetWeather = getWeather;

getWeather = async function(city){

    saveCity(city);

    await oldGetWeather(city);

};

// =========================================
// Dynamic Background
// =========================================

function setBackground(weather) {

    const bg = document.querySelector(".background");

    const condition = weather.toLowerCase();

    if (condition.includes("clear")) {

        bg.style.background =
        "linear-gradient(-45deg,#56CCF2,#2F80ED,#4facfe,#00f2fe)";

    }

    else if (condition.includes("cloud")) {

        bg.style.background =
        "linear-gradient(-45deg,#757F9A,#D7DDE8,#A1C4FD,#C2E9FB)";

    }

    else if (condition.includes("rain")) {

        bg.style.background =
        "linear-gradient(-45deg,#373B44,#4286f4,#232526,#414345)";

    }

    else if (condition.includes("snow")) {

        bg.style.background =
        "linear-gradient(-45deg,#E6DADA,#274046,#ffffff,#cfd9df)";

    }

    else {

        bg.style.background =
        "linear-gradient(-45deg,#2193b0,#6dd5ed,#4facfe,#00f2fe)";

    }

}

// =========================================
// Extend updateWeatherUI
// =========================================

const oldUpdateUI = updateWeatherUI;

updateWeatherUI = function(data){

    oldUpdateUI(data);

    setBackground(data.weather[0].main);

};

// =========================================
// Auto Refresh Time
// =========================================

setInterval(updateDate,1000);

// =========================================
// Welcome Message
// =========================================

console.log("Weather App Loaded Successfully");

// =========================================
// END OF weather.js
// =========================================