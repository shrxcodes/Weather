const apiKey = "21bf82b7ca5fec9f07b05ed50886dd68"; 
async function getWeather() {
    const city = document.getElementById("city-input").value;
    if (city === "") return;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        let response = await fetch(url);

        if (!response.ok) {
            document.getElementById("error").style.display = "block";
            document.getElementById("weather-box").style.display = "none";
            return;
        }

        let data = await response.json();

        document.getElementById("error").style.display = "none";
        document.getElementById("weather-box").style.display = "block";

        document.getElementById("city-name").innerText = data.name;
        document.getElementById("temp").innerText = Math.round(data.main.temp) + "°C";
        document.getElementById("humidity").innerText = data.main.humidity;
        document.getElementById("wind").innerText = data.wind.speed;

        let icon = data.weather[0].main;
        let imgURL = "";

        if (icon === "Clear") imgURL = "https://cdn-icons-png.flaticon.com/512/6974/6974833.png";
        else if (icon === "Clouds") imgURL = "https://cdn-icons-png.flaticon.com/512/483/483361.png";
        else if (icon === "Rain") imgURL = "https://cdn-icons-png.flaticon.com/512/3076/3076129.png";
        else imgURL = "https://cdn-icons-png.flaticon.com/512/1163/1163624.png";

        document.getElementById("weather-icon").src = imgURL;

    } catch (error) {
        console.log(error);
    }
}
