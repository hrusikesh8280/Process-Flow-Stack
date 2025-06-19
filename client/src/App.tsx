// import  { useState } from 'react';
// import { CheckCircle, AlertCircle, X, Settings, Workflow, MousePointer, Edit } from 'lucide-react';
// import { WorkflowForm } from './components/WorkflowForm';
// import { WorkflowViewer } from './components/WorkflowViewer';
// import { WorkflowCanvas } from './components/WorkflowCanvas';
// import type { WorkflowDTO } from './types/workflow';

// // Notification types
// type NotificationType = 'success' | 'error' | 'info';

// interface Notification {
//   id: string;
//   type: NotificationType;
//   title: string;
//   message: string;
//   timestamp: Date;
// }

// // Creation modes
// type CreationMode = 'form' | 'canvas';

// function App() {
//   // State Management
//   const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowDTO | null>(null);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [activeTab, setActiveTab] = useState<'create' | 'view'>('create');
//   const [creationMode, setCreationMode] = useState<CreationMode>('form');

//   // Notification Management
//   const addNotification = (type: NotificationType, title: string, message: string) => {
//     const notification: Notification = {
//       id: Date.now().toString(),
//       type,
//       title,
//       message,
//       timestamp: new Date(),
//     };
    
//     setNotifications(prev => [notification, ...prev]);
    
//     // Auto-remove after 5 seconds
//     setTimeout(() => {
//       removeNotification(notification.id);
//     }, 5000);
//   };

//   const removeNotification = (id: string) => {
//     setNotifications(prev => prev.filter(n => n.id !== id));
//   };

//   // Event Handlers
//   const handleWorkflowCreated = (workflow: WorkflowDTO) => {
//     setCurrentWorkflow(workflow);
//     setActiveTab('view');
//     addNotification(
//       'success',
//       'Workflow Created!',
//       `"${workflow.name}" has been successfully created with ${workflow.nodes.length} nodes and ${workflow.transitions.length} transitions.`
//     );
//   };

//   const handleError = (error: string) => {
//     addNotification('error', 'Error', error);
//   };

//   // const handleInfo = (message: string) => {
//   //   addNotification('info', 'Info', message);
//   // };

//   // Get notification icon
//   const getNotificationIcon = (type: NotificationType) => {
//     switch (type) {
//       case 'success':
//         return <CheckCircle className="w-5 h-5 text-green-500" />;
//       case 'error':
//         return <AlertCircle className="w-5 h-5 text-red-500" />;
//       case 'info':
//         return <Settings className="w-5 h-5 text-blue-500" />;
//     }
//   };

//   // Get notification styles
//   const getNotificationStyles = (type: NotificationType) => {
//     switch (type) {
//       case 'success':
//         return 'bg-green-50 border-green-200 text-green-800';
//       case 'error':
//         return 'bg-red-50 border-red-200 text-red-800';
//       case 'info':
//         return 'bg-blue-50 border-blue-200 text-blue-800';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
//                 <Workflow className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-semibold text-gray-900">
//                   Process Flow Creator
//                 </h1>
//                 <p className="text-sm text-gray-600">
//                   Fleet Management Workflow Designer
//                 </p>
//               </div>
//             </div>
            
//             {/* Environment Info */}
//             <div className="text-right">
//               <div className="text-sm text-gray-500">
//                 {import.meta.env.MODE === 'development' && (
//                   <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
//                     Development Mode
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Notifications */}
//       <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
//         {notifications.map((notification) => (
//           <div
//             key={notification.id}
//             className={`p-4 rounded-lg border shadow-lg ${getNotificationStyles(notification.type)} transform transition-all duration-300 ease-in-out`}
//           >
//             <div className="flex items-start gap-3">
//               {getNotificationIcon(notification.type)}
//               <div className="flex-1 min-w-0">
//                 <h4 className="font-medium text-sm">{notification.title}</h4>
//                 <p className="text-sm opacity-90 mt-1">{notification.message}</p>
//                 <p className="text-xs opacity-75 mt-2">
//                   {notification.timestamp.toLocaleTimeString()}
//                 </p>
//               </div>
//               <button
//                 onClick={() => removeNotification(notification.id)}
//                 className="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Tab Navigation */}
//         <div className="mb-8">
//           <nav className="flex space-x-8 bg-white rounded-lg p-1 shadow-sm">
//             <button
//               onClick={() => setActiveTab('create')}
//               className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-colors ${
//                 activeTab === 'create'
//                   ? 'bg-blue-600 text-white'
//                   : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
//               }`}
//             >
//               Create Workflow
//             </button>
//             <button
//               onClick={() => setActiveTab('view')}
//               className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-colors ${
//                 activeTab === 'view'
//                   ? 'bg-blue-600 text-white'
//                   : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
//               }`}
//             >
//               View Workflow
//               {currentWorkflow && (
//                 <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
//                   1
//                 </span>
//               )}
//             </button>
//           </nav>
//         </div>

