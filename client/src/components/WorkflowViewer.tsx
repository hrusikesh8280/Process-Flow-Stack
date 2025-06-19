// import React, { useState, useEffect, useCallback } from 'react';
// import { 
//   ArrowRight, 
//   Eye, 
//   CheckCircle, 
//   Loader2, 
//   Download,
//   RefreshCw,
//   Calendar,
//   Hash
// } from 'lucide-react';
// import type { WorkflowDTO, NodeDTO, TransitionDTO } from '../types/workflow';
// import { getWorkflow } from '../services/api';

// interface WorkflowViewerProps {
//   workflow?: WorkflowDTO;
//   workflowId?: string;
//   onError?: (error: string) => void;
//   showActions?: boolean;
// }

// export const WorkflowViewer: React.FC<WorkflowViewerProps> = ({
//   workflow: propWorkflow,
//   workflowId,
//   onError,
//   showActions = true,
// }) => {
//   // State Management
//   const [workflow, setWorkflow] = useState<WorkflowDTO | null>(propWorkflow || null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

//   // Use useCallback to memoize the loadWorkflow function
//   const loadWorkflow = useCallback(async (id: string) => {
//     setIsLoading(true);
//     try {
//       const response = await getWorkflow(id);
//       setWorkflow(response.workflow);
//       setLastUpdated(new Date());
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : 'Failed to load workflow';
//       onError?.(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [onError]); // Include onError in dependencies since it's used inside

//   // Load workflow by ID if provided
//   useEffect(() => {
//     if (workflowId && !propWorkflow) {
//       loadWorkflow(workflowId);
//     }
//   }, [workflowId, propWorkflow, loadWorkflow]); // Now include loadWorkflow

//   // Update workflow when prop changes
//   useEffect(() => {
//     if (propWorkflow) {
//       setWorkflow(propWorkflow);
//       setLastUpdated(new Date());
//     }
//   }, [propWorkflow]);

//   const handleRefresh = useCallback(() => {
//     if (workflowId) {
//       loadWorkflow(workflowId);
//     }
//   }, [workflowId, loadWorkflow]);

//   const handleExport = useCallback(() => {
//     if (!workflow) return;
    
//     const dataStr = JSON.stringify(workflow, null, 2);
//     const dataBlob = new Blob([dataStr], { type: 'application/json' });
//     const url = URL.createObjectURL(dataBlob);
    
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `workflow-${workflow.name.replace(/\s+/g, '-').toLowerCase()}.json`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   }, [workflow]);

//   // Helper Functions - these don't need useCallback since they don't have dependencies
//   const getNodeById = (nodeId: string): NodeDTO | undefined => {
//     return workflow?.nodes.find(node => node.id === nodeId);
//   };

//   const getOutgoingTransitions = (nodeId: string): TransitionDTO[] => {
//     return workflow?.transitions.filter(t => t.from === nodeId) || [];
//   };

//   const getIncomingTransitions = (nodeId: string): TransitionDTO[] => {
//     return workflow?.transitions.filter(t => t.to === nodeId) || [];
//   };

//   const isStartNode = (nodeId: string): boolean => {
//     return getIncomingTransitions(nodeId).length === 0;
//   };

//   const isEndNode = (nodeId: string): boolean => {
//     return getOutgoingTransitions(nodeId).length === 0;
//   };

//   // Loading State
//   if (isLoading) {
//     return (
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <div className="flex items-center justify-center py-12">
//           <div className="text-center">
//             <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
//             <p className="text-gray-600">Loading workflow...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Empty State
//   if (!workflow) {
//     return (
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <div className="text-center py-12">
//           <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No Workflow Selected</h3>
//           <p className="text-gray-600">Create a workflow or provide a workflow ID to view details.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-start justify-between">
//         <div>
//           <h2 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
//             <Eye className="w-6 h-6 text-blue-600" />
//             Workflow Preview
//           </h2>
//           <h3 className="text-lg font-medium text-gray-700">{workflow.name}</h3>
//         </div>
        
