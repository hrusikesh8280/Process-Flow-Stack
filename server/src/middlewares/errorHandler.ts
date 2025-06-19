import { Context, Next } from 'hono';

export const errorHandler = async (c: Context, next: Next) => {
  try {
    await next();
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown error';
    const code = msg === 'workflow not found' ? 404 : 500;
    return c.json({ message: msg }, code);
  }
};
