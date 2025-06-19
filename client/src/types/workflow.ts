export interface NodeDTO {
  id: string;
  name: string;
}

export interface TransitionDTO {
  from: string;
  to: string;
}

export interface WorkflowDTO {
  _id?: string;            
  name: string;
  nodes: NodeDTO[];
  transitions: TransitionDTO[];
}
