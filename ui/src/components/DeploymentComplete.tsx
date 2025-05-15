import React, { useState } from 'react';
import { useDeployment } from '../context/DeploymentContext';
import { CheckCircle, Copy, ExternalLink } from 'lucide-react';

const DeploymentComplete: React.FC = () => {
  const { deploymentState, resetDeployment } = useDeployment();
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(deploymentState.deploymentUrl || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleVisit = () => {
    window.open(deploymentState.deploymentUrl, '_blank');
  };
  
  const handleNewDeployment = () => {
    resetDeployment();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-center mb-6">
        <CheckCircle className="h-12 w-12 text-green-500 mr-3" />
        <h2 className="text-xl font-semibold">Deployment Successful!</h2>
      </div>
      
      <div className="mb-6">
        <div className="text-sm text-gray-400 mb-2">Your site is now live at:</div>
        <div className="flex items-center">
          <div className="flex-1 bg-gray-700 rounded-l-md py-3 px-4 font-mono text-sm truncate">
            {deploymentState.deploymentUrl}
          </div>
          <button 
            onClick={handleCopy}
            className="bg-gray-600 hover:bg-gray-500 p-3 rounded-r-md transition-colors duration-200"
            title="Copy to clipboard"
          >
            {copied ? 
              <CheckCircle className="h-5 w-5 text-green-400" /> : 
              <Copy className="h-5 w-5 text-gray-300" />
            }
          </button>
        </div>
      </div>
      
      <div className="flex space-x-3">
        <button 
          onClick={handleVisit}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex justify-center items-center"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Visit Site
        </button>
        
        <button 
          onClick={handleNewDeployment}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
        >
          Deploy Another
        </button>
      </div>
    </div>
  );
};

export default DeploymentComplete;