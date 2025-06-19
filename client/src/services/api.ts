import type { WorkflowDTO } from '../types/workflow';

const BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000/workflows';

export const createWorkflow = async (wf: WorkflowDTO) => {
  const res = await fetch(`${BASE}/workflows`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(wf),
  });
  if (!res.ok) throw new Error('Failed to create workflow');
  return res.json() as Promise<{ workflow: WorkflowDTO }>;
};

export const getWorkflow = async (id: string) => {
  const res = await fetch(`${BASE}/workflows/${id}`);
  if (!res.ok) throw new Error('Workflow not found');
  return res.json() as Promise<{ workflow: WorkflowDTO }>;
};