//         {/* Content Area */}
//         <div className="space-y-8">
//           {activeTab === 'create' && (
//             <>
//               {/* Creation Mode Toggle */}
//               <div className="bg-white rounded-lg shadow-sm p-4">
//                 <h3 className="text-lg font-medium text-gray-900 mb-4">Choose Creation Method</h3>
//                 <div className="flex gap-4">
//                   <button
//                     onClick={() => setCreationMode('form')}
//                     className={`flex-1 p-4 rounded-lg border-2 transition-all ${
//                       creationMode === 'form'
//                         ? 'border-blue-500 bg-blue-50 text-blue-700'
//                         : 'border-gray-200 hover:border-gray-300'
//                     }`}
//                   >
//                     <div className="flex items-center gap-3">
//                       <Edit className="w-6 h-6" />
//                       <div className="text-left">
//                         <h4 className="font-medium">Form-based Creation</h4>
//                         <p className="text-sm opacity-75">Quick workflow creation using forms</p>
//                       </div>
//                     </div>
//                   </button>
                  
//                   <button
//                     onClick={() => setCreationMode('canvas')}
//                     className={`flex-1 p-4 rounded-lg border-2 transition-all ${
//                       creationMode === 'canvas'
//                         ? 'border-blue-500 bg-blue-50 text-blue-700'
//                         : 'border-gray-200 hover:border-gray-300'
//                     }`}
//                   >
//                     <div className="flex items-center gap-3">
//                       <MousePointer className="w-6 h-6" />
//                       <div className="text-left">
//                         <h4 className="font-medium">Visual Canvas</h4>
//                         <p className="text-sm opacity-75">Drag-and-drop workflow designer</p>
//                       </div>
//                     </div>
//                   </button>
//                 </div>
//               </div>

//               {/* Creation Interface */}
//               {creationMode === 'form' ? (
//                 <div className="grid lg:grid-cols-2 gap-8">
//                   {/* Form Section */}
//                   <div>
//                     <WorkflowForm
//                       onWorkflowCreated={handleWorkflowCreated}
//                       onError={handleError}
//                     />
//                   </div>
                  
//                   {/* Preview Section */}
//                   <div>
//                     <WorkflowViewer
//                       workflow={currentWorkflow ?? undefined}
//                       onError={handleError}
//                       showActions={false}
//                     />
//                   </div>
//                 </div>
//               ) : (
//                 <div className="space-y-6">
//                   {/* Canvas Section */}
//                   <WorkflowCanvas
//                     onWorkflowCreated={handleWorkflowCreated}
//                     onError={handleError}
//                   />
                  
//                   {/* Canvas Preview */}
//                   {currentWorkflow && (
//                     <div className="grid lg:grid-cols-2 gap-8">
//                       <div>
//                         <WorkflowViewer
//                           workflow={currentWorkflow}
//                           onError={handleError}
//                           showActions={false}
//                         />
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </>
//           )}

//           {activeTab === 'view' && (
//             <div className="max-w-4xl mx-auto">
//               <WorkflowViewer
//                 workflow={currentWorkflow ?? undefined}
//                 onError={handleError}
//                 showActions={true}
//               />
//             </div>
//           )}
//         </div>

//         {/* Feature Comparison */}
//         <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
//           <h3 className="text-lg font-medium text-gray-900 mb-4">
//             Creation Methods Comparison
//           </h3>
//           <div className="grid md:grid-cols-2 gap-6">
//             <div className="space-y-3">
//               <h4 className="font-medium text-gray-900 flex items-center gap-2">
//                 <Edit className="w-5 h-5 text-blue-600" />
//                 Form-based Creation
//               </h4>
//               <ul className="text-sm text-gray-600 space-y-1">
//                 <li>• Quick and structured workflow creation</li>
//                 <li>• Perfect for simple linear workflows</li>
//                 <li>• Form validation and error handling</li>
//                 <li>• Keyboard-friendly interface</li>
//               </ul>
//             </div>
//             <div className="space-y-3">
//               <h4 className="font-medium text-gray-900 flex items-center gap-2">
//                 <MousePointer className="w-5 h-5 text-purple-600" />
//                 Visual Canvas
//               </h4>
//               <ul className="text-sm text-gray-600 space-y-1">
//                 <li>• Intuitive drag-and-drop interface</li>
//                 <li>• Visual workflow representation</li>
//                 <li>• Perfect for complex workflows</li>
//                 <li>• Real-time node positioning</li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* Stats Footer */}
//         {currentWorkflow && (
//           <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">
//               Workflow Statistics
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-blue-600">
//                   {currentWorkflow.nodes.length}
//                 </div>
//                 <div className="text-sm text-gray-600">Total Nodes</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-green-600">
//                   {currentWorkflow.transitions.length}
//                 </div>
//                 <div className="text-sm text-gray-600">Transitions</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-purple-600">
//                   {currentWorkflow.nodes.filter(node => 
//                     !currentWorkflow.transitions.some(t => t.to === node.id)
//                   ).length}
//                 </div>
//                 <div className="text-sm text-gray-600">Start Nodes</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-orange-600">
//                   {currentWorkflow.nodes.filter(node => 
//                     !currentWorkflow.transitions.some(t => t.from === node.id)
//                   ).length}
//                 </div>
//                 <div className="text-sm text-gray-600">End Nodes</div>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>

//       {/* Footer */}
//       <footer className="bg-white border-t border-gray-200 mt-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//             <div className="text-sm text-gray-600">
//               <p>Built with React + TypeScript + Tailwind CSS + React Flow</p>
//               <p>Backend: Hono + Bun + MongoDB</p>
//             </div>
//             <div className="text-sm text-gray-500">
//               <p>Process Flow Creator v1.0</p>
//               <p>Fleet Management Software</p>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default App;









import  { useState } from 'react';
import { CheckCircle, AlertCircle, X, MousePointer, Edit, Sparkles } from 'lucide-react';
import { WorkflowForm } from './components/WorkflowForm';
import { WorkflowViewer } from './components/WorkflowViewer';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import type { WorkflowDTO } from './types/workflow';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
}

type CreationMode = 'form' | 'canvas';

function App() {
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowDTO | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'create' | 'view'>('create');
  const [creationMode, setCreationMode] = useState<CreationMode>('form');

  const addNotification = (type: NotificationType, title: string, message: string) => {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: new Date(),
    };
    
    setNotifications(prev => [notification, ...prev]);
    
    setTimeout(() => {
      removeNotification(notification.id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleWorkflowCreated = (workflow: WorkflowDTO) => {
    setCurrentWorkflow(workflow);
    setActiveTab('view');
    addNotification(
      'success',
      'Workflow Created!',
      `"${workflow.name}" has been successfully created with ${workflow.nodes.length} nodes and ${workflow.transitions.length} transitions.`
    );
  };

  const handleError = (error: string) => {
    addNotification('error', 'Error', error);
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'info':
        return <Sparkles className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationStyles = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800 shadow-green-100';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800 shadow-red-100';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800 shadow-blue-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    
      <div className="fixed top-6 right-6 z-50 space-y-3 max-w-md">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-5 rounded-2xl border-2 shadow-2xl ${getNotificationStyles(notification.type)} transform transition-all duration-500 ease-out animate-in slide-in-from-right backdrop-blur-sm`}
          >
            <div className="flex items-start gap-4">
              {getNotificationIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm">{notification.title}</h4>
                <p className="text-sm opacity-90 mt-1 leading-relaxed">{notification.message}</p>
                <p className="text-xs opacity-75 mt-3 font-medium">
                  {notification.timestamp.toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity p-1 hover:bg-white/20 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="mb-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-white/20">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('create')}
                className={`flex-1 py-4 px-6 text-sm font-bold rounded-xl transition-all duration-300 ${
                  activeTab === 'create'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-[1.02]'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50/50'
                }`}
              >
                Create Workflow
              </button>
              <button
                onClick={() => setActiveTab('view')}
                className={`flex-1 py-4 px-6 text-sm font-bold rounded-xl transition-all duration-300 relative ${
                  activeTab === 'view'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-[1.02]'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50/50'
                }`}
              >
                View Workflow
                {currentWorkflow && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-6 h-6 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                    1
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>

        
        <div className="space-y-8">
          {activeTab === 'create' && (
            <>
              {/* Creation Mode Toggle */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Creation Method</h3>
                  <p className="text-gray-600">Select the workflow creation approach that works best for you</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <button
                    onClick={() => setCreationMode('form')}
                    className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                      creationMode === 'form'
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-xl shadow-blue-100'
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-lg'
                    }`}
                  >
                    {creationMode === 'form' && (
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
                        creationMode === 'form' ? 'bg-blue-500' : 'bg-gray-100 group-hover:bg-blue-100'
                      }`}>
                        <Edit className={`w-8 h-8 ${creationMode === 'form' ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'}`} />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Form-based Creation</h4>
                        <p className="text-gray-600 leading-relaxed">Quick and structured workflow creation using intuitive forms</p>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setCreationMode('canvas')}
                    className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                      creationMode === 'canvas'
                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 shadow-xl shadow-purple-100'
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-lg'
                    }`}
                  >
                    {creationMode === 'canvas' && (
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
                        creationMode === 'canvas' ? 'bg-purple-500' : 'bg-gray-100 group-hover:bg-purple-100'
                      }`}>
                        <MousePointer className={`w-8 h-8 ${creationMode === 'canvas' ? 'text-white' : 'text-gray-600 group-hover:text-purple-600'}`} />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Visual Canvas</h4>
                        <p className="text-gray-600 leading-relaxed">Interactive drag-and-drop workflow designer with real-time visualization</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              
              {creationMode === 'form' ? (
                <div className="grid xl:grid-cols-2 gap-8">
                  {/* Form Section */}
                  <div className="space-y-6">
                    <WorkflowForm
                      onWorkflowCreated={handleWorkflowCreated}
                      onError={handleError}
                    />
                  </div>
                  
                
                  <div className="space-y-6">
                    <WorkflowViewer
                      workflow={currentWorkflow ?? undefined}
                      onError={handleError}
                      showActions={false}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
              
                  <WorkflowCanvas
                    onWorkflowCreated={handleWorkflowCreated}
                    onError={handleError}
                  />
                  
                 
                  {currentWorkflow && (
                    <div className="grid xl:grid-cols-2 gap-8">
                      <WorkflowViewer
                        workflow={currentWorkflow ?? undefined}
                        onError={handleError}
                        showActions={false}
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === 'view' && (
            <div className="max-w-5xl mx-auto">
              <WorkflowViewer
                workflow={currentWorkflow ?? undefined}
                onError={handleError}
                showActions={true}
              />
            </div>
          )}
        </div>

       
        <div className="mt-16 bg-gradient-to-r from-white/70 to-gray-50/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Creation Methods Comparison
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Edit className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Form-based Creation</h4>
              </div>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Quick and structured workflow creation</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Perfect for simple linear workflows</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Built-in validation and error handling</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Keyboard-friendly interface</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                  <MousePointer className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Visual Canvas</h4>
              </div>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Intuitive drag-and-drop interface</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Visual workflow representation</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Perfect for complex workflows</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Real-time node positioning</span>
                </div>
              </div>
            </div>
          </div>
        </div>

       
        {currentWorkflow && (
          <div className="mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-xl border border-indigo-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Current Workflow Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {currentWorkflow.nodes.length}
                </div>
                <div className="text-sm font-medium text-gray-600">Total Nodes</div>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {currentWorkflow.transitions.length}
                </div>
                <div className="text-sm font-medium text-gray-600">Transitions</div>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {currentWorkflow.nodes.filter(node => 
                    !currentWorkflow.transitions.some(t => t.to === node.id)
                  ).length}
                </div>
                <div className="text-sm font-medium text-gray-600">Start Nodes</div>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {currentWorkflow.nodes.filter(node => 
                    !currentWorkflow.transitions.some(t => t.from === node.id)
                  ).length}
                </div>
                <div className="text-sm font-medium text-gray-600">End Nodes</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;