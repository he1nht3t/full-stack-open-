import { DiaryEntry } from '../types';
import Diary from './Diary';

const Diaries = ({ diaries }: { diaries: Array<DiaryEntry> }) => {
	return (
		<div>
			<h2>Diary Entries</h2>
			{diaries.map((diary: DiaryEntry) => (
				<Diary key={diary.id} diary={diary} />
			))}
		</div>
	);
};

export default Diaries;
