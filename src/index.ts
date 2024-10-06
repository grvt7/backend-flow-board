import dotenv from 'dotenv';
import { httpServer } from './app';
import { connectDB } from './db';

dotenv.config({
  path: './.env',
});

connectDB()
  .then(() => {
    try {
      httpServer.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running @ port :: ${process.env.PORT}`);
      });
    } catch (error) {
      console.log(`Failed to start server !!! ${error}`);
    }
  })
  .catch((error: any) => {
    console.log('MongoDb connection failed !!!', error);
  });
