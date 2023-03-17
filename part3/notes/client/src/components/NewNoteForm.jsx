import React from "react";

const NewNoteForm = ({ handleSubmit, newNote, handleNoteChange }) => {
	return (
		<form onSubmit={handleSubmit}>
			<input value={newNote} onChange={handleNoteChange} />
			<button type="submit">save</button>
		</form>
	);
};

export default NewNoteForm;
