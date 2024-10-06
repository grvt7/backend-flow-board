import { DB_NAME } from '../constants';
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
    );
    console.log(
      `MongoDb connected !! DB HOST: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.log('MongoDb connection Failed ', error);
    process.exit(1);
  }
};

export { connectDB };
