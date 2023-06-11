import { useState } from 'react';
import { DiaryEntry, NewDiaryEntry, Weather, Visibility } from '../types';
import { create } from '../services/diary';
import axios from 'axios';

import Notification from './Notification';

const NewDiary = ({
	setDiaryEntries,
}: {
	setDiaryEntries: React.Dispatch<React.SetStateAction<DiaryEntry[]>>;
}) => {
	const [date, setDate] = useState<string>('');
	const [weather, setWeather] = useState<Weather>(Weather.Sunny);
	const [visibility, setVisibility] = useState<Visibility>(Visibility.Good);
	const [comment, setComment] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const submit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const newDiaryEntry: NewDiaryEntry = {
			date,
			weather,
			visibility,
			comment,
		};

		try {
			const savedEntry = await create(newDiaryEntry);

			setDiaryEntries((prevState) => [...prevState, savedEntry]);

			setDate('');
			setWeather(Weather.Sunny);
			setVisibility(Visibility.Good);
			setComment('');
		} catch (error) {
			if (axios.isAxiosError(error)) {
				setErrorMessage(error.response?.data || 'Unknown Error');
			} else {
				console.error(error);
			}
		}
	};

	return (
		<div>
			<h2>Add a new entry</h2>
			<Notification message={errorMessage} type='error' />
			<form onSubmit={submit}>
				<div>
					Date:
					<input
						type='date'
						value={date}
						onChange={({ target }) => setDate(target.value)}
						required
					/>
				</div>
				<div>
					Weather:
					<select
						value={weather}
						onChange={({ target }) => setWeather(target.value as Weather)}>
						{Object.values(Weather).map((weather) => (
							<option key={weather} value={weather}>
								{weather}
							</option>
						))}
					</select>
				</div>
				<div>
					Visibility:
					<select
						value={visibility}
						onChange={({ target }) =>
							setVisibility(target.value as Visibility)
						}>
						{Object.values(Visibility).map((visibility) => (
							<option key={visibility} value={visibility}>
								{visibility}
							</option>
						))}
					</select>
				</div>
				<div>
					Comment:
					<textarea
						value={comment}
						onChange={({ target }) => setComment(target.value)}
					/>
				</div>
				<button type='submit'>Save</button>
			</form>
		</div>
	);
};

export default NewDiary;
