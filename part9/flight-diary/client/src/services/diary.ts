import axios from 'axios';
import { DiaryEntry, NewDiaryEntry } from '../types';

const baseUrl = 'http://localhost:3000/api/diaries';

export const getAll = async () => {
	const response = await axios.get<DiaryEntry[]>(`${baseUrl}`);
	return response.data;
};

export const getOne = async (id: number) => {
	const response = await axios.get<DiaryEntry>(`${baseUrl}/${id}`);
	return response.data;
};

export const create = async (newEntry: NewDiaryEntry) => {
	const response = await axios.post<DiaryEntry>(baseUrl, newEntry);
	return response.data;
};
