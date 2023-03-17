import React from "react";
const Search = ({ searchTerm, handleSearch }) => {
  return (
    <form>
      <span>find countries:</span>
      <input value={searchTerm} onChange={handleSearch} />
    </form>
  );
};

export default Search;
