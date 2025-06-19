// import { Context } from 'hono';
// import Workflow from '../models/workflowModel';

// export class WorkflowController {
  
//   static async createWorkflow(c: Context) {
//     const { name, nodes, transitions } = await c.req.json();

//     try {
  
//       const newWorkflow = new Workflow({ name, nodes, transitions });

   
//       await newWorkflow.save();

//       return c.json({
//         message: 'workflow created successfully!',
//         workflow: newWorkflow,
//       });
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : String(error);
//       return c.json(
//         { message: 'error creating workflow', error: errorMessage },
//         400
//       );
//     }
//   }

  
//   static async getWorkflowById(c: Context) {
//     const { id } = c.req.param();

//     try {
   
//       const workflow = await Workflow.findById(id);

//       if (!workflow) {
//         return c.json({ message: 'workflow not found' }, 404);
//       }

//       return c.json({ workflow });
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : String(error);
//       return c.json(
//         { message: 'error fetching workflow', error: errorMessage },
//         500
//       );
//     }
//   }
// }


import { Context } from 'hono';
import { WorkflowService } from '../services/workflowService';

export class WorkflowController {
  static async createWorkflow(c: Context) {
    const payload = await c.req.json();
    const wf = await WorkflowService.createWorkflow(payload);
    return c.json({ message: 'Created', workflow: wf });
  }

  static async getWorkflowById(c: Context) {
    const { id } = c.req.param();
    const wf = await WorkflowService.getWorkflow(id as string);
    return c.json({ workflow: wf });
  }
}