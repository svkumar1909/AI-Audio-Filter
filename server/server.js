import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import connectDB from './config/db.js';

import { errorHandler }
from './middleware/errorHandler.js';

// ROUTES
import authRoutes
from './routes/authRoutes.js';

import userRoutes
from './routes/userRoutes.js';

import audioRoutes
from './routes/audioRoutes.js';

// ENV
dotenv.config();

// EXPRESS
const app = express();

// ES MODULE FIX
const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

// CONNECT DATABASE
connectDB();

// CREATE UPLOADS FOLDER
const uploadsPath =
  path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsPath)) {

  fs.mkdirSync(uploadsPath, {
    recursive: true
  });

  console.log(
    '📁 uploads folder created'
  );
}

// MIDDLEWARE
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

app.use(morgan('dev'));

// STATIC FILES
app.use(
  '/uploads',
  express.static(uploadsPath)
);

// TEST ROUTE
app.get('/', (req, res) => {

  res.json({

    success: true,

    message:
      'SpeakRight AI Server Running 🚀'
  });
});

// HEALTH CHECK
app.get('/health', (req, res) => {

  res.status(200).json({

    status: 'ok',

    message:
      'Server is healthy'
  });
});

// API ROUTES
app.use(
  '/api/auth',
  authRoutes
);

app.use(
  '/api/users',
  userRoutes
);

app.use(
  '/api/audio',
  audioRoutes
);

// ERROR HANDLER
app.use(errorHandler);

// PORT
const PORT =
  process.env.PORT || 5000;

// START SERVER
app.listen(PORT, () => {

  console.log(`
====================================
🚀 SpeakRight AI Server Started
🌍 PORT: ${PORT}
📁 Uploads: ${uploadsPath}
====================================
  `);
});

export default app;