import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import app from './app';

dotenv.config();

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
});
