import { useState, useEffect } from 'react';

import { Note } from './types';
import { getAllNotes, createNote } from './services/note';

const App = () => {
	const [newNote, setNewNote] = useState('');
	const [notes, setNotes] = useState<Note[]>([{ id: 1, content: 'note 1' }]);

	useEffect(() => {
		(async () => {
			const notes = await getAllNotes();
			setNotes(notes);
		})();
	}, []);

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();

		const note = await createNote({
			content: newNote,
		});
		setNotes(notes.concat(note));

		setNewNote('');
	};

	return (
		<>
			<h1>Notes</h1>

			<div>
				<ul>
					{notes.map((note) => (
						<li key={note.id}>{note.content}</li>
					))}
				</ul>
			</div>

			<div>
				<form onSubmit={handleSubmit}>
					<input
						type='text'
						value={newNote}
						onChange={(e) => setNewNote(e.target.value)}
					/>
					<button type='submit'>Save</button>
				</form>
			</div>
		</>
	);
};

export default App;
