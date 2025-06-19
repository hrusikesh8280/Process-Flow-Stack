import { z } from 'zod';
import type { Context, Next } from 'hono';

const workflowSchema = z.object({
  name: z.string().min(1),
  nodes: z
    .array(z.object({ id: z.string().min(1), name: z.string().min(1) }))
    .min(1),
  transitions: z
    .array(z.object({ from: z.string().min(1), to: z.string().min(1) }))
    .min(1),
});

export const validateWorkflow = async (c: Context, next: Next) => {
  const body = await c.req.json();
  const parsed = workflowSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ message: 'validation error', errors: parsed.error.flatten() }, 400);
  }
  (c.req as any).validatedBody = parsed.data;
  await next();
};