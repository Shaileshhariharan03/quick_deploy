import React, { useState } from "react";
import { useDeployment } from "../context/DeploymentContext";
import { Github } from "lucide-react";
import axios from "axios";

const DeploymentForm: React.FC = () => {
  const { startDeployment } = useDeployment();
  const [repoUrl, setRepoUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validateUrl = (url: string): boolean => {
    // Simple validation - checks if it looks like a git repo URL
    const gitRepoPattern =
      /^(https?:\/\/)?(www\.)?github\.com\/[\w\-._~:/?#[\]@!$&'()*+,;=]+\/[\w\-._~:/?#[\]@!$&'()*+,;=]+$/i;
    return gitRepoPattern.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!repoUrl.trim()) {
      setError("Please enter a repository URL");
      return;
    }

    if (!validateUrl(repoUrl)) {
      setError("Please enter a valid GitHub repository URL");
      return;
    }

    setError(null);
    try {
      const response = await axios.post("http://localhost:3000/deploy", {
        repoURL: repoUrl,
      });
      const deploymentId = response.data.id;
      startDeployment(deploymentId, repoUrl);
    } catch (error) {
      console.error("Deployment failed:", error);
      setError("An error occurred while deploying");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-medium mb-4">Deploy Your Repository</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="repoUrl"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Git Repository URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Github className="h-5 w-5 text-gray-500" />
            </div>
            <input
              id="repoUrl"
              type="text"
              placeholder="https://github.com/username/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className={`block w-full pl-10 pr-3 py-3 bg-gray-700 border ${
                error ? "border-red-500" : "border-gray-600"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
            />
          </div>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex justify-center items-center"
        >
          Deploy
        </button>
      </form>
    </div>
  );
};

export default DeploymentForm;
