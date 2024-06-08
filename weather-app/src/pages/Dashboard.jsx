import { useState } from "react";
import "./dashboard.css";
import { MagnifyingGlass } from "react-loader-spinner";
import axios from "axios";


//Return Current Month and Day and Date
const toDate = () => {
    const months = [
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
        "Nocvember",
        "December",
    ];
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const currentDate = new Date();
    const date = `${days[currentDate.getDay()]} ${currentDate.getDate()} ${
        months[currentDate.getMonth()]
    }`;
    return date;
};

// Check if object is empty for initial condition
function isEmpty(obj) {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false;
      }
    }
  
    return true;
  }

const Dashboard = () => {

    //store search query
    const [query, setQuery] = useState();

    //store fetched weather
    const [weather, setWeather] = useState({
        loading: false,
        data: {},
        error: false,
    });


    // Call and Api and store state in weather
    const search = async () => {
        setQuery("");
        setWeather({ ...weather, loading: true });

        //Api url and my api id
        const url = "https://api.openweathermap.org/data/2.5/weather";
        const appid = "2e108a2876d0a030a58cf5914db65719";


        //axios library to fetch api
        await axios
            .get(url, {
                params: {
                    q: query,
                    units: "metric",
                    appid: appid,
                },
            })
            .then((res) => {
                setWeather({
                    data: res.data,
                    loading: false,
                    error: false,
                });
            })
            .catch((error) => {
                setWeather({ ...weather, data: {}, error: true });
                setQuery("");
            });
    };

    return (
        <div className="dashboard-container">

            {/* Header of Page */}
            <div className="dashboard-header">
                <div className="dashboard-nav">
                    <div className="db-logo">
                        <h4>
                            The Weather <br /> App
                        </h4>
                    </div>
                    <div className="db-date">{toDate()}</div>
                </div>

                {/* Search Bar */}
                <div className="dashboard-search">
                    <input
                        type="text"
                        className="city-search"
                        placeholder="Enter City or Pincode"
                        name="query"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    <button className="search-btn" onClick={search}>
                        Search
                    </button>
                </div>
            </div>

            <div className="dashboard-body">

                {/* Loader if current fetching */}
                {weather.loading && (
                    <div className="loader">
                        <MagnifyingGlass
                            visible={true}
                            height="80"
                            width="80"
                            ariaLabel="magnifying-glass-loading"
                            wrapperStyle={{}}
                            wrapperClass="magnifying-glass-wrapper"
                            glassColor="#c0efff"
                            color="#e15b64"
                        />
                    </div>
                )}


                {/* Show Error if error in fetching */}
                {weather.error && (
                    <>
                        <div className="error-message">
                            <span>Sorry, City not found</span>
                        </div>
                    </>
                )}

                {/* Show weather when data is added in state */}
                {weather && weather.data && weather.data.main && (
                    <div className="weather-card">
                        <div className="city-name">
                            <h2>
                                {weather.data.name},{" "}
                                <span>{weather.data.sys.country}</span>
                            </h2>
                        </div>
                        <div className="date">
                            <span>{toDate()}</span>
                        </div>
                        <div className="icon-temp">
                            <img
                                className=""
                                src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
                                alt={weather.data.weather[0].description}
                            />
                            {Math.round(weather.data.main.temp)}
                            <sup className="deg">&deg;C</sup>
                        </div>
                        <div className="des-wind">
                            <p>
                                {weather.data.weather[0].description.toUpperCase()}
                            </p>
                            <p>Wind Speed: {weather.data.wind.speed}m/s</p>
                        </div>
                    </div>
                )}

                {/* Initially when no data is present */}
                {isEmpty(weather.data) && !weather.error &&  (
                    <div className="weather-empty">
                        Explore current weather data of more than 200,000 cities!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
