import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    const dbName = process.env.DB_NAME;
    await mongoose.connect(mongoUrl, { dbName });
    console.log(`Connected to MongoDB: ${dbName}`);
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
};

export default connectDB;
