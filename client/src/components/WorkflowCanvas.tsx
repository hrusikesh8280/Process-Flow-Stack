import React, { useState, useCallback, useMemo } from 'react';
import {
ReactFlow,
Background,
Controls,
MiniMap,
addEdge,
useNodesState,
useEdgesState,
MarkerType,
ConnectionLineType,
} from 'reactflow';
import type{

Connection,
Edge,
Node,
NodeTypes,

} from 'reactflow';
import 'reactflow/dist/style.css';
import { Save, Plus, Trash2, Play, Square } from 'lucide-react';
import type { WorkflowDTO, NodeDTO, TransitionDTO } from '../types/workflow';
import { createWorkflow } from '../services/api';

interface CustomNodeData {
  label: string;
  type: 'start' | 'end' | 'task';
  name: string;
}

const CustomNode = ({ data, selected }: { data: CustomNodeData; selected: boolean }) => {
  const isStart = data.type === 'start';
  const isEnd = data.type === 'end';
  
  return (
    <div className={`px-4 py-2 shadow-md rounded-md border-2 transition-all ${
      selected 
        ? 'border-blue-500 shadow-lg' 
        : isStart 
        ? 'border-green-400 bg-green-50' 
        : isEnd 
        ? 'border-red-400 bg-red-50' 
        : 'border-blue-400 bg-blue-50'
    }`}>
      <div className="flex items-center gap-2">
        {isStart && <Play className="w-4 h-4 text-green-600" />}
        {isEnd && <Square className="w-4 h-4 text-red-600" />}
        <div>
          <div className="text-xs font-medium text-gray-600">
            {isStart ? 'START' : isEnd ? 'END' : 'TASK'}
          </div>
          <div className="font-medium text-gray-900">{data.label}</div>
        </div>
      </div>
    </div>
  );
};


const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

interface WorkflowCanvasProps {
  onWorkflowCreated?: (workflow: WorkflowDTO) => void;
  onError?: (error: string) => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  onWorkflowCreated,
  onError,
}) => {

  const [workflowName, setWorkflowName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const initialNodes: Node[] = [
    {
      id: '1',
      type: 'custom',
      position: { x: 100, y: 100 },
      data: { 
        label: 'Assign Task',
        type: 'start',
        name: 'Assign Task'
      },
    },
    {
      id: '2',
      type: 'custom',
      position: { x: 300, y: 100 },
      data: { 
        label: 'Navigate',
        type: 'end',
        name: 'Navigate'
      },
    },
  ];

  const initialEdges: Edge[] = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'smoothstep',
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const addNode = useCallback(() => {
    const newId = (nodes.length + 1).toString();
    const newNode: Node = {
      id: newId,
      type: 'custom',
      position: { x: Math.random() * 300 + 100, y: Math.random() * 200 + 150 },
      data: { 
        label: `Task ${newId}`,
        type: 'task',
        name: `Task ${newId}`
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes.length, setNodes]);

  const removeSelectedNodes = useCallback(() => {
    const selectedNodes = nodes.filter(node => node.selected);
    if (selectedNodes.length === 0) return;
    
    if (nodes.length - selectedNodes.length < 2) {
      onError?.('Workflow must have at least 2 nodes');
      return;
    }
    
    const selectedNodeIds = selectedNodes.map(node => node.id);
    setNodes((nds) => nds.filter(node => !selectedNodeIds.includes(node.id)));
    setEdges((eds) => eds.filter(edge => 
      !selectedNodeIds.includes(edge.source) && !selectedNodeIds.includes(edge.target)
    ));
  }, [nodes, setNodes, setEdges, onError]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;
      const edge: Edge = {
        ...params,
        id: `e${params.source}-${params.target}`,
        type: 'smoothstep',
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        source: params.source,
        target: params.target,
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  
  const updateNodeLabel = useCallback((nodeId: string, newLabel: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { 
              ...node, 
              data: { 
                ...node.data, 
                label: newLabel,
                name: newLabel
              } 
            }
          : node
      )
    );
  }, [setNodes]);

  const convertToWorkflowDTO = (): WorkflowDTO => {
    const workflowNodes: NodeDTO[] = nodes.map(node => ({
      id: node.id,
      name: node.data.name || node.data.label,
    }));

    const workflowTransitions: TransitionDTO[] = edges.map(edge => ({
      from: edge.source,
      to: edge.target,
    }));

    return {
      name: workflowName || 'Untitled Workflow',
      nodes: workflowNodes,
      transitions: workflowTransitions,
    };
  };

  const handleSave = async () => {
    if (!workflowName.trim()) {
      onError?.('Please enter a workflow name');
      return;
    }

    if (nodes.length < 2) {
      onError?.('Workflow must have at least 2 nodes');
      return;
    }

    if (edges.length === 0) {
      onError?.('Workflow must have at least 1 transition');
      return;
    }

    setIsSubmitting(true);

    try {
      const workflowData = convertToWorkflowDTO();
      const response = await createWorkflow(workflowData);
      onWorkflowCreated?.(response.workflow);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save workflow';
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const selectedNodes = useMemo(() => nodes.filter(node => node.selected), [nodes]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Workflow Canvas
          </h2>
          <div className="flex gap-2">
            <button
              onClick={addNode}
              disabled={isSubmitting}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1 disabled:opacity-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Node
            </button>
            <button
              onClick={removeSelectedNodes}
              disabled={isSubmitting || selectedNodes.length === 0}
              className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1 disabled:opacity-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Remove
            </button>
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            placeholder="Enter workflow name..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
          />
          <button
            onClick={handleSave}
            disabled={isSubmitting || !workflowName.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : 'Save Workflow'}
          </button>
        </div>
      </div>

     
      {selectedNodes.length === 1 && (
        <div className="p-4 border-b border-gray-200 bg-blue-50">
          <h3 className="font-medium text-gray-900 mb-2">Edit Selected Node</h3>
          <input
            type="text"
            value={selectedNodes[0].data.label}
            onChange={(e) => updateNodeLabel(selectedNodes[0].id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Node name..."
          />
        </div>
      )}

    
      <div className="h-96 bg-gray-50">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          className="bg-gray-50"
        >
          <Background color="#94a3b8" gap={16} />
          <Controls />
          <MiniMap 
            nodeColor={(node) => {
              if (node.data?.type === 'start') return '#10b981';
              if (node.data?.type === 'end') return '#ef4444';
              return '#3b82f6';
            }}
            className="bg-white"
          />
        </ReactFlow>
      </div>

   
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-sm text-gray-600">
          <p className="font-medium mb-1">Instructions:</p>
          <ul className="space-y-1 text-xs">
            <li>• Click and drag nodes to position them</li>
            <li>• Connect nodes by dragging from one node to another</li>
            <li>• Select a node to edit its name</li>
            <li>• Use the controls to add/remove nodes</li>
            <li>• Enter a workflow name and click "Save Workflow"</li>
          </ul>
        </div>
      </div>
    </div>
  );
};