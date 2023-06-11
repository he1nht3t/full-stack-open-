import { NewPatient, Gender, NewEntry, HealthCheckRating } from './types';

const isString = (text: unknown): text is string => {
	return typeof text === 'string' || text instanceof String;
};

const parseString = (text: unknown): string => {
	if (!text || !isString(text)) {
		throw new Error('Incorrect or missing: ' + text);
	}

	return text;
};

const isDate = (date: string): boolean => {
	return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
	if (!date || !isString(date) || !isDate(date)) {
		throw new Error('Incorrect or missing date: ' + date);
	}

	return date;
};

const isGender = (param: string): param is Gender => {
	return Object.values(Gender)
		.map((g) => g.toString())
		.includes(param);
};

const parseGender = (gender: unknown): Gender => {
	if (!gender || !isString(gender) || !isGender(gender)) {
		throw new Error('Incorrect or missing gender: ' + gender);
	}

	return gender;
};

export const toNewPatientEntry = (object: unknown): NewPatient => {
	if (!object || typeof object !== 'object') {
		throw new Error('Incorrect or missing data');
	}

	if (
		'name' in object &&
		'dateOfBirth' in object &&
		'gender' in object &&
		'occupation' in object &&
		'ssn' in object &&
		'entries' in object
	) {
		const newEntry: NewPatient = {
			name: parseString(object.name),
			dateOfBirth: parseDate(object.dateOfBirth),
			gender: parseGender(object.gender),
			ssn: parseString(object.ssn),
			occupation: parseString(object.occupation),
			entries: object.entries as NewPatient['entries'],
		};

		return newEntry;
	}

	throw new Error('Incorrect data, some fields are missing.');
};

///

const isEntryType = (param: string): boolean => {
	return ['Hospital', 'OccupationalHealthcare', 'HealthCheck'].includes(param);
};

const parseEntryType = (entryType: unknown): string => {
	if (!entryType || !isString(entryType) || !isEntryType(entryType)) {
		throw new Error('Incorrect or missing entry type: ' + entryType);
	}

	return entryType;
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
	return Object.values(HealthCheckRating).includes(param);
};

const isNumber = (param: unknown): param is number => {
	return typeof param === 'number' || param instanceof Number;
};

const parseHealthCheckRating = (
	healthCheckRating: unknown
): HealthCheckRating => {
	if (!isNumber(healthCheckRating) || !isHealthCheckRating(healthCheckRating)) {
		throw new Error(
			'Incorrect or missing health check rating: ' + healthCheckRating
		);
	}

	return healthCheckRating;
};

const parseDiagnosisCodes = (diagnosisCodes: unknown): Array<string> => {
	if (!diagnosisCodes) {
		return [];
	}

	if (!Array.isArray(diagnosisCodes)) {
		throw new Error('Incorrect diagnosis codes: ' + diagnosisCodes);
	}

	return diagnosisCodes.map((code) => parseString(code));
};

const parseDischarge = (
	discharge: unknown
): { date: string; criteria: string } => {
	if (!discharge || typeof discharge !== 'object') {
		throw new Error('Incorrect or missing discharge: ' + discharge);
	}

	if (!('date' in discharge) || !('criteria' in discharge)) {
		throw new Error('Incorrect or missing discharge: ' + discharge);
	}

	return {
		date: parseDate(discharge.date),
		criteria: parseString(discharge.criteria),
	};
};

const parseSickLeave = (
	sickLeave: unknown
): { startDate: string; endDate: string } => {
	if (!sickLeave || typeof sickLeave !== 'object') {
		throw new Error('Incorrect or missing sick leave: ' + sickLeave);
	}

	if (!('startDate' in sickLeave) || !('endDate' in sickLeave)) {
		throw new Error('Incorrect or missing sick leave: ' + sickLeave);
	}

	return {
		startDate: parseDate(sickLeave.startDate),
		endDate: parseDate(sickLeave.endDate),
	};
};

export const toNewEntry = (object: unknown): NewEntry => {
	if (!object || typeof object !== 'object' || !('type' in object)) {
		throw new Error('Incorrect or missing data');
	}

	const type = parseEntryType(object.type);

	if (type === 'Hospital') {
		if (
			'description' in object &&
			'date' in object &&
			'specialist' in object &&
			'diagnosisCodes' in object &&
			'discharge' in object
		) {
			const newEntry: NewEntry = {
				type: type,
				description: parseString(object.description),
				date: parseDate(object.date),
				specialist: parseString(object.specialist),
				diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
				discharge: parseDischarge(object.discharge),
			};

			return newEntry;
		}
	} else if (type === 'OccupationalHealthcare') {
		if (
			'description' in object &&
			'date' in object &&
			'specialist' in object &&
			'diagnosisCodes' in object &&
			'employerName' in object &&
			'sickLeave' in object
		) {
			const newEntry: NewEntry = {
				type: type,
				description: parseString(object.description),
				date: parseDate(object.date),
				specialist: parseString(object.specialist),
				diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
				employerName: parseString(object.employerName),
				sickLeave: parseSickLeave(object.sickLeave),
			};

			return newEntry;
		}
	} else if (type === 'HealthCheck') {
		if (
			'description' in object &&
			'date' in object &&
			'specialist' in object &&
			'diagnosisCodes' in object &&
			'healthCheckRating' in object
		) {
			const newEntry: NewEntry = {
				type: type,
				description: parseString(object.description),
				date: parseDate(object.date),
				specialist: parseString(object.specialist),
				diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
				healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
			};

			return newEntry;
		}
	}

	throw new Error('Incorrect data, some fields are missing.');
};
