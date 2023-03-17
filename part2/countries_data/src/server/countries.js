import axios from "axios";

const baseUrl = "https://restcountries.com/v3.1";

const getCountries = () => {
  const response = axios.get(`${baseUrl}/all`);
  return response.then((response) => response.data);
};

export default { getCountries };
