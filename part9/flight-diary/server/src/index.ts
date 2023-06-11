import express from 'express';
import cors from 'cors';

//Routes
import diaryRouter from './routes/diaries';

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/diaries', diaryRouter);

app.listen(process.env.PORT || 3000, () => {
	console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
