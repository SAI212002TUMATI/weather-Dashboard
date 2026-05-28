import { useState, useEffect } from "react";
import "./Rain.css";
import "./Clear.css";
import "./Clouds.css";
import "./Fog.css";
import "./Spinner.css";

import SearchBar from "./components/SearchBar";

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState("C");
  const [darkMode, setDarkMode] = useState(false);

  // FETCH WEATHER BY CITY
  const fetchWeather = async (city) => {
    setError("");
    setWeather(null);
    setForecast([]);
    setLoading(true);

    try {
      const apiKey =
        import.meta.env.VITE_WEATHER_API_KEY;

      // CURRENT WEATHER
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );

      if (!response.ok) {
        throw new Error("City not found");
      }

      const data = await response.json();

      setWeather(data);

      // FORECAST
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
      );

      const forecastData =
        await forecastResponse.json();

      const dailyForecast =
        forecastData.list.filter((item) =>
          item.dt_txt.includes("12:00:00")
        );

      setForecast(
        dailyForecast.slice(0, 5)
      );

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // FETCH WEATHER BY LOCATION
  const fetchWeatherByLocation = async (
    lat,
    lon
  ) => {
    try {
      const apiKey =
        import.meta.env.VITE_WEATHER_API_KEY;

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );

      const data = await response.json();

      setWeather(data);

      // FORECAST
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );

      const forecastData =
        await forecastResponse.json();

      const dailyForecast =
        forecastData.list.filter((item) =>
          item.dt_txt.includes("12:00:00")
        );

      setForecast(
        dailyForecast.slice(0, 5)
      );

    } catch (err) {
      console.log(err);
    }
  };

  // AUTO LOCATION
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat =
          position.coords.latitude;

        const lon =
          position.coords.longitude;

        fetchWeatherByLocation(
          lat,
          lon
        );
      }
    );
  }, []);

  // TEMPERATURE
  const getTemperature = () => {
    if (!weather || !weather.main)
      return null;

    return unit === "C"
      ? weather.main.temp
      : (weather.main.temp * 9) / 5 + 32;
  };

  // WEATHER ICON
  const getWeatherIcon = () => {
    if (!weather || !weather.weather)
      return "🌈";

    switch (weather.weather[0].main) {
      case "Clear":
        return "🌞";

      case "Clouds":
        return "🌥️";

      case "Rain":
        return "🌧️";

      case "Drizzle":
        return "🌦️";

      case "Thunderstorm":
        return "⛈️";

      case "Snow":
        return "❄️";

      case "Mist":
      case "Fog":
      case "Haze":
        return "🌫️";

      default:
        return "🌍";
    }
  };

  // BACKGROUND
  const getBackground = () => {
    if (!weather)
      return "linear-gradient(to right,#74ebd5,#ACB6E5)";

    switch (weather.weather[0].main) {
      case "Clear":
        return "linear-gradient(to right,#f6d365,#fda085)";

      case "Clouds":
        return "linear-gradient(to right,#bdc3c7,#2c3e50)";

      case "Rain":
      case "Drizzle":
        return "linear-gradient(to right,#4facfe,#00f2fe)";

      case "Thunderstorm":
        return "linear-gradient(to right,#232526,#414345)";

      case "Snow":
        return "linear-gradient(to right,#e6dada,#274046)";

      case "Mist":
      case "Fog":
      case "Haze":
        return "linear-gradient(to right,#757f9a,#d7dde8)";

      default:
        return "linear-gradient(to right,#74ebd5,#ACB6E5)";
    }
  };

  // WEATHER CONDITIONS
  const isRainy =
    weather &&
    ["Rain", "Drizzle", "Thunderstorm"].includes(
      weather.weather[0].main
    );

  const isClear =
    weather &&
    weather.weather[0].main === "Clear";

  const isCloudy =
    weather &&
    weather.weather[0].main === "Clouds";

  const isFoggy =
    weather &&
    ["Mist", "Fog", "Haze"].includes(
      weather.weather[0].main
    );

  // PRECAUTION MESSAGE
  const getPrecaution = () => {

    if (!weather || !weather.weather)
      return null;

    const condition =
      weather.weather[0].main;

    switch (condition) {

      case "Clear":
        return {
          message:
            "☀️ Weather is clear. Stay hydrated outdoors.",
          severity: "safe",
        };

      case "Clouds":
        return {
          message:
            "☁️ Cloudy weather. Keep an eye on possible rain.",
          severity: "moderate",
        };

      case "Rain":
        return {
          message:
            "🌧️ Carry an umbrella and avoid slippery roads.",
          severity: "warning",
        };

      case "Thunderstorm":
        return {
          message:
            "⛈️ Stay indoors and avoid electrical appliances.",
          severity: "danger",
        };

      case "Snow":
        return {
          message:
            "❄️ Wear warm clothes and travel carefully.",
          severity: "warning",
        };

      case "Mist":
      case "Fog":
      case "Haze":
        return {
          message:
            "🌫️ Drive carefully due to low visibility.",
          severity: "moderate",
        };

      default:
        return {
          message:
            "🌍 Stay prepared for weather changes.",
          severity: "safe",
        };
    }
  };

  const precaution = getPrecaution();

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: darkMode
          ? "linear-gradient(to right,#141e30,#243b55)"
          : getBackground(),
        fontFamily: "Arial",
        padding: "40px",
        overflow: "hidden",
        transition: "0.5s ease",
      }}
    >
      {/* ANIMATIONS */}
      {isRainy && (
        <div className="rain"></div>
      )}

      {isClear && (
        <div className="clear"></div>
      )}

      {isCloudy && (
        <div className="clouds"></div>
      )}

      {isFoggy && (
        <div className="fog"></div>
      )}

      {/* TITLE */}
      <h1
        style={{
          color: "white",
          fontSize: "42px",
          marginBottom: "10px",
          zIndex: 1,
        }}
      >
        🌦️ Weather Dashboard
      </h1>

      {/* SUBTITLE */}
      <p
        style={{
          color: "white",
          marginBottom: "20px",
          zIndex: 1,
          fontSize: "18px",
        }}
      >
        Search a city to get live weather updates
      </p>

      {/* SEARCH */}
      <div style={{ zIndex: 1 }}>
        <SearchBar
          onSearch={fetchWeather}
        />
      </div>

      {/* UNIT BUTTON */}
      <button
        onClick={() =>
          setUnit(
            unit === "C" ? "F" : "C"
          )
        }
        style={{
          marginTop: "15px",
          padding: "10px 15px",
          borderRadius: "10px",
          border: "none",
          cursor: "pointer",
          background:
            "rgba(255,255,255,0.2)",
          color: "white",
          fontWeight: "bold",
          backdropFilter: "blur(10px)",
          zIndex: 1,
        }}
      >
        Switch to °
        {unit === "C" ? "F" : "C"}
      </button>

      {/* DARK MODE BUTTON */}
      <button
        onClick={() =>
          setDarkMode(!darkMode)
        }
        style={{
          marginTop: "10px",
          padding: "10px 15px",
          borderRadius: "10px",
          border: "none",
          cursor: "pointer",
          background:
            "rgba(255,255,255,0.2)",
          color: "white",
          fontWeight: "bold",
          backdropFilter: "blur(10px)",
          zIndex: 1,
        }}
      >
        {darkMode
          ? "☀️ Light Mode"
          : "🌙 Dark Mode"}
      </button>

      {/* ERROR */}
      {error && (
        <p
          style={{
            color: "red",
            marginTop: "15px",
            zIndex: 1,
          }}
        >
          {error}
        </p>
      )}

      {/* SPINNER */}
      {loading && (
        <div className="spinner"></div>
      )}

      {/* WEATHER CARD */}
      {weather && (
        <div
          style={{
            marginTop: "25px",
            padding: "25px",
            borderRadius: "20px",
            background:
              "rgba(255,255,255,0.15)",
            backdropFilter:
              "blur(10px)",
            border:
              "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            width: "320px",
            textAlign: "center",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.25)",
            zIndex: 1,
          }}
        >
          {/* ICON */}
          <div
            style={{
              fontSize: "60px",
              marginBottom: "10px",
            }}
          >
            {getWeatherIcon()}
          </div>

          {/* CITY */}
          <h2>{weather.name}</h2>

          {/* TEMP */}
          {getTemperature() !== null && (
            <p
              style={{
                fontSize: "28px",
                margin: "10px 0",
                fontWeight: "bold",
              }}
            >
              🌡️{" "}
              {getTemperature().toFixed(
                1
              )}
              °{unit}
            </p>
          )}

          {/* DESCRIPTION */}
          <p
            style={{
              textTransform:
                "capitalize",
              fontSize: "18px",
            }}
          >
            {
              weather.weather[0]
                .description
            }
          </p>

          {/* EXTRA DETAILS */}
          <div
            style={{
              marginTop: "15px",
              fontSize: "16px",
            }}
          >
            <p>
              💧 Humidity:{" "}
              {weather.main.humidity}%
            </p>

            <p>
              💨 Wind:{" "}
              {weather.wind.speed} m/s
            </p>

            <p>
              🌅 Sunrise:{" "}
              {new Date(
                weather.sys.sunrise *
                  1000
              ).toLocaleTimeString()}
            </p>

            <p>
              🌇 Sunset:{" "}
              {new Date(
                weather.sys.sunset *
                  1000
              ).toLocaleTimeString()}
            </p>
          </div>

          {/* PRECAUTION CARD */}
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              borderRadius: "15px",

              background:
                precaution.severity ===
                "danger"
                  ? "rgba(255,0,0,0.25)"
                  : precaution.severity ===
                    "warning"
                  ? "rgba(255,165,0,0.25)"
                  : precaution.severity ===
                    "moderate"
                  ? "rgba(255,255,0,0.2)"
                  : "rgba(0,255,100,0.2)",

              border:
                precaution.severity ===
                "danger"
                  ? "2px solid red"
                  : precaution.severity ===
                    "warning"
                  ? "2px solid orange"
                  : precaution.severity ===
                    "moderate"
                  ? "2px solid yellow"
                  : "2px solid lightgreen",

              animation:
                precaution.severity ===
                "danger"
                  ? "pulse 1s infinite"
                  : "none",
            }}
          >
            <h3>
              {precaution.severity ===
              "danger"
                ? "🚨 Dangerous"
                : precaution.severity ===
                  "warning"
                ? "⚠️ Warning"
                : precaution.severity ===
                  "moderate"
                ? "🟡 Moderate"
                : "✅ Safe"}
            </h3>

            <p>
              {precaution.message}
            </p>
          </div>
        </div>
      )}

      {/* FORECAST */}
      {forecast.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "15px",
            marginTop: "30px",
            flexWrap: "wrap",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          {forecast.map(
            (item, index) => (
              <div
                key={index}
                style={{
                  background:
                    "rgba(255,255,255,0.15)",
                  backdropFilter:
                    "blur(10px)",
                  padding: "15px",
                  borderRadius: "15px",
                  width: "120px",
                  color: "white",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontWeight:
                      "bold",
                  }}
                >
                  {new Date(
                    item.dt_txt
                  ).toLocaleDateString(
                    "en-US",
                    {
                      weekday:
                        "short",
                    }
                  )}
                </p>

                <h3>
                  {Math.round(
                    item.main.temp
                  )}
                  °
                </h3>

                <p
                  style={{
                    textTransform:
                      "capitalize",
                    fontSize:
                      "14px",
                  }}
                >
                  {
                    item.weather[0]
                      .description
                  }
                </p>
              </div>
            )
          )}
        </div>
      )}

      {/* PULSE ANIMATION */}
      <style>
        {`
          @keyframes pulse {

            0% {
              transform: scale(1);
            }

            50% {
              transform: scale(1.03);
            }

            100% {
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
}

export default App;