import React from "react";

const PersonForm = ({
	handleSubmit,
	newNameValue,
	handleNewName,
	newNumberValue,
	handleNewNumber,
}) => {
	return (
		<form onSubmit={handleSubmit}>
			<div>
				name:{" "}
				<input value={newNameValue} onChange={handleNewName} required />
			</div>
			<div>
				number:
				<input
					value={newNumberValue}
					onChange={handleNewNumber}
					required
				/>
			</div>
			<div>
				<button type="submit">add</button>
			</div>
		</form>
	);
};

export default PersonForm;