//         {showActions && (
//           <div className="flex gap-2">
//             {workflowId && (
//               <button
//                 onClick={handleRefresh}
//                 disabled={isLoading}
//                 className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
//                 title="Refresh workflow"
//               >
//                 <RefreshCw className="w-4 h-4" />
//               </button>
//             )}
//             <button
//               onClick={handleExport}
//               className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
//               title="Export workflow as JSON"
//             >
//               <Download className="w-4 h-4" />
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Workflow Metadata */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
//         <div className="flex items-center gap-2">
//           <Hash className="w-4 h-4 text-gray-500" />
//           <div>
//             <p className="text-xs text-gray-500 font-medium">Workflow ID</p>
//             <p className="text-sm font-mono text-gray-900">
//               {workflow._id ? `${workflow._id.slice(0, 8)}...` : 'Not saved'}
//             </p>
//           </div>
//         </div>
        
//         <div className="flex items-center gap-2">
//           <CheckCircle className="w-4 h-4 text-green-500" />
//           <div>
//             <p className="text-xs text-gray-500 font-medium">Total Nodes</p>
//             <p className="text-sm font-semibold text-gray-900">{workflow.nodes.length}</p>
//           </div>
//         </div>
        
//         <div className="flex items-center gap-2">
//           <ArrowRight className="w-4 h-4 text-blue-500" />
//           <div>
//             <p className="text-xs text-gray-500 font-medium">Total Transitions</p>
//             <p className="text-sm font-semibold text-gray-900">{workflow.transitions.length}</p>
//           </div>
//         </div>
//       </div>

//       {lastUpdated && (
//         <div className="flex items-center gap-2 text-sm text-gray-500">
//           <Calendar className="w-4 h-4" />
//           <span>Last updated: {lastUpdated.toLocaleString()}</span>
//         </div>
//       )}

//       {/* Workflow Visualization */}
//       <div className="space-y-6">
//         <h4 className="text-lg font-medium text-gray-900">Workflow Flow</h4>
        
//         {/* Visual Flow Diagram */}
//         <div className="flex flex-col items-center space-y-4 p-6 bg-gradient-to-b from-blue-50 to-white rounded-lg border">
//           {workflow.nodes.map((node) => {
//             const outgoingTransitions = getOutgoingTransitions(node.id);
//             const isStart = isStartNode(node.id);
//             const isEnd = isEndNode(node.id);
            
//             return (
//               <React.Fragment key={node.id}>
//                 {/* Node */}
//                 <div className="flex flex-col items-center">
//                   <div className={`
//                     relative px-6 py-4 rounded-lg text-center min-w-48 shadow-sm border-2 transition-all
//                     ${isStart ? 'bg-green-100 border-green-300 text-green-800' : 
//                       isEnd ? 'bg-red-100 border-red-300 text-red-800' : 
//                       'bg-blue-100 border-blue-300 text-blue-800'}
//                   `}>
//                     {/* Node Type Badge */}
//                     <div className={`
//                       absolute -top-2 -right-2 px-2 py-1 text-xs font-medium rounded-full
//                       ${isStart ? 'bg-green-500 text-white' : 
//                         isEnd ? 'bg-red-500 text-white' : 
//                         'bg-blue-500 text-white'}
//                     `}>
//                       {isStart ? 'START' : isEnd ? 'END' : 'STEP'}
//                     </div>
                    
//                     <div className="text-xs font-medium mb-1 opacity-75">
//                       Node {node.id}
//                     </div>
//                     <div className="font-semibold">
//                       {node.name}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Transition Arrows */}
//                 {outgoingTransitions.map((transition, transIndex) => {
//                   const targetNode = getNodeById(transition.to);
//                   return (
//                     <div key={`${transition.from}-${transition.to}-${transIndex}`} className="flex flex-col items-center">
//                       <ArrowRight className="w-6 h-6 text-gray-400 rotate-90" />
//                       <div className="text-xs text-gray-500 mt-1 px-2 py-1 bg-white rounded shadow-sm border">
//                         To: {targetNode?.name || `Node ${transition.to}`}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </React.Fragment>
//             );
//           })}
//         </div>
//       </div>

