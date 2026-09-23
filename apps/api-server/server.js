import 'dotenv/config';
import app from './src/app.js';
import { connectToDatabase, disconnectFromDatabase } from './src/database/connection.js';

const port = Number(process.env.PORT ?? 4000);

await connectToDatabase();

const server = app.listen(port, () => {
  console.log(`ERP API listening on port ${port}`);
});

const shutdown = async (signal) => {
  console.log(`${signal} received, shutting down gracefully`);
  server.close(async () => {
    await disconnectFromDatabase();
    process.exit(0);
  });
};

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
