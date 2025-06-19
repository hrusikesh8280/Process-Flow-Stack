/// <reference types="node" />

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { connectDB } from './src/config/db';
import { env } from './src/config/env';
import workflowRoutes from './src/routes/workflowRoutes';
import mongoose from 'mongoose';

const app = new Hono();


app.use('*', cors());


app.get('/', (c) =>
  c.json({
    message: 'Hello World',

    timestamp: new Date().toISOString(),
  }),
);


app.route('/workflows', workflowRoutes);


process.on('SIGINT', async () => {
  console.log('\n shutting down...');
  await mongoose.connection.close();
  process.exit(0);
});


await connectDB(env.MONGODB_URI);

export default {
  port: Number(env.PORT),
  fetch: app.fetch,
};

console.log(`Server listening on http://localhost:${env.PORT}`);
