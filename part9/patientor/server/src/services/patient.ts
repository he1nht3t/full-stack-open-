import { v1 as uuid } from 'uuid';
import patients from '../../data/patients';

import { NonSensitivePatient, NewPatient, Patient, NewEntry } from '../types';

const id = uuid();

const getPatients = (): Array<NonSensitivePatient> => {
	return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
		id,
		name,
		dateOfBirth,
		gender,
		occupation,
	}));
};

const getPatient = (id: string): Patient | undefined => {
	const patient = patients.find((patient) => patient.id === id);

	return patient;
};

const addPatient = (entry: NewPatient): Patient => {
	const addedPatient = {
		id: id,
		...entry,
	};

	patients.push(addedPatient);

	return addedPatient;
};

const addEntry = (entry: NewEntry, id: string): Patient | undefined => {
	const patient = patients.find((patient) => patient.id === id);

	if (patient) {
		const addedEntry = {
			id: uuid(),
			...entry,
		};

		patient.entries.push(addedEntry);
	}

	return patient;
};

export default {
	getPatients,
	getPatient,
	addPatient,
	addEntry,
};
