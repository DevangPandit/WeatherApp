const apiKey = "9063e7866d833b2a6b01ace69cd92d9b";
const searchBox = document.querySelector(".search-box input");
const searchButton = document.querySelector(".search-box .fa-magnifying-glass");
const weatherContainers = {
    sunny: document.querySelector(".sunny-container"),
    windy: document.querySelector(".windy-container"),
    rainy: document.querySelector(".rainy-container"),
    snowy: document.querySelector(".snowy-container"),
    error: document.querySelector(".error")
}

Object.values(weatherContainers).forEach(container => container.style.display = "none");

async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try{
        const response = await fetch(url);
        if(!response.ok){
            throw new Error("City not found");
        }

        const data = await response.json();
        updateWeatherUI(data);
    }catch(error){
        showError();
    }
}

function updateWeatherUI(data){
    const{ main, weather, name, wind } = data;
    const temperature = Math.round(main.temp);
    const condition = weather[0].main.toLowerCase();

    Object.values(weatherContainers).forEach(container => container.style.display = "none");

    if(condition.includes("clear")){
        showWeather(weatherContainers.sunny, name, temperature); 
    }else if(condition.includes("cloud") || condition.includes("wind")){
        showWeather(weatherContainers.windy, name, temperature, wind.speed);
    }else if(condition.includes("rain") || condition.includes("drizzle")){
        showWeather(weatherContainers.rainy, name, temperature);
    }else if(condition.includes("snow")){
        showWeather(weatherContainers.snowy, name, temperature);
    }else{
        showError();
    }
}

function showWeather(container, city, temp, windSpeed = null){
    container.style.display = "block";
    container.querySelector("h2").textContent = `${city}, ${temp}°C`;

    if(windSpeed){
        container.querySelector("p").textContent = `Wind Speed: ${windSpeed} m/s`;
    }
}

function showError(){
    weatherContainers.error.style.display = "block";
}

searchButton.addEventListener("click", () => {
    const city = searchBox.value.trim();
    if(city){
        getWeather(city);
    }
})

searchBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter"){
        searchButton.click();
    }
})