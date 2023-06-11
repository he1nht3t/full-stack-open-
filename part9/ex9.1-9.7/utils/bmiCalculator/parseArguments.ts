interface Values {
	height: number;
	weight: number;
}

export const parseArguments = (args: Array<string>): Values => {
	if (args.length < 4) throw new Error('Not enough arguments');
	if (args.length > 4) throw new Error('Too many arguments');

	const height = Number(args[2]);
	const weight = Number(args[3]);

	if (!isNaN(height) && !isNaN(weight)) {
		return {
			height,
			weight,
		};
	} else {
		throw new Error('Provided values were not numbers!');
	}
};
