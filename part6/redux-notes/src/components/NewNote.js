//Redux
import { useDispatch } from 'react-redux';
import { createNote } from '../reducers/noteReducer';

const NewNote = (props) => {
	const dispatch = useDispatch();

	const addNote = async (event) => {
		event.preventDefault();
		const content = event.target.note.value;
		dispatch(createNote(content));
		event.target.note.value = '';
	};

	return (
		<form onSubmit={addNote}>
			<input name='note' />
			<button type='submit'>add</button>
		</form>
	);
};

export default NewNote;
