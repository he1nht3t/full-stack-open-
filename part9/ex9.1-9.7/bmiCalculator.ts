import { parseArguments } from './utils/bmiCalculator/parseArguments';

export const calculateBmi = (height: number, weight: number): string => {
	const bmi = weight / Math.pow(height / 100, 2);
	if (bmi < 18.5) return 'Underweight';
	if (bmi < 25) return 'Normal (healthy weight)';
	if (bmi < 30) return 'Overweight';
	return 'Obese';
};

try {
	const { height, weight } = parseArguments(process.argv);
	console.log(calculateBmi(height, weight));
} catch (error) {
	let errorMessage = 'Something went wrong: ';
	if (error instanceof Error) {
		errorMessage += 'Error: ' + error.message;
	}

	console.log(errorMessage);
}
