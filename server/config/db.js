import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Fail-fast immediately if connection is down rather than buffering queries indefinitely
    mongoose.set('bufferCommands', false);

    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/unihub_ogb', {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      family: 4, // Force IPv4 — fixes EAI_AGAIN on Vercel and cloud environments
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.warn(`WARNING: Server will continue running in offline/disconnected database mode.`);
  }
};

export default connectDB;
