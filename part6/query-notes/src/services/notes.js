import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const getAllNotes = async () => {
	const response = await axios.get(`${API_URL}/notes`);
	return response.data;
};

export const createNote = async (content) => {
	const object = { content, important: false };
	const response = await axios.post(`${API_URL}/notes`, object);
	return response.data;
};

export const updateNote = async (changedNote) => {
	const response = await axios.put(
		`${API_URL}/notes/${changedNote.id}`,
		changedNote
	);
	return response.data;
};

/* eslint-disable import/no-anonymous-default-export */
