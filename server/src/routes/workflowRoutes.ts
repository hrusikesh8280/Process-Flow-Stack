// import { Hono } from 'hono';
// import { WorkflowController } from '../controllers/workflowController';

// const app = new Hono();


// app.post('/workflows', WorkflowController.createWorkflow);


// app.get('/workflows/:id', WorkflowController.getWorkflowById);

// export default app;




import { Hono } from 'hono';
import { validateWorkflow } from '../middlewares/validateWorkflow';
import { WorkflowController } from '../controllers/workflowController';

const router = new Hono();

router.post('/workflows', validateWorkflow, WorkflowController.createWorkflow);
router.get('/workflows/:id', WorkflowController.getWorkflowById);

export default router;
