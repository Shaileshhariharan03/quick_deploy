import React from 'react';
import DeploymentContainer from './components/DeploymentContainer';
import { DeploymentProvider } from './context/DeploymentContext';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DeploymentProvider>
        <DeploymentContainer />
      </DeploymentProvider>
    </div>
  );
}

export default App;