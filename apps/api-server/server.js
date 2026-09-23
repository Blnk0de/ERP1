import 'dotenv/config';
import mongoose from 'mongoose';
import app from './src/app.js';

const port = Number(process.env.PORT ?? 4000);
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error('MONGODB_URI is required to start the API server.');
}

await mongoose.connect(mongoUri, {
  maxPoolSize: 20,
  serverSelectionTimeoutMS: 5000,
});

const server = app.listen(port, () => {
  console.log(`ERP API listening on port ${port}`);
});

const shutdown = async (signal) => {
  console.log(`${signal} received, shutting down gracefully`);
  server.close(async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
};

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
