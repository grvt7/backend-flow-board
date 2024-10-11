import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import errorHandler from './middlewares/errorHandler';

const app = express();

app.use(
  cors({
    origin: true,
    credentials: false,
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

app.use(errorHandler);
export { httpServer };
