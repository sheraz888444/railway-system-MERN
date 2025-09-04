import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function dropIndex() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
    await mongoose.connect(mongoUri);
    const db = mongoose.connection.db;
    await db.collection('users').dropIndex('username_1');
    console.log('Unique index on username dropped successfully');
  } catch (error) {
    console.error('Error dropping index:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

dropIndex();
