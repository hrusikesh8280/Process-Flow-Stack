import React, { useState } from 'react';
import { Plus, Save, Loader2, X } from 'lucide-react';
import type { WorkflowDTO, NodeDTO, TransitionDTO } from '../types/workflow';
import { createWorkflow } from '../services/api';

interface WorkflowFormProps {
  onWorkflowCreated?: (workflow: WorkflowDTO) => void;
  onError?: (error: string) => void;
}

export const WorkflowForm: React.FC<WorkflowFormProps> = ({
  onWorkflowCreated,
  onError,
}) => {
  const [workflowName, setWorkflowName] = useState('');
  const [nodes, setNodes] = useState<NodeDTO[]>([
    { id: '1', name: '' },
    { id: '2', name: '' }
  ]);
  const [transitions, setTransitions] = useState<TransitionDTO[]>([
    { from: '1', to: '2' }
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!workflowName.trim()) {
      errors.push('Workflow name is required');
    }
    
    if (nodes.some(node => !node.name.trim())) {
      errors.push('All nodes must have names');
    }
    
    if (transitions.length === 0) {
      errors.push('At least one transition is required');
    }
    
    const nodeNames = nodes.map(n => n.name.trim().toLowerCase());
    const duplicates = nodeNames.filter((name, index) => 
      name && nodeNames.indexOf(name) !== index
    );
    if (duplicates.length > 0) {
      errors.push('Node names must be unique');
    }
    
    const nodeIds = nodes.map(n => n.id);
    for (const transition of transitions) {
      if (!nodeIds.includes(transition.from) || !nodeIds.includes(transition.to)) {
        errors.push('Invalid transition: references non-existent node');
      }
      if (transition.from === transition.to) {
        errors.push('Transition cannot connect a node to itself');
      }
    }
    
    return errors;
  };

  const handleNodeNameChange = (nodeId: string, name: string) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, name } : node
    ));
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const addNode = () => {
    const newId = (Math.max(...nodes.map(n => parseInt(n.id))) + 1).toString();
    setNodes(prev => [...prev, { id: newId, name: '' }]);
  };

  const removeNode = (nodeId: string) => {
    if (nodes.length <= 2) return; // Minimum 2 nodes
    
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setTransitions(prev => prev.filter(t => t.from !== nodeId && t.to !== nodeId));
  };

  const addTransition = () => {
    const availableFromIds = nodes
      .filter(node => !transitions.some(t => t.from === node.id))
      .map(node => node.id);
      
    const availableToIds = nodes
      .filter(node => !transitions.some(t => t.to === node.id))
      .map(node => node.id);

    if (availableFromIds.length > 0 && availableToIds.length > 0) {
      setTransitions(prev => [...prev, { 
        from: availableFromIds[0], 
        to: availableToIds[0] 
      }]);
    }
  };

  const removeTransition = (index: number) => {
    if (transitions.length <= 1) return; 
    
    setTransitions(prev => prev.filter((_, i) => i !== index));
  };

  const updateTransition = (index: number, field: 'from' | 'to', value: string) => {
    setTransitions(prev => prev.map((transition, i) => 
      i === index ? { ...transition, [field]: value } : transition
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setValidationErrors([]);

    try {
      const workflowData: WorkflowDTO = {
        name: workflowName.trim(),
        nodes: nodes.map(node => ({ ...node, name: node.name.trim() })),
        transitions: [...transitions]
      };

      const response = await createWorkflow(workflowData);
      
      setWorkflowName('');
      setNodes([{ id: '1', name: '' }, { id: '2', name: '' }]);
      setTransitions([{ from: '1', to: '2' }]);
      
      onWorkflowCreated?.(response.workflow);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create workflow';
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setWorkflowName('');
    setNodes([{ id: '1', name: '' }, { id: '2', name: '' }]);
    setTransitions([{ from: '1', to: '2' }]);
    setValidationErrors([]);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Create New Workflow
      </h2>

      {validationErrors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="text-red-800 font-medium mb-2">Please fix the following errors:</h4>
          <ul className="text-red-700 text-sm space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="workflow-name" className="block text-sm font-medium text-gray-700 mb-2">
            Workflow Name *
          </label>
          <input
            id="workflow-name"
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            placeholder="e.g., Vehicle Maintenance Process"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Workflow Nodes * (minimum 2)
            </label>
            <button
              type="button"
              onClick={addNode}
              disabled={isSubmitting}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Add Node
            </button>
          </div>
          
          <div className="space-y-3">
            {nodes.map((node) => (
              <div key={node.id} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                  {node.id}
                </div>
                <input
                  type="text"
                  value={node.name}
                  onChange={(e) => handleNodeNameChange(node.id, e.target.value)}
                  placeholder={`Node ${node.id} name (e.g., Assign Task)`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={isSubmitting}
                />
                {nodes.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeNode(node.id)}
                    disabled={isSubmitting}
                    className="text-red-500 hover:text-red-700 p-1 transition-colors disabled:opacity-50"
                    title="Remove node"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Node Transitions * (minimum 1)
            </label>
            <button
              type="button"
              onClick={addTransition}
              disabled={isSubmitting}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Add Transition
            </button>
          </div>
          
          <div className="space-y-3">
            {transitions.map((transition, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <select
                  value={transition.from}
                  onChange={(e) => updateTransition(index, 'from', e.target.value)}
                  disabled={isSubmitting}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {nodes.map(node => (
                    <option key={node.id} value={node.id}>
                      {node.name || `Node ${node.id}`}
                    </option>
                  ))}
                </select>
                
                <span className="text-gray-500 font-medium">→</span>
                
                <select
                  value={transition.to}
                  onChange={(e) => updateTransition(index, 'to', e.target.value)}
                  disabled={isSubmitting}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {nodes.map(node => (
                    <option key={node.id} value={node.id}>
                      {node.name || `Node ${node.id}`}
                    </option>
                  ))}
                </select>
                
                {transitions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTransition(index)}
                    disabled={isSubmitting}
                    className="text-red-500 hover:text-red-700 p-1 transition-colors disabled:opacity-50"
                    title="Remove transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Workflow...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Create Workflow
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={resetForm}
            disabled={isSubmitting}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
};