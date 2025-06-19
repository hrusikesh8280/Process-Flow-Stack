import Workflow from '../models/workflowModel';

export const WorkflowRepository = {
  async create(data: {
    name: string;
    nodes: { id: string; name: string }[];
    transitions: { from: string; to: string }[];
  }) {
    return new Workflow(data).save();
  },

  async findById(id: string) {
    return Workflow.findById(id);
  },
};