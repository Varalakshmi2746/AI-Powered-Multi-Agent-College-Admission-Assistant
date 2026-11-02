import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryInstance = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && !uri.includes('localhost')) {
    try {
      console.log('Connecting to MongoDB Atlas / Remote database...');
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000,
      });
      console.log(`[MongoDB Connected] Host: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[Warning] Could not connect to configured MONGODB_URI: ${err.message}`);
      console.log('Falling back to MongoMemoryServer for development & testing...');
    }
  }

  // Fallback to in-memory MongoDB
  try {
    console.log('Starting in-memory MongoDB server...');
    mongoMemoryInstance = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryInstance.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`[Embedded MongoMemoryServer Connected] URI: ${memoryUri}`);
    return conn;
  } catch (error) {
    console.error(`[Error] Failed to initialize MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryInstance) {
    await mongoMemoryInstance.stop();
  }
};
