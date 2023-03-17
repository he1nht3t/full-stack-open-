import CountryData from "./CountryData.jsx";

const Country = ({ country, showOnClick }) => {
  return (
    <p>
      {country.name.official} <button onClick={showOnClick}>show</button>
    </p>
  );
};

export default Country;
