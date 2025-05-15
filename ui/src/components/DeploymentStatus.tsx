import React, { useEffect, useMemo, useState } from "react";
import { useDeployment } from "../context/DeploymentContext";
import { Loader2 } from "lucide-react";
import axios from "axios";

const DeploymentStatus: React.FC = () => {
  const { deploymentState, completeDeployment } = useDeployment();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const deploymentSteps = useMemo(
    () => [
      { step: "Initializing deployment", progress: 10 },
      { step: "Cloning repository", progress: 20 },
      { step: "Installing dependencies", progress: 40 },
      { step: "Building project", progress: 60 },
      { step: "Running tests", progress: 75 },
      { step: "Optimizing assets", progress: 85 },
      { step: "Finalizing deployment", progress: 95 },
      { step: "Deployment complete", progress: 100 },
    ],
    []
  );

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const stepName = deploymentSteps[currentStep]?.step;
    const deploymentId = deploymentState.deploymentId;

    const checkStatus = async () => {
      if (
        stepName === "Cloning repository" ||
        stepName === "Deployment complete"
      ) {
        const expectedStatus =
          stepName === "Cloning repository" ? "uploaded" : "deployed";
        try {
          const res = await axios.get(
            `http://localhost:3000/status?id=${deploymentId}`
          );
          const data = res.data;

          if (data.status === expectedStatus) {
            setCurrentStep((prev) => prev + 1);
          } else {
            timeoutId = setTimeout(checkStatus, 1000);
          }
        } catch (error) {
          console.error("Error fetching status:", error);
          timeoutId = setTimeout(checkStatus, 1000);
        }
      } else {
        // For other steps, just wait a random time and increment
        timeoutId = setTimeout(() => {
          setCurrentStep((prev) => prev + 1);
        }, Math.random() * 1000 + 800);
      }
    };

    if (currentStep < deploymentSteps.length) {
      checkStatus();
    }

    // Cleanup timer on unmount or step change
    return () => clearTimeout(timeoutId);
  }, [currentStep, deploymentSteps, deploymentState.deploymentId]);

  // Gradually increase progress
  useEffect(() => {
    const targetProgress = deploymentSteps[currentStep]?.progress || 100;
    let progressInterval: ReturnType<typeof setInterval>;

    if (progress < targetProgress) {
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          const increment = Math.min(2, targetProgress - prev);
          return prev + increment;
        });
      }, 100);
    }

    // When progress hits 100% and last step is done, complete deployment
    if (progress >= 100) {
      const deploymentUrl = `http://${deploymentState.deploymentId}.shaileshh.com`;
      completeDeployment(deploymentUrl);
    }

    return () => {
      clearInterval(progressInterval);
    };
  }, [
    progress,
    currentStep,
    deploymentSteps,
    deploymentState.deploymentId,
    completeDeployment,
  ]);

  const repoNameDisplay =
    deploymentState.repoName.length > 20
      ? `${deploymentState.repoName.substring(0, 20)}...`
      : deploymentState.repoName;

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <h2 className="text-lg font-medium flex-1">
          Deploying: {repoNameDisplay}
        </h2>
      </div>

      <div className="mb-6">
        <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>Build</span>
          <span>Deploy</span>
          <span>Live</span>
        </div>
      </div>

      <div className="bg-gray-900 rounded-md p-4 font-mono text-sm h-64 overflow-auto">
        <div className="flex items-center text-blue-400 mb-2">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          <span>{deploymentSteps[currentStep]?.step}</span>
        </div>

        {deploymentSteps.slice(0, currentStep).map((step, index) => (
          <div key={index} className="text-gray-400 mb-1 pl-6">
            {step.step} <span className="text-green-400">✓</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeploymentStatus;
