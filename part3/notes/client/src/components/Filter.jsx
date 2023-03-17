import React from "react";

const Filter = ({ showAll, setShowAll }) => {
	return (
		<div>
			<button onClick={() => setShowAll(!showAll)}>
				show {showAll ? "important" : "all"}
			</button>
		</div>
	);
};

export default Filter;
