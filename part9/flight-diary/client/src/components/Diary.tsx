import { DiaryEntry } from '../types';

const Diary = ({ diary }: { diary: DiaryEntry }) => {
	return (
		<>
			<h3>{diary.date}</h3>
			<div>
				<p>Visibility: {diary.visibility}</p>
			</div>
			<div>
				<p>Weather: {diary.weather}</p>
			</div>
			<hr />
		</>
	);
};

export default Diary;
