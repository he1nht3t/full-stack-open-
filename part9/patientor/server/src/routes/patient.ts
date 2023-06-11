import express from 'express';
import patientService from '../services/patient';
import { toNewPatientEntry, toNewEntry } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
	res.send(patientService.getPatients());
});

router.get('/:id', (req, res) => {
	const patient = patientService.getPatient(req.params.id);

	if (patient) {
		res.send(patient);
	} else {
		res.sendStatus(404);
	}
});

router.post('/', (req, res) => {
	try {
		const newPatient = toNewPatientEntry(req.body);

		const addedPatient = patientService.addPatient(newPatient);
		res.json(addedPatient);
	} catch (e) {
		let errMessage = 'Something went wrong: ';

		if (e instanceof Error) {
			errMessage += 'Error: ' + e.message;
		}

		res.status(400).send(errMessage);
	}
});

router.post('/:id/entries', (req, res) => {
	try {
		const newEntry = toNewEntry(req.body);

		const addedEntry = patientService.addEntry(newEntry, req.params.id);
		res.json(addedEntry);
	} catch (e) {
		let errMessage = 'Something went wrong: ';

		if (e instanceof Error) {
			errMessage += 'Error: ' + e.message;
		}

		res.status(400).send(errMessage);
	}
});

export default router;
