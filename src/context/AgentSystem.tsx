import React, { createContext, useState, useEffect } from 'react';
import { AgentOrchestrator } from '../agents/orchestrator';

export const AgentSystemContext = createContext<any>(null);

export const AgentSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orchestrator] = useState(() => new AgentOrchestrator());
  const [systemState, setSystemState] = useState({
    currentStage: null,
    validationProgress: {},
    activeAgents: []
  });

  return (
    <AgentSystemContext.Provider value={{ orchestrator, systemState, setSystemState }}>
      {children}
    </AgentSystemContext.Provider>
  );
};