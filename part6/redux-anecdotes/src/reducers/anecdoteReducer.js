import { createSlice } from '@reduxjs/toolkit';

//Services
import anecdoteService from '../services/anecdotes';

const anecdoteSlice = createSlice({
	name: 'anecdote',
	initialState: [],
	reducers: {
		setAnecdotes: (state, action) => {
			return action.payload;
		},
		vote: (state, action) => {
			const changedAnecdote = action.payload;
			return state.map((anecdote) =>
				anecdote.id !== changedAnecdote.id ? anecdote : changedAnecdote
			);
		},
		create: (state, action) => {
			const anecdote = action.payload;
			return [...state, anecdote];
		},
	},
});

export const { vote, create, setAnecdotes } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
	return async (dispatch) => {
		const anecdotes = await anecdoteService.getAll();
		dispatch(setAnecdotes(anecdotes));
	};
};

export const voteAnecdote = (anecdote) => {
	return async (dispatch) => {
		const updatedAnecdote = await anecdoteService.update(anecdote.id, anecdote);
		dispatch(vote(updatedAnecdote));
	};
};

export const createAnecdote = (content) => {
	return async (dispatch) => {
		const newAnecdote = await anecdoteService.create(content);
		dispatch(create(newAnecdote));
	};
};

export default anecdoteSlice.reducer;
