import { WorkflowRepository } from '../repositories/workflowRepository';

export const WorkflowService = {
  async createWorkflow(payload: Parameters<typeof WorkflowRepository.create>[0]) {

    if (!payload.nodes?.length || !payload.transitions?.length) {
      throw new Error('workflow must include at least one node and one transition');
    }
  
    return WorkflowRepository.create(payload);
  },

  async getWorkflow(id: string) {
    const wf = await WorkflowRepository.findById(id);
    if (!wf) throw new Error('workflow not found');
    return wf;
  },
};