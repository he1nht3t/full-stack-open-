import { useDispatch, useSelector } from 'react-redux';
import { updateNote } from '../reducers/noteReducer';

const Note = ({ note, handleClick }) => {
	return (
		<li onClick={handleClick}>
			{note.content}
			<strong> {note.important ? 'important' : ''}</strong>
		</li>
	);
};

const Notes = () => {
	const dispatch = useDispatch();
	const notes = useSelector(({ filter, notes }) => {
		if (filter === 'ALL') {
			return notes;
		}
		return filter === 'IMPORTANT'
			? notes.filter((note) => note.important)
			: notes.filter((note) => !note.important);
	});

	const handleClick = (note) => {
		const changedNote = {
			...note,
			important: !note.important,
		};
		dispatch(updateNote(changedNote));
	};

	console.log('notes', notes);

	return (
		<ul>
			{notes.map((note) => (
				<Note key={note.id} note={note} handleClick={() => handleClick(note)} />
			))}
		</ul>
	);
};

export default Notes;
