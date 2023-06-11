/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express from 'express';

//services
import diaryService from '../services/diaryService';

//utils
import toNewDiaryEntry from '../utils';

const router = express.Router();

router.get('/all', (_req, res) => {
	res.send(diaryService.getEntries());
});

router.get('/', (_req, res) => {
	res.send(diaryService.getNonSensitiveEntries());
});

router.get('/:id', (req, res) => {
	const diary = diaryService.findById(Number(req.params.id));
	if (diary) {
		res.send(diary);
	} else {
		res.sendStatus(404);
	}
});

router.post('/', (req, res) => {
	try {
		const NewDiaryEntry = toNewDiaryEntry(req.body);

		const addedEntry = diaryService.addEntry(NewDiaryEntry);
		res.json(addedEntry);
	} catch (error) {
		let errMessage = 'Something went wrong: ';
		if (error instanceof Error) {
			errMessage += 'Error: ' + error.message;
		}
		res.status(400).send(errMessage);
	}
});

export default router;
