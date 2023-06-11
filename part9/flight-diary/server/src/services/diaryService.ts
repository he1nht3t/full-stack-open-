import diaries from '../../data/entries';

import { DiaryEntry, NonSensitiveDiaryEntry, NewDiaryEntry } from '../types';

const getEntries = (): Array<DiaryEntry> => {
	return diaries;
};

const getNonSensitiveEntries = (): Array<NonSensitiveDiaryEntry> => {
	return diaries.map(({ id, date, weather, visibility }) => ({
		id,
		date,
		weather,
		visibility,
	}));
};

const findById = (id: number): DiaryEntry | undefined => {
	const diary = diaries.find((diary) => id === diary.id);
	return diary;
};

const addEntry = (entry: NewDiaryEntry): DiaryEntry => {
	const newDiaryEntry = {
		id: Math.max(...diaries.map((d) => d.id)) + 1,
		...entry,
	};
	diaries.push(newDiaryEntry);
	return newDiaryEntry;
};

export default {
	getEntries,
	addEntry,
	findById,
	getNonSensitiveEntries,
};
