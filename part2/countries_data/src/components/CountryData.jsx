import Weather from "./Weather.jsx";

const CountryData = ({ country }) => {
  return (
    country && (
      <>
        <h1>
          {country.name.official}{" "}
          <span style={{ fontSize: 18, color: "grey" }}>
            ({country.name.common})
          </span>
        </h1>

        <p>Capital: {country.capital}</p>
        <p>Area: {country.area}</p>
        <b>Language:</b>
        <ul>
          {Object.values(country.languages).map((lannguage, index) => (
            <li key={index}>{lannguage}</li>
          ))}
        </ul>
        <img
          src={country.flags.png}
          alt={country.flags.alt}
          width={"200px"}
          height={"200px"}
        />

        <Weather country={country} />
      </>
    )
  );
};

export default CountryData;
