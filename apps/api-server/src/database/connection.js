import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is required to connect to MongoDB Atlas.');
}

const connectionOptions = {
  maxPoolSize: 20,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
};

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) {
    console.log('Using existing database connection');
    return mongoose.connection;
  }

  try {
    const connection = await mongoose.connect(MONGODB_URI, connectionOptions);
    isConnected = connection.connections[0].readyState === 1;
    console.log('MongoDB Atlas connected successfully');
    return connection;
  } catch (error) {
    console.error('MongoDB Atlas connection error:', error);
    throw error;
  }
}

export async function disconnectFromDatabase() {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('MongoDB Atlas disconnected successfully');
  } catch (error) {
    console.error('MongoDB Atlas disconnection error:', error);
    throw error;
  }
}

export function getConnectionStatus() {
  return {
    isConnected,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    name: mongoose.connection.name,
  };
}

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB Atlas');
  isConnected = true;
});

mongoose.connection.on('error', (error) => {
  console.error('Mongoose connection error:', error);
  isConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB Atlas');
  isConnected = false;
});

process.on('SIGINT', async () => {
  await disconnectFromDatabase();
  process.exit(0);
});

export default { connectToDatabase, disconnectFromDatabase, getConnectionStatus };