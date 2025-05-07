import express from 'express';
import bodyParser from 'body-parser';
import authRouter from './routes/auth';
import cors from 'cors';


const app = express();
// app.use(cors());
app.use(cors({
  origin: 'https://business-board.vercel.app',
  credentials: true
}));

app.use(bodyParser.json());
app.use('/api', authRouter);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
