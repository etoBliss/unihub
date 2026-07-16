import mongoose from 'mongoose';

let cachedConnection = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    // Fail-fast immediately if connection is down rather than buffering queries indefinitely
    mongoose.set('bufferCommands', false);

    cachedConnection = mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/unihub_ogb', {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      family: 4, // Force IPv4 — fixes EAI_AGAIN on Vercel and cloud environments
    });

    const conn = await cachedConnection;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    cachedConnection = null;
    console.error(`MongoDB connection error: ${error.message}`);
    console.warn(`WARNING: Server will continue running in offline/disconnected database mode.`);
    throw error;
  }
};

export default connectDB;
