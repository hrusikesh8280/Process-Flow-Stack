import mongoose, { Schema, Document } from 'mongoose';


interface IWorkflow extends Document {
  name: string;
  nodes: { id: string; name: string }[];
  transitions: { from: string; to: string }[];
}

const workflowSchema: Schema<IWorkflow> = new Schema({
  name: { type: String, required: true },
  nodes: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
    },
  ],
  transitions: [
    {
      from: { type: String, required: true },
      to: { type: String, required: true },
    },
  ],
});

const Workflow = mongoose.model<IWorkflow>('Workflow', workflowSchema);

export default Workflow;