//       {/* Detailed Node Information */}
//       <div className="space-y-4">
//         <h4 className="text-lg font-medium text-gray-900">Node Details</h4>
        
//         <div className="grid gap-4">
//           {workflow.nodes.map((node) => {
//             const incoming = getIncomingTransitions(node.id);
//             const outgoing = getOutgoingTransitions(node.id);
            
//             return (
//               <div key={node.id} className="border border-gray-200 rounded-lg p-4">
//                 <div className="flex items-start justify-between mb-3">
//                   <div>
//                     <h5 className="font-medium text-gray-900">
//                       Node {node.id}: {node.name}
//                     </h5>
//                     <div className="flex gap-2 mt-1">
//                       {isStartNode(node.id) && (
//                         <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
//                           Start Node
//                         </span>
//                       )}
//                       {isEndNode(node.id) && (
//                         <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
//                           End Node
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="grid md:grid-cols-2 gap-4 text-sm">
//                   <div>
//                     <p className="font-medium text-gray-700 mb-1">Incoming Transitions</p>
//                     {incoming.length > 0 ? (
//                       <ul className="space-y-1 text-gray-600">
//                         {incoming.map((t, idx) => (
//                           <li key={idx} className="flex items-center gap-1">
//                             <ArrowRight className="w-3 h-3" />
//                             From: {getNodeById(t.from)?.name || `Node ${t.from}`}
//                           </li>
//                         ))}
//                       </ul>
//                     ) : (
//                       <p className="text-gray-500 italic">None (Start node)</p>
//                     )}
//                   </div>
                  
//                   <div>
//                     <p className="font-medium text-gray-700 mb-1">Outgoing Transitions</p>
//                     {outgoing.length > 0 ? (
//                       <ul className="space-y-1 text-gray-600">
//                         {outgoing.map((t, idx) => (
//                           <li key={idx} className="flex items-center gap-1">
//                             <ArrowRight className="w-3 h-3" />
//                             To: {getNodeById(t.to)?.name || `Node ${t.to}`}
//                           </li>
//                         ))}
//                       </ul>
//                     ) : (
//                       <p className="text-gray-500 italic">None (End node)</p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Raw Data (Collapsible) */}
//       <details className="border border-gray-200 rounded-lg">
//         <summary className="p-4 cursor-pointer hover:bg-gray-50 font-medium text-gray-700">
//           View Raw Workflow Data
//         </summary>
//         <div className="p-4 border-t border-gray-200 bg-gray-50">
//           <pre className="text-sm text-gray-700 overflow-x-auto">
//             {JSON.stringify(workflow, null, 2)}
//           </pre>
//         </div>
//       </details>
//     </div>
//   );
// };

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowRight, 
  Eye, 
  CheckCircle, 
  Loader2, 
  Download,
  RefreshCw,
  Calendar,
  Hash,
  Play,
  Square,
  Circle
} from 'lucide-react';
import type { WorkflowDTO, NodeDTO, TransitionDTO } from '../types/workflow';
import { getWorkflow } from '../services/api';

interface WorkflowViewerProps {
  workflow?: WorkflowDTO;
  workflowId?: string;
  onError?: (error: string) => void;
  showActions?: boolean;
}

