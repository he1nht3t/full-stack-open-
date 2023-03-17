import React from "react";

const Person = ({ person, removePerson }) => {
	return (
		<p>
			{person.name}: {person.number}
			<button onClick={removePerson}>del</button>
		</p>
	);
};

export default Person;
