interface Result {
	dailyHours: Array<number>;
	target: number;
}

export const parseArguments = (args: Array<string>): Result => {
	if (args.length < 5) throw new Error('Not enough arguments');

	const dailyHours = args.slice(3).map((arg) => {
		if (!isNaN(Number(arg))) return Number(arg);
		else throw new Error('Provided values were not numbers!');
	});

	if (!isNaN(Number(args[2]))) return { dailyHours, target: Number(args[2]) };
};
