import React from "react";
import DeploymentForm from "./DeploymentForm";
import DeploymentStatus from "./DeploymentStatus";
import DeploymentComplete from "./DeploymentComplete";
import { useDeployment } from "../context/DeploymentContext";
import { ArrowUpRight } from "lucide-react";

const DeploymentContainer: React.FC = () => {
  const { deploymentState } = useDeployment();

  return (
    <div className="w-full max-w-md mx-auto pt-16 px-4">
      <div className="mb-8 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
            <ArrowUpRight className="h-5 w-5 text-black" />
          </div>
          <h1 className="text-xl font-semibold">Quick Deploy</h1>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden transition-all duration-300">
        {deploymentState.status === "idle" && <DeploymentForm />}
        {(deploymentState.status === "deploying" ||
          deploymentState.status === "building") && <DeploymentStatus />}
        {deploymentState.status === "complete" && <DeploymentComplete />}
      </div>

      <p className="text-center text-gray-500 text-xs mt-8">
        © {new Date().getFullYear()} Quick Deploy. All rights reserved.
      </p>
    </div>
  );
};

export default DeploymentContainer;
