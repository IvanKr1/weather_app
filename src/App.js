import React, { Component } from "react";
import "./css/App.css";
import { BiSearchAlt } from "react-icons/bi";

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

  getDate = (d) => {
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

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

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

    console.log(`date`, date);

    return `${day}, ${date} ${month} ${year}`;
  };

  render() {
    const { cityName, forecastWeather, currentWeather } = this.state;

    let hours =
      new Date().getHours() < 10
        ? "0" + new Date().getHours()
        : new Date().getHours();
    let minutes =
      new Date().getMinutes() < 10
        ? "0" + new Date().getMinutes()
        : new Date().getMinutes();

    if (currentWeather) {
      if (currentWeather.name === "Donji grad") {
        currentWeather.name = "Zagreb";
      }
    }

    console.log(`forecastWeather`, forecastWeather);
    return (
      <div className="container">
        <div className="input__container">
          <BiSearchAlt className="search__icon" />
          <input
            className="search__input"
            type="text"
            placeholder="Search...."
            onChange={(e) =>
              this.setState({
                cityName: e.target.value,
              })
            }
            value={cityName}
            onKeyPress={(e) => this.searchWeather(e, cityName)}
          />
        </div>
        <div className="body__container">
          <div>{this.getDate(new Date())}</div>
          <div>{`${hours}:${minutes}`}</div>
          <div>{currentWeather ? currentWeather.name : ""}</div>
        </div>
      </div>
    );
  }
}

export default App;
