import { createSlice } from '@reduxjs/toolkit';

//services
import noteService from '../services/notes';

const noteSlice = createSlice({
	name: 'notes',
	initialState: [],
	reducers: {
		appendNote: (state, action) => {
			state.push(action.payload);
		},
		toggleImportanceOf: (state, action) => {
			const changedNote = action.payload;
			//
			console.log(JSON.parse(JSON.stringify(state)));

			return state.map((note) =>
				note.id !== changedNote.id ? note : changedNote
			);
		},
		setNotes: (state, action) => {
			return action.payload;
		},
	},
});

export const { appendNote, toggleImportanceOf, setNotes } = noteSlice.actions;

export const initializeNotes = () => {
	return async (dispatch) => {
		const notes = await noteService.getAll();
		dispatch(setNotes(notes));
	};
};

export const createNote = (content) => {
	return async (dispatch) => {
		const newNote = await noteService.create(content);
		dispatch(appendNote(newNote));
	};
};

export const updateNote = (note) => {
	return async (dispatch) => {
		const updatedNote = await noteService.update(note.id, note);
		dispatch(toggleImportanceOf(updatedNote));
	};
};

export default noteSlice.reducer;
