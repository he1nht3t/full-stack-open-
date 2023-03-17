import axios from "axios";

const baseUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${
  import.meta.env.VITE_OPEN_WEATHER_API
}`;

const getWeather = (lat, lon) => {
  const req = axios.get(`${baseUrl}&lat=${lat}&lon=${lon}`);
  return req.then((res) => res.data);
};

export default { getWeather };
