import axios from 'axios';
import { Note, NewNote } from '../types';

const baseUrl = `${import.meta.env.VITE_BASE_URL}/notes`;

export const getAllNotes = async (): Promise<Note[]> => {
	const response = await axios.get<Note[]>(baseUrl);
	return response.data;
};

export const createNote = async (newObject: NewNote): Promise<Note> => {
	const response = await axios.post<Note>(baseUrl, newObject);
	return response.data;
};
