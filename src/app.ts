import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(
  express.json({
    limit: '16kb',
  }),
);

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(express.static('public'));

app.use(cookieParser());

const httpServer = createServer(app);

const io = new Server(httpServer);

io.on('connection', () => {
  console.log('Connected');
});

app.get('/', (req, res) => {
  res.status(200).send('Welcome');
});

// Routes
import userRouter from './routes/user.routes';

app.use('/api/v1/users', userRouter);

export { httpServer };
