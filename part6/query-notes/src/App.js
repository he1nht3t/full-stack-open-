import { useQuery, useQueryClient, useMutation } from 'react-query';

//services
import { getAllNotes, createNote, updateNote } from './services/notes';

const App = () => {
	const queryClient = useQueryClient();

	const { data: notes, isLoading } = useQuery('notes', getAllNotes);

	const newNoteMutation = useMutation(createNote, {
		onSuccess: (newNote) => {
			const notes = queryClient.getQueryData('notes');
			queryClient.setQueryData('notes', [...notes, newNote]);
		},
	});

	const toggleImportanceMutation = useMutation(updateNote, {
		onSuccess: (changedNote) => {
			const notes = queryClient.getQueryData('notes');
			queryClient.setQueryData(
				'notes',
				notes.map((note) => (note.id !== changedNote.id ? note : changedNote))
			);
		},
	});

	console.log(notes, isLoading);

	const addNote = async (event) => {
		event.preventDefault();
		const content = event.target.note.value;
		event.target.note.value = '';
		newNoteMutation.mutate(content);
	};

	const toggleImportance = (note) => {
		const changedNote = { ...note, important: !note.important };
		toggleImportanceMutation.mutate(changedNote);
	};

	console.log('New note loading ', newNoteMutation.isLoading);
	console.log('Toggle importance loading ', toggleImportanceMutation.isLoading);

	if (
		isLoading ||
		newNoteMutation.isLoading ||
		toggleImportanceMutation.isLoading
	) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<h2>Notes app</h2>
			<form onSubmit={addNote}>
				<input name='note' required />
				<button type='submit'>add</button>
			</form>
			{notes.map((note) => (
				<li key={note.id} onClick={() => toggleImportance(note)}>
					{note.content}
					<strong> {note.important ? 'important' : ''}</strong>
				</li>
			))}
		</div>
	);
};

export default App;
