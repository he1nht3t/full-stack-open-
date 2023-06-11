import express from 'express';

//services
import diagnosesService from '../services/diagnose';

const router = express.Router();

router.get('/', (_req, res) => {
	res.send(diagnosesService.getDiagnoses());
});

export default router;
