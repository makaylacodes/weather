
import React, { Component} from 'react';
import './App.css';
import moment from 'moment';

class App extends Component {
  
  state = {
    lat: undefined,
    lon:undefined,
    city:undefined,
    count:undefined,
    temperatureC: undefined,
    temperatureF: undefined,
    icon: undefined,
    sunrise: undefined,
    sunset: undefined,
    errorMessage: undefined,
    wind: undefined,
    max: undefined,
    low: undefined,
    description: undefined,
    date: undefined,
    humidity: undefined,
}

getPosition = () => {
  return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

getWeather = async (latitude, longitude) => {
  const api_call = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&cnt=4&appid=2aa0f988f542adb33292afd7f6bc517f&units=metric`);
  const data = await api_call.json();
  console.log(data);
  this.setState({
    key: process.env.REACT_APP_WEATHER_API_KEY,
    lat: latitude,
    lon: longitude,
    city: data.name,
    count: 4,
    temperatureC: Math.round(data.main.temp),
    temperatureF: Math.round(data.main.temp * 1.8 + 32),
    icon: data.weather[0].icon,
    sunrise: moment.unix(data.sys.sunrise).format("hh:mm a"),
    sunset: moment.unix(data.sys.sunset).format("hh:mm a"),
    wind: data.wind.speed,
    errorMessage: undefined,
    maxC: Math.round(data.main.temp_max),
    lowC: Math.round(data.main.temp_min),
    maxF: Math.round(data.main.temp_max * 1.8 + 32),
    lowF: Math.round(data.main.temp_min * 1.8 + 32),
    description: data.weather[0].description,
    date: undefined,
    humidity: data.main.humidity,

  })
}

componentDidMount(){
  this.getPosition()
  .then((position) => {
    this.getWeather(position.coords.latitude, position.coords.longitude)
  })
  .catch((err) => {
    this.setState({ errorMessage: err.message });
  });

  this.timeID = setInterval(
    () =>
    this.getWeather(this.state.lat, this.state.lon),
    60000
  );
}

componentWillUnmount(){
  clearInterval(this.timeID);
}
render() {
  const { data,key, city, temperatureC, temperatureF, icon, sunrise, sunset, wind, max, low, description, date, maxC, maxF, lowC, lowF, humidity} = this.state;
  if (city){
    return (
      <div className="App">

        <div className="weather-box">
        
        <div className="col">
         <div className="title">
                  {city} 
          </div>
          </div> 
          <div className="col">
            <div className="weather-item">
              <span className="sub"> {moment().format('dddd')} {moment().format('LL')} </span>
            </div> 
          </div>
       
        <div className="row">
        <div className="col">
        <div className="weather-item">
          {temperatureC} &deg;C / {temperatureF} &deg;F<br />
          <img className="weather-icon" src={`http://openweathermap.org/img/w/${icon}.png` }alt="weather icon" />
          <br /><span className="sub"> {description} </span><br /><br />
        </div>
        </div>
</div>
<div className="row">
        <div className="col">
        <div className="weather-item">
            <span>Today's High: {maxC} &deg;C / {maxF} &deg;F</span>
        </div>
        <div className="weather-item">
            <span>Today's Low: {lowC} &deg;C / {lowF} &deg;F</span>
        </div>
        <div className="weather-item">
            <span>Humidity: {humidity} % </span>
          </div>
          </div><div className="col">
          <div className="weather-item">
            <span>Wind: {wind} km/hr</span>
          </div>
          <div className="weather-item">
            <span>Sunrise: {sunrise}</span>
          </div>
          <div className="weather-item">
            <span>Sunset: {sunset} </span>
          </div>
          
      </div>
      </div>
    
     
      <footer id="footer">
            <p >&copy; Copyright 2022 <br />
            Built with &#x2661; by <a href="https://github.com/makaylacodes/weather" target="_blank"> Makayla Anderson-Tucker
        </a>
        </p>
        </footer>
    </div>
    </div>
    );
  }
  else{
    return (
      <div>Loading...</div>
    )
  }
}
}

export default App;