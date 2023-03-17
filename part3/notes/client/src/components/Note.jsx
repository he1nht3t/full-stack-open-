const Note = ({ note, toggleImportance, delNote }) => {
	const label = note.important ? "make not important" : "make important";

	return (
		<li className="note">
			<button onClick={toggleImportance}>{label}</button>
			{note.content}
			<button onClick={delNote}>del</button>
		</li>
	);
};

export default Note;
