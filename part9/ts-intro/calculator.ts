export type Operation = 'add' | 'multiply' | 'divide';

export const calculate = (a: number, b: number, op: Operation): number => {
	switch (op) {
		case 'add':
			return a + b;
		case 'multiply':
			return a * b;
		case 'divide':
			if (b === 0) {
				throw new Error('Cannot divide by 0');
			}
			return a / b;
		default:
			throw new Error('Operation is not supported');
	}
};

try {
	console.log(calculate(1, 0, 'divide'));
} catch (error) {
	const errorMessage = 'Something went wrong: ';

	if (error instanceof Error) {
		console.log(errorMessage + error.message);
	}
}

calculate(1, 2, 'add');

console.log(process.argv);
