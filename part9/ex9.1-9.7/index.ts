import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();

app.use(express.json());

app.get('/bmi', (req, res) => {
	const { height, weight } = req.query;

	if (!height || !weight) {
		res.status(400).json({ error: 'malformatted parameters' });
		return;
	}
	const bmi = calculateBmi(Number(height), Number(weight));
	res.json({ height, weight, bmi });
});

app.post('/exercises', (req, res) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { daily_exercises, target } = req.body;

	if (!daily_exercises || !target) {
		res.status(400).json({ error: 'parameters missing' });
		return;
	}

	if (!Array.isArray(daily_exercises) || isNaN(Number(target))) {
		res.status(400).json({ error: 'malformatted parameters' });
		return;
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	const result = calculateExercises(daily_exercises, Number(target));
	res.json(result);
});

const PORT = 3002;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
