import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = [
  'https://business-board-lsaip54ym-xinyis-projects-6c0795d6.vercel.app',
  'https://business-board.vercel.app'
];

app.use(cors({
  origin: '*',  
  credentials: true
}));


app.use(bodyParser.json());
app.use('/api', authRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
