

let latitude;
let longitude;

// Event listener for the "Use Current Location" button
document.getElementById("geolocationButton").addEventListener("click", () => {
    getGeoLocation();
});

// Event listener for the "Search" button
document.getElementById("searchButton").addEventListener("click", () => {
    gettingLatitudeAndLongitudeOfCity();
});

// Function to get geolocation
function getGeoLocation() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            handleGeolocationSuccess();
        },
        (error) => {
            alert("Something went wrong with geolocation.");
        }
    );
}

// Function to handle geolocation success
async function handleGeolocationSuccess() {
    const todaysData = await getTodaySunsetAndSunriseData();
    const tomorrowsData = await getTomorrowSunriseAndSunsetData();
    const city = await getCityName();
    addResultsContainer(todaysData, tomorrowsData, city);
}

// Function to get latitude and longitude of a city
async function gettingLatitudeAndLongitudeOfCity() {
    try {
        const cityName = document.getElementById("cityName").value;
        const url = `https://geocode.maps.co/search?q=${cityName}`;
        const option = {
            method: "GET",
        };
        const response = await fetch(url, option);
        const data = await response.json();
        console.log("Geocoding API Response:", data);

        if (data.length === 0) {
            alert("No city found.");
        } else {
            latitude = data[0].lat;
            longitude = data[0].lon;
            console.log("Latitude:", latitude, "Longitude:", longitude);

            const todaysData = await getTodaySunsetAndSunriseData();
            const tomorrowsData = await getTomorrowSunriseAndSunsetData();
            addResultsContainer(todaysData, tomorrowsData, cityName);
        }
    } catch (error) {
        console.error("Error in gettingLatitudeAndLongitudeOfCity:", error);
        alert("Something went wrong while getting latitude and longitude.");
    }
}



// Function to fetch today's sunset and sunrise data
async function getTodaySunsetAndSunriseData() {
    if (latitude === undefined || longitude === undefined) {
        alert("Something went wrong.");
    } else {
        try {
            const url = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}`;
            const option = {
                method: "GET",
            };
            const response = await fetch(url, option);
            const data = await response.json();
            const todaysData = data.results;
            return todaysData;
        } catch (error) {
            alert("Something went wrong while fetching today's data.");
        }
    }
}

// Function to get the city name
async function getCityName() {
    try {
        const formateDate = getFormattedDate();
        const url = `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`;
        const option = {
            method: "GET",
        };
        const response = await fetch(url, option);
        const data = await response.json();
        const cityName = data.address.city;
        return cityName;
    } catch (error) {
        alert("Something went wrong while fetching city name.");
    }
}

// Function to fetch tomorrow's sunset and sunrise data
async function getTomorrowSunriseAndSunsetData() {
    const formateDate = getFormattedDate();
    if (latitude === undefined || longitude === undefined) {
        alert("Something went wrong.");
    } else {
        try {
            const url = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&timezone=IST&date=${formateDate}`;
            const option = {
                method: "GET",
            };
            const response = await fetch(url, option);
            const data = await response.json();
            const tomorrowsData = data.results;
            return tomorrowsData;
        } catch (error) {
            alert("Something went wrong while fetching tomorrow's data.");
        }
    }
}

// Function to add results container to the DOM
const addResultsContainer = (todaysData, tomorrowsData, name) => {
    // Update the DOM with fetched data
    document.getElementById("sunrise-today").textContent = `Sunrise Today: ${todaysData.sunrise}`;
    document.getElementById("sunset-today").textContent = `Sunset Today: ${todaysData.sunset}`;
    document.getElementById("sunrise-tomorrow").textContent = `Sunrise Tomorrow: ${tomorrowsData.sunrise}`;
    document.getElementById("sunset-tomorrow").textContent = `Sunset Tomorrow: ${tomorrowsData.sunset}`;
    
    document.getElementById("dawn-today").textContent = `Dawn Today: ${todaysData.dawn}`;
    document.getElementById("dusk-today").textContent = `Dusk Today: ${todaysData.dusk}`;
    document.getElementById("dawn-tomorrow").textContent = `Dawn Tomorrow: ${tomorrowsData.dawn}`;
    document.getElementById("dusk-tomorrow").textContent = `Dusk Tomorrow: ${tomorrowsData.dusk}`;

    document.getElementById("day-length-today").textContent = `Day Length Today: ${todaysData.day_length}`;
    document.getElementById("day-length-tomorrow").textContent = `Day Length Tomorrow: ${tomorrowsData.day_length}`;

    document.getElementById("solar-noon-today").textContent = `Solar Noon Today: ${todaysData.solar_noon}`;
    document.getElementById("solar-noon-tomorrow").textContent = `Solar Noon Tomorrow: ${tomorrowsData.solar_noon}`;

    document.getElementById("time-zone-info").textContent = `Time Zone: ${todaysData.timezone}`;
};

// Function to get formatted date
function getFormattedDate() {
    const tomorrowDateObj = new Date();
    tomorrowDateObj.setDate(tomorrowDateObj.getDate() + 1);
    const formateDate = `${tomorrowDateObj.getFullYear()}-${tomorrowDateObj.getMonth() + 1}-${tomorrowDateObj.getDate()}`;
    return formateDate; 
}

