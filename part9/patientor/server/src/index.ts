import express from 'express';
import cors from 'cors';

//routers
import diagnosesRouter from './routes/diagnose';
import patientsRouter from './routes/patient';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/api/ping', (_req, res) => {
	res.send('pong');
});

app.use('/api/diagnoses', diagnosesRouter);

app.use('/api/patients', patientsRouter);

app.listen(process.env.PORT || 3001, () => {
	console.log(`Server running on port ${process.env.PORT || 3001}`);
});
