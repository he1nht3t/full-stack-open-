//import { parseArguments } from './utils/exerciseCalculator/parseArguments';

export interface Result {
	periodLength: number;
	trainingDays: number;
	success: boolean;
	rating: number;
	ratingDescription: string;
	target: number;
	average: number;
}

export const calculateExercises = (
	dailyHours: Array<number>,
	target: number
): Result => {
	const periodLength = dailyHours.length;
	const trainingDays = dailyHours.filter((hours) => hours > 0).length;
	const average = dailyHours.reduce((a, b) => a + b, 0) / periodLength;
	const success = average >= target;
	const rating =
		Math.round(average) < target ? 1 : Math.round(average) === target ? 2 : 3;
	const ratingDescription =
		rating < 2
			? 'bad, you should try harder'
			: rating === 2
			? 'not too bad but could be better'
			: 'good, keep it up';
	return {
		periodLength,
		trainingDays,
		success,
		rating,
		ratingDescription,
		target,
		average,
	};
};

try {
	//const { dailyHours, target } = parseArguments(process.argv);
	//console.log(calculateExercises(dailyHours, target));
} catch (error) {
	let errorMessage = 'Something went wrong: ';

	if (error instanceof Error) {
		errorMessage += 'Error: ' + error.message;
	}
	console.log(errorMessage);
}
