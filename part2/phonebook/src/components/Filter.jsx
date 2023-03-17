import React from "react";

const Filter = ({ inputValue, handleChange }) => {
	return (
		<>
			<p>
				Filter show with:{" "}
				<input value={inputValue} onChange={handleChange} />
			</p>
		</>
	);
};

export default Filter;
