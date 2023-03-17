import { useEffect, useState } from "react";

//services
import noteService from "./services/notes";

//components
import Note from "./components/Note";
import NewNoteForm from "./components/NewNoteForm";
import Filter from "./components/Filter";
import Notification from "./components/Notification";
import Footer from "./components/Footer";

const App = () => {
	const [notes, setNotes] = useState([]);
	const [newNote, setNewNote] = useState("");
	const [showAll, setShowAll] = useState(true);
	const [errorMessage, setErrorMessage] = useState(null);

	const api = "http://localhost:3001";

	useEffect(() => {
		noteService.getAll().then(initialNotes => {
			setNotes(initialNotes);
		});
	}, []);

	const addNote = e => {
		e.preventDefault();

		const noteObject = {
			content: newNote,
			important: Math.random() < 0.5,
		};

		noteService.create(noteObject).then(returnedNote => {
			setNotes(notes.concat(returnedNote));
			setNewNote("");
		});
	};

	const delNote = id => {
		noteService.remove(id).then(res => {
			setNotes(notes.filter(n => n.id !== id));
		});
	};

	const handleNoteChange = e => {
		setNewNote(e.target.value);
	};

	const toggleImportanceOf = id => {
		const note = notes.find(n => n.id === id);
		const changedNote = { ...note, important: !note.important };

		noteService
			.update(id, changedNote)
			.then(returnedNote => {
				setNotes(notes.map(n => (n.id !== id ? n : returnedNote)));
			})
			.catch(error => {
				setErrorMessage(
					`Note "${note.content}" was already deleted from server!`
				);

				setTimeout(() => {
					setErrorMessage(null);
				}, 5000);
				setNotes(notes.filter(note => note.id !== id));
			});
	};

	const notesToShow = showAll ? notes : notes.filter(note => note.important);

	return (
		<div>
			<h1>Notes</h1>

			<Notification message={errorMessage} />

			<Filter showAll={showAll} setShowAll={setShowAll} />

			<ul>
				{notesToShow.map(note => (
					<Note
						key={note.id}
						note={note}
						toggleImportance={() => toggleImportanceOf(note.id)}
						delNote={() => delNote(note.id)}
					/>
				))}
			</ul>

			<NewNoteForm
				handleNoteChange={handleNoteChange}
				newNote={newNote}
				handleSubmit={addNote}
			/>

			<Footer />
		</div>
	);
};

export default App;
