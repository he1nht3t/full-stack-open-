import { useState, useEffect } from 'react';
import { DiaryEntry } from './types';
import { getAll } from './services/diary';

import Diaries from './components/Diaries';
import NewDiary from './components/NewDiary';

const App = () => {
	const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);

	const fetchDiaryEntries = async () => {
		const entries = await getAll();
		setDiaryEntries(entries);
	};

	useEffect(() => {
		fetchDiaryEntries();
	}, []);

	return (
		<>
			<h1>Flight Diary</h1>
			<NewDiary setDiaryEntries={setDiaryEntries} />
			<Diaries diaries={diaryEntries} />
		</>
	);
};

export default App;
