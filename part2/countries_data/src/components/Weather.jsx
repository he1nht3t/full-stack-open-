import { useState, useEffect } from "react";

//weather api
import weatherServer from "../server/openWeather";

const Weather = ({ country }) => {
  const [weather, setWeather] = useState(null);
  const [lat, lon] = country.latlng;

  useEffect(() => {
    weatherServer.getWeather(lat, lon).then((weather) => setWeather(weather));
  }, [lat, lon]);

  const iconUrl = `https://openweathermap.org/img/wn/${weather?.weather[0]?.icon}@2x.png`;

  return (
    weather && (
      <>
        <h2>Weather in {country.name.common}</h2>
        <p>Temperature {weather?.main?.temp} Celsius</p>
        <img src={iconUrl} alt={"weather icon"} />
        <p>Wind {weather?.wind?.speed} m/s</p>
      </>
    )
  );
};

export default Weather;