export const WorkflowViewer: React.FC<WorkflowViewerProps> = ({
  workflow: propWorkflow,
  workflowId,
  onError,
  showActions = true,
}) => {
  
  const [workflow, setWorkflow] = useState<WorkflowDTO | null>(propWorkflow || null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadWorkflow = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const response = await getWorkflow(id);
      setWorkflow(response.workflow);
      setLastUpdated(new Date());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'failed to load workflow';
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    if (workflowId && !propWorkflow) {
      loadWorkflow(workflowId);
    }
  }, [workflowId, propWorkflow, loadWorkflow]);

  useEffect(() => {
    if (propWorkflow) {
      setWorkflow(propWorkflow);
      setLastUpdated(new Date());
    }
  }, [propWorkflow]);

  const handleRefresh = useCallback(() => {
    if (workflowId) {
      loadWorkflow(workflowId);
    }
  }, [workflowId, loadWorkflow]);

  const handleExport = useCallback(() => {
    if (!workflow) return;
    
    const dataStr = JSON.stringify(workflow, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow-${workflow.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [workflow]);

  const getNodeById = (nodeId: string): NodeDTO | undefined => {
    return workflow?.nodes.find(node => node.id === nodeId);
  };

  const getOutgoingTransitions = (nodeId: string): TransitionDTO[] => {
    return workflow?.transitions.filter(t => t.from === nodeId) || [];
  };

  const getIncomingTransitions = (nodeId: string): TransitionDTO[] => {
    return workflow?.transitions.filter(t => t.to === nodeId) || [];
  };

  const isStartNode = (nodeId: string): boolean => {
    return getIncomingTransitions(nodeId).length === 0;
  };

  const isEndNode = (nodeId: string): boolean => {
    return getOutgoingTransitions(nodeId).length === 0;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="relative">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-6" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-blue-100 rounded-full mx-auto"></div>
            </div>
            <p className="text-gray-600 font-medium">Loading workflow...</p>
            <p className="text-gray-400 text-sm mt-1">Please wait while we fetch your data</p>
          </div>
        </div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Eye className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">No Workflow to Preview</h3>
          <p className="text-gray-500">Create a workflow to see the visualization here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Eye className="w-7 h-7" />
              Workflow Preview
            </h2>
            <h3 className="text-indigo-100 text-lg mt-1 font-medium">{workflow.name}</h3>
          </div>
          
          {showActions && (
            <div className="flex gap-2">
              {workflowId && (
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="p-3 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-all disabled:opacity-50 backdrop-blur-sm"
                  title="Refresh workflow"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={handleExport}
                className="p-3 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm"
                title="Export workflow as JSON"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
            <Hash className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <p className="text-sm text-blue-600 font-medium mb-1">Workflow ID</p>
            <p className="text-lg font-bold text-blue-900 font-mono">
              {workflow._id ? `${workflow._id.slice(0, 8)}...` : 'Not saved'}
            </p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <p className="text-sm text-green-600 font-medium mb-1">Total Nodes</p>
            <p className="text-2xl font-bold text-green-900">{workflow.nodes.length}</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
            <ArrowRight className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <p className="text-sm text-purple-600 font-medium mb-1">Transitions</p>
            <p className="text-2xl font-bold text-purple-900">{workflow.transitions.length}</p>
          </div>
        </div>

        {lastUpdated && (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-xl py-3 px-4">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {lastUpdated.toLocaleString()}</span>
          </div>
        )}

        {/* Visual Flow Diagram */}
        <div className="space-y-6">
          <h4 className="text-xl font-bold text-gray-900 text-center">Workflow Visualization</h4>
          
          <div className="relative p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 rounded-2xl border border-gray-200 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)',
                backgroundSize: '20px 20px'
              }}></div>
            </div>
            
            <div className="relative flex flex-col items-center space-y-8">
              {workflow.nodes.map((node, index) => {
                const outgoingTransitions = getOutgoingTransitions(node.id);
                const isStart = isStartNode(node.id);
                const isEnd = isEndNode(node.id);
                
                return (
                  <React.Fragment key={node.id}>
                    <div className="flex flex-col items-center animate-in fade-in duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className={`
                        relative px-8 py-6 rounded-2xl text-center min-w-60 shadow-lg border-2 transition-all transform hover:scale-105
                        ${isStart ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-300 text-white shadow-green-200' : 
                          isEnd ? 'bg-gradient-to-br from-red-400 to-red-600 border-red-300 text-white shadow-red-200' : 
                          'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300 text-white shadow-blue-200'}
                      `}>
                        {/* Node Icon */}
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white
                            ${isStart ? 'bg-green-500' : isEnd ? 'bg-red-500' : 'bg-blue-500'}
                          `}>
                            {isStart ? <Play className="w-4 h-4 text-white" /> : 
                             isEnd ? <Square className="w-4 h-4 text-white" /> : 
                             <Circle className="w-4 h-4 text-white" />}
                          </div>
                        </div>
                        
                        {/* Node Type Badge */}
                        <div className={`
                          absolute -top-2 -right-2 px-3 py-1 text-xs font-bold rounded-full shadow-md
                          ${isStart ? 'bg-green-200 text-green-800' : 
                            isEnd ? 'bg-red-200 text-red-800' : 
                            'bg-blue-200 text-blue-800'}
                        `}>
                          {isStart ? 'START' : isEnd ? 'END' : 'STEP'}
                        </div>
                        
                        <div className="text-sm font-medium mb-2 opacity-90">
                          Node {node.id}
                        </div>
                        <div className="text-lg font-bold">
                          {node.name}
                        </div>
                      </div>
                    </div>

                    {outgoingTransitions.map((transition, transIndex) => {
                      const targetNode = getNodeById(transition.to);
                      return (
                        <div key={`${transition.from}-${transition.to}-${transIndex}`} 
                             className="flex flex-col items-center animate-in fade-in duration-500"
                             style={{ animationDelay: `${(index * 100) + 200}ms` }}>
                          {/* Animated Arrow */}
                          <div className="flex flex-col items-center">
                            <div className="w-px h-8 bg-gradient-to-b from-gray-300 to-gray-400"></div>
                            <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-gray-400"></div>
                          </div>
                          
                          {/* Transition Label */}
                          <div className="mt-2 px-4 py-2 bg-white rounded-xl shadow-md border border-gray-200 text-sm font-medium text-gray-700">
                            To: {targetNode?.name || `Node ${transition.to}`}
                          </div>
                        </div>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-xl font-bold text-gray-900 text-center">Node Details</h4>
          
          <div className="grid gap-6">
            {workflow.nodes.map((node, index) => {
              const incoming = getIncomingTransitions(node.id);
              const outgoing = getOutgoingTransitions(node.id);
              const isStart = isStartNode(node.id);
              const isEnd = isEndNode(node.id);
              
              return (
                <div key={node.id} 
                     className="bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 animate-in fade-in"
                     style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center shadow-md
                        ${isStart ? 'bg-gradient-to-br from-green-400 to-green-600' : 
                          isEnd ? 'bg-gradient-to-br from-red-400 to-red-600' : 
                          'bg-gradient-to-br from-blue-400 to-blue-600'}
                      `}>
                        <span className="text-white font-bold text-lg">{node.id}</span>
                      </div>
                      <div>
                        <h5 className="text-lg font-bold text-gray-900">
                          {node.name}
                        </h5>
                        <div className="flex gap-2 mt-2">
                          {isStart && (
                            <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full border border-green-200">
                              Start Node
                            </span>
                          )}
                          {isEnd && (
                            <span className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full border border-red-200">
                              End Node
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <h6 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-gray-500 rotate-180" />
                        Incoming Transitions
                      </h6>
                      {incoming.length > 0 ? (
                        <div className="space-y-2">
                          {incoming.map((t, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <span className="text-sm text-gray-700">
                                From: <span className="font-medium">{getNodeById(t.from)?.name || `Node ${t.from}`}</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic text-sm">None (Start node)</p>
                      )}
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <h6 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-gray-500" />
                        Outgoing Transitions
                      </h6>
                      {outgoing.length > 0 ? (
                        <div className="space-y-2">
                          {outgoing.map((t, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span className="text-sm text-gray-700">
                                To: <span className="font-medium">{getNodeById(t.to)?.name || `Node ${t.to}`}</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic text-sm">None (End node)</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <details className="border-2 border-gray-200 rounded-2xl overflow-hidden">
          <summary className="p-6 cursor-pointer hover:bg-gray-50 font-semibold text-gray-800 bg-gradient-to-r from-gray-50 to-white transition-colors">
            <span className="flex items-center gap-2">
              <Hash className="w-5 h-5" />
              View Raw Workflow Data
            </span>
          </summary>
          <div className="p-6 border-t border-gray-200 bg-gray-900 text-green-400">
            <pre className="text-sm overflow-x-auto font-mono leading-relaxed">
              {JSON.stringify(workflow, null, 2)}
            </pre>
          </div>
        </details>
      </div>
    </div>
  );
};