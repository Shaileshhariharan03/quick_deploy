/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useReducer } from "react";

// Define deployment states
type DeploymentStatus =
  | "idle"
  | "building"
  | "deploying"
  | "complete"
  | "error";

interface DeploymentState {
  status: DeploymentStatus;
  repoUrl: string;
  repoName: string;
  deploymentUrl: string | null;
  deploymentId: string | number | null;
  error: string | null;
}

// Define actions
type DeploymentAction =
  | {
      type: "START_DEPLOYMENT";
      payload: { id: string | number; repoUrl: string };
    }
  | { type: "COMPLETE_DEPLOYMENT"; payload: string }
  | { type: "SET_ERROR"; payload: string }
  | { type: "RESET" };

// Define context shape
interface DeploymentContextType {
  deploymentState: DeploymentState;
  startDeployment: (id: string | number, repoUrl: string) => void; // UPDATED
  completeDeployment: (deploymentUrl: string) => void;
  setError: (error: string) => void;
  resetDeployment: () => void;
}

// Initial state
const initialState: DeploymentState = {
  status: "idle",
  repoUrl: "",
  repoName: "",
  deploymentUrl: null,
  deploymentId: null,
  error: null,
};

// Create context
const DeploymentContext = createContext<DeploymentContextType | undefined>(
  undefined
);

// Create reducer
const deploymentReducer = (
  state: DeploymentState,
  action: DeploymentAction
): DeploymentState => {
  switch (action.type) {
    case "START_DEPLOYMENT": {
      const { id, repoUrl } = action.payload;
      const urlParts = repoUrl.split("/");
      const repoName = urlParts[urlParts.length - 1]?.replace(".git", "") || "";

      return {
        ...state,
        status: "deploying",
        deploymentId: id,
        repoUrl,
        repoName,
        error: null,
      };
    }

    case "COMPLETE_DEPLOYMENT":
      return {
        ...state,
        status: "complete",
        deploymentUrl: action.payload,
        error: null,
      };

    case "SET_ERROR":
      return {
        ...state,
        status: "error",
        error: action.payload,
      };

    case "RESET":
      return initialState;

    default:
      return state;
  }
};

// Create provider component
export const DeploymentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(deploymentReducer, initialState);

  const startDeployment = (id: string | number, repoUrl: string) => {
    dispatch({ type: "START_DEPLOYMENT", payload: { id, repoUrl } });
  };

  const completeDeployment = (deploymentUrl: string) => {
    dispatch({ type: "COMPLETE_DEPLOYMENT", payload: deploymentUrl });
  };

  const setError = (error: string) => {
    dispatch({ type: "SET_ERROR", payload: error });
  };

  const resetDeployment = () => {
    dispatch({ type: "RESET" });
  };

  return (
    <DeploymentContext.Provider
      value={{
        deploymentState: state,
        startDeployment,
        completeDeployment,
        setError,
        resetDeployment,
      }}
    >
      {children}
    </DeploymentContext.Provider>
  );
};

// Create hook for using the context
export const useDeployment = (): DeploymentContextType => {
  const context = useContext(DeploymentContext);
  if (context === undefined) {
    throw new Error("useDeployment must be used within a DeploymentProvider");
  }
  return context;
};
