// script.js

// Global variables
let apiKey = "dummyapikey"; 
let weatherDisplay = document.getElementById("weather-display");
let errorDisplay = document.getElementById("error-display");
let searchBtn = document.getElementById("search-btn");
let isFetching = false; // 🚀 prevent request spam

// Add Enter key listener
document.getElementById("city-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    debouncedGetWeather();
  }
});

// Debounce wrapper
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}
const debouncedGetWeather = debounce(getWeather, 500);

// Input validation
function isValidCityName(city) {
  const regex = /^[a-zA-Z\s]{2,50}$/; 
  return regex.test(city);
}

function getWeather() {
  if (isFetching) return; // 🚀 block spamming

  const city = document.getElementById("city-input").value.trim();

  if (!city) {
    errorDisplay.textContent = "Please enter a city name.";
    weatherDisplay.innerHTML = "";
    return;
  }

  if (!isValidCityName(city)) {
    errorDisplay.textContent = "Invalid city name. Use only letters and spaces (2–50 chars).";
    weatherDisplay.innerHTML = "";
    return;
  }

  // Disable button & set flag
  isFetching = true;
  searchBtn.disabled = true;
  searchBtn.classList.add("opacity-50", "cursor-not-allowed");

  errorDisplay.textContent = "";
  weatherDisplay.innerHTML = "Loading...";

  fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (!data || !data.current) {
        throw new Error("Invalid data received");
      }

      const temp = data.current.temp_c;
      const desc = data.current.condition.text;
      const icon = data.current.condition.icon.startsWith("http")
        ? data.current.condition.icon
        : "https:" + data.current.condition.icon;

      weatherDisplay.innerHTML = `
        <div class="flex flex-col items-center">
          <img src="${icon}" alt="weather icon" class="mb-2">
          <span class="text-xl font-bold">${temp} °C</span>
          <span class="capitalize">${desc}</span>
          <span class="text-gray-600 text-sm">${data.location.name}, ${data.location.country}</span>
        </div>
      `;
      errorDisplay.textContent = "";
    })
    .catch((err) => {
      weatherDisplay.innerHTML = "";
      errorDisplay.textContent = `Error: ${err.message}`;
    })
    .finally(() => {
      // ✅ Re-enable after request finishes
      isFetching = false;
      searchBtn.disabled = false;
      searchBtn.classList.remove("opacity-50", "cursor-not-allowed");
    });
}
