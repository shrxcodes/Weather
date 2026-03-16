const cityInput=document.querySelector('.city-input');
const searchBtn=document.querySelector('.search-btn');
const notfoundsection=document.querySelector('.search-not-found');
const searchcitysection=document.querySelector('.search-city');
const weathersection=document.querySelector('.weather-info');


const countryname=document.querySelector('.country-txt');
const temperature=document.querySelector('.temp-txt');
const maincondition=document.querySelector('.condition-txt');
const humid=document.querySelector('.humidity-value');
const windy=document.querySelector('.wind-value');
const weathersummaryimg=document.querySelector('.weather-summary-img');
const currentdate=document.querySelector('.current-date-txt');
const forecastitemscontainer=document.querySelector('.forecast-container');
const hourlyContainer = document.querySelector('.hourly-forecast-container');

const hourlySideList = document.querySelector('.hourly-side-list');

const hourlyWrapper = document.querySelector('.hourly-wrapper');


const apikey='21bf82b7ca5fec9f07b05ed50886dd68'
searchBtn.addEventListener('click',() =>{
    if(cityInput.value.trim()!=''){
        updateweatherinfo(cityInput.value)
        cityInput.value=''
        cityInput.blur()
    }
})
cityInput.addEventListener('keydown',(event)=>{
    if(event.key=='Enter' && cityInput.value.trim() !=''){
        updateweatherinfo(cityInput.value)
        cityInput.value=''
        cityInput.blur()
    }
}) 

async function getFetchData(endPoint,city){
  const apiurl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apikey}&units=metric`;//endpoint is weather stating what type of data we want
  const response=await fetch(apiurl)
  return response.json()
}

function getweathericon(id) {
    if (id >= 200 && id < 300) return 'thunder.png';
    if (id >= 300 && id < 400) return 'drizzle.png';
    if (id >= 500 && id < 600) return 'rainy.png';
    if (id >= 600 && id < 700) return 'snow.svg';
    if (id >= 700 && id < 800) return 'foggy.png';
    if (id === 800) return 'clear.png';
    if (id > 800 && id <= 804) return 'cloudy.png';
    return 'clouds.svg';
}

function getcurrentdate(){
    const currentDate=new Date()
    const options={
        weekday:'short',
        day:'2-digit',
        month:'short'
    }
    return currentDate.toLocaleDateString('en-GB',options)
}


async function updateweatherinfo(city){
    const weatherdata= await getFetchData('weather',city)
    if(weatherdata.cod !=200){
        showdisplaysection(notfoundsection)
        hourlyWrapper.style.display = 'none'; // hide if error
        return
    }
    const{
        name:country,
        main:{temp,humidity},
        weather:[{id,main}],
        wind:{speed}
    }=weatherdata

    countryname.textContent=country
    temperature.textContent=Math.round(temp) + ' °C'
    humid.textContent=humidity+'%'
    maincondition.textContent=main
    windy.textContent=speed+ ' m/s'
    weathersummaryimg.src=`images/${getweathericon(id)}`

    currentdatetxt=getcurrentdate()
    currentdate.textContent=currentdatetxt

    await updateforecastinfo(city)
    await updateHourlySideForecast(city);
    showdisplaysection(weathersection)
        hourlyWrapper.style.display = 'flex';

}

// async function updateforecastinfo(city){
//     const forecastdata=await getFetchData('forecast',city)

//     const timetaken='12:00:00'
//     const todaydate=new Date().toISOString().split('T')[0]
//     forecastitemscontainer.innerHTML=''
//     forecastdata.list.forEach(forecastweather =>{
//         if(forecastweather.dt_txt.includes(timetaken) && 
//     !forecastweather.dt_txt.includes(todaydate)){
//         updateforecast(forecastweather)
//     }
//     })
// }
async function updateforecastinfo(city) {
    const forecastdata = await getFetchData('forecast', city);

    const todaydate = new Date().toISOString().split('T')[0];
    const dailyForecast = {};

    forecastitemscontainer.innerHTML = '';

    forecastdata.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];

        
        if (date === todaydate) return;

        if (!dailyForecast[date]) {
            dailyForecast[date] = {
                temps: [],
                weatherId: item.weather[0].id,
                dateText: item.dt_txt
            };
        }

        dailyForecast[date].temps.push(item.main.temp);
    });
    Object.keys(dailyForecast).slice(0, 5).forEach(date => {
        updateforecastMinMax(dailyForecast[date]);
    });
}

function updateforecastMinMax(data) {
    const temps = data.temps;
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);

    const dateObj = new Date(data.dateText);

    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const dateText = dateObj.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short'
    });

    const forecastitem = `
        <div class="forecast-item">
            <h5 class="forecast-date">${dateText}</h5>
            <h5 class="forecast-day">${dayName}</h5>
            <img src="images/${getweathericon(data.weatherId)}" class="forecast-img">

            <h5 class="forecast-temp">
                <span class="temp-max">${Math.round(maxTemp)}°C</span>
                <span class="temp-min">${Math.round(minTemp)}°C</span>
            </h5>
        </div>
    `;

    forecastitemscontainer.insertAdjacentHTML('beforeend', forecastitem);
}


// function updateforecast(forecastweatherdata){
//     const{
//         dt_txt:date,
//         weather: [{id}],
//         main:{temp},
//     }=forecastweatherdata

//     const datetaken=new Date(date)
//     const dateoption={
//         day:'2-digit',
//         month:'short'
//     }
//     const dateresult=datetaken.toLocaleDateString('en-US',dateoption)

//     const dayoption = { weekday: 'short' };
//     const dayname = datetaken.toLocaleDateString('en-US', dayoption);


//     const forecastitem=`
//     <div class="forecast-item">
//                 <h5 class="forecast-date">${dateresult}</h5>
//                 <h5 class="forecast-date">${dayname}</h5>
//                 <img src="images/${getweathericon(id)}" class="forecast-img">
// <h5 class="forecast-temp">
//     <span class="temp-min">Min-${Math.round(minTemp)}°</span> <br>
//     <span class="temp-max">Max-${Math.round(maxTemp)}°</span>
// </h5>
//             </div>
//     `
//     forecastitemscontainer.insertAdjacentHTML('beforeend',forecastitem)
// }


function showdisplaysection(section){
[weathersection,searchcitysection,notfoundsection].forEach(section => section.style.display='none')

section.style.display='block'
}


async function updateHourlySideForecast(city) {
    const forecastdata = await getFetchData('forecast', city);

    const hourlySideList = document.querySelector('.hourly-side-list');
    hourlySideList.innerHTML = '';

    // Take next 6 forecast entries (each is 3-hour gap)
    forecastdata.list.slice(0, 6).forEach(item => {

        // Convert API time → readable hour (3 PM)
        const time = new Date(item.dt_txt).toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true
        });

        const temp = Math.round(item.main.temp);
        const condition = item.weather[0].main;
        const icon = getweathericon(item.weather[0].id);

        const hourlyItem = `
            <div class="hourly-side-item">
                <div class="hourly-time"><strong>${time}</strong></div>

                <div class="hourly-center">
                    <img src="images/${icon}" alt="${condition}">
                    <span class="hourly-condition"><strong>${condition}</strong></span>
                </div>

                <div class="hourly-temp"><strong>${temp}°C</strong></div>
            </div>
        `;

        hourlySideList.insertAdjacentHTML('beforeend', hourlyItem);
    });
}
