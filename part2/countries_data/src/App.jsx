import { useState, useEffect } from "react";

//countries data
import countriesServer from "./server/countries";

//components
import Search from "./components/Search";
import Country from "./components/Country";
import CountryData from "./components/CountryData.jsx";

function App() {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCountry, setShowCountry] = useState(null);

  useEffect(() => {
    countriesServer.getCountries().then((countries) => setCountries(countries));
  }, []);

  const countriesToShow = searchTerm
    ? countries.filter((country) =>
        country.name.official.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : countries.slice(0, 10);

  const showOnClick = (country) => {
    setShowCountry(country);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setShowCountry(null);
  };

  return (
    <>
      <Search searchTerm={searchTerm} handleSearch={handleSearch} />

      {countriesToShow.length > 10 && (
        <p>Too many matches, specify another filter.</p>
      )}

      {countriesToShow.length > 1 &&
        countriesToShow.length < 10 &&
        countriesToShow.map((country) => (
          <Country
            key={country.name.common}
            country={country}
            showOnClick={() => showOnClick(country)}
          />
        ))}

      {showCountry && <CountryData country={showCountry} />}

      {countriesToShow.length === 1 && (
        <CountryData country={countriesToShow[0]} />
      )}
    </>
  );
}

export default App;
