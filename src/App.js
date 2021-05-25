import React, { Component } from "react";
import "./scss/App.scss";
import Wind from "./assests/wind.png";
import Rain from "./assests/rain.png";
import Cloud from "./assests/cloud.png";

const API_KEY = "dcccaa9d82acf4db1b7cc97d1fdefa87";

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cityName: "",
      currentWeather: null,
      forecastWeather: null,
    };
  }

  searchWeather = (e, cityName) => {
    if (e.key === "Enter") {
      let formatName = cityName.toLowerCase().split("");

      formatName =
        formatName[0].toUpperCase() +
        formatName.slice(1, formatName.length).join("");

      // Fetch current weather Data
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${formatName}&appid=${API_KEY}&units=metric`
      )
        .then((res) => res.json())
        .then((result) => {
          this.setState({
            currentWeather: result,
            cityName: "",
          });
        });

      // Fetch 3 hours forecast
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${formatName}&appid=${API_KEY}&units=metric`
      )
        .then((res) => res.json())
        .then((result) => {
          this.setState({
            forecastWeather: result,
          });
        });
    }
  };

  getDate = (weather) => {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    let localDate = this.getLocalTime(weather);

    let day = days[localDate.getDay()];
    let date = localDate.getDate();
    let month = months[localDate.getMonth()];

    switch (date) {
      case 1:
        date = date + "st";
        break;
      case 2:
        date = date + "nd";
        break;
      case 3:
        date = date + "rd";
        break;
      default:
        date = date + "th";
    }
    return `${day}, ${date} ${month}`;
  };

  formatTime = (weather) => {
    let date = this.getLocalTime(weather) || new Date(weather);

    // Format Time to am/pm
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let strTime = hours + ":" + minutes + ampm;

    return strTime;
  };

  getLocalTime = (weather) => {
    if (typeof weather === "object") {
      let date;
      let localTime = new Date().getTime();
      let localOffset = new Date().getTimezoneOffset() * 60000;
      let utc = localTime + localOffset;
      date = new Date(utc + 1000 * weather.timezone);

      return date;
    }

    return false;
  };

  render() {
    const { cityName, forecastWeather, currentWeather } = this.state;

    if (currentWeather) {
      if (currentWeather.name === "Donji grad") {
        currentWeather.name = "Zagreb";
      }
    }

    console.log(`currentWeather`, currentWeather);

    return (
      <div className="container">
        <div className="input__container">
          <input
            className="search__input"
            type="text"
            placeholder="Search..."
            onChange={(e) => {
              this.setState({
                cityName: e.target.value,
              });
            }}
            value={cityName}
            onKeyPress={(e) => this.searchWeather(e, cityName)}
          />
        </div>
        {currentWeather && forecastWeather ? (
          <React.Fragment>
            <div className="description__container">
              <div className="description__date">
                {currentWeather ? this.getDate(currentWeather) : ""}
              </div>
              <div className="description__time">
                {currentWeather ? this.formatTime(currentWeather) : ""}
              </div>
              <div className="description__cityName">{currentWeather.name}</div>
              <div className="description__image__container">
                <div className="description_temp">
                  {`${Math.round(currentWeather.main.temp)}°c`}
                </div>
                <img
                  className="description__weatherImage"
                  src={`http://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`}
                  style={{ width: "3rem", height: "3rem", marginLeft: "1rem" }}
                  alt="Weather icon"
                />
              </div>
            </div>
            <div className="weather__container">
              <div className="weather__wind">
                <img
                  className="weather__img"
                  style={{ width: "2rem", height: "2rem" }}
                  src={Wind}
                  alt="wind icon"
                />
                <div className="weather__text">{`${currentWeather.wind.speed} km/h`}</div>
              </div>
              <p className="border"></p>
              <div className="weather__rain">
                <img
                  className="weather__img"
                  style={{ width: "2rem", height: "2rem" }}
                  src={Rain}
                />
                <div className="weather__text">{`${currentWeather.main.humidity}%`}</div>
              </div>
              <p className="border"></p>
              <div className="weather__cloud">
                <img
                  className="weather__img"
                  style={{ width: "2rem", height: "2rem" }}
                  src={Cloud}
                />
                <div className="weather__text">{`${currentWeather.clouds.all}%`}</div>
              </div>
            </div>
            <div className="border__footer"></div>
            <div className="forecast__container">
              {forecastWeather.list.map((weatherData, index) => {
                if (index <= 3) {
                  console.log(`weatherData`, weatherData);
                  return (
                    <div>
                      <div className="forecast__time">
                        <div className="weather__text">
                          {this.formatTime(weatherData.dt_txt).replace(
                            ":00",
                            ""
                          )}
                        </div>
                      </div>
                      <img
                        className="description__weatherImage"
                        src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
                        style={{
                          width: "2.5rem",
                          height: "2.5rem",
                        }}
                        alt="Weather icon"
                      />
                      <div className="forecast__temp weather__text">{`${Math.round(
                        weatherData.main.temp
                      )}°c`}</div>
                    </div>
                  );
                }
              })}
            </div>
          </React.Fragment>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default App;
