import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

const app = express();

app.disable('x-powered-by');
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('combined'));

app.use((request, response, next) => {
  const tenantId = request.header('x-tenant-id')?.trim();

  if (!tenantId) {
    return response.status(400).json({
      error: 'TENANT_REQUIRED',
      message: 'Every request must include an x-tenant-id header.',
    });
  }

  request.tenantId = tenantId;
  response.setHeader('x-tenant-id', tenantId);
  return next();
});

app.get('/health', (request, response) => {
  response.json({ status: 'ok', tenantId: request.tenantId });
});

app.use((error, request, response, next) => {
  if (response.headersSent) {
    return next(error);
  }

  console.error(error);
  return response.status(error.statusCode ?? 500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: process.env.NODE_ENV === 'production' ? 'Unexpected server error.' : error.message,
  });
});

export default app;
