import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AgentCommunicationHub = () => {
  const [agents, setAgents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const initializeHub = async () => {
      try {
        setStatus('connecting');
        // Simulated connection setup - replace with actual WebSocket logic
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStatus('connected');
      } catch (err) {
        setError('Failed to initialize communication hub');
        setStatus('error');
      }
    };

    initializeHub();
  }, []);

  // Register a new agent
  const registerAgent = useCallback((agentId, capabilities) => {
    setAgents(prev => [...prev, { id: agentId, capabilities, status: 'active' }]);
  }, []);

  // Send message between agents
  const sendMessage = useCallback((from, to, content) => {
    const newMessage = {
      id: Date.now(),
      from,
      to,
      content,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  }, []);

  // Handle agent disconnection
  const disconnectAgent = useCallback((agentId) => {
    setAgents(prev => 
      prev.map(agent => 
        agent.id === agentId 
          ? { ...agent, status: 'disconnected' }
          : agent
      )
    );
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Agent Communication Hub</h2>
        <div className="flex items-center space-x-2">
          <span className={`h-3 w-3 rounded-full ${
            status === 'connected' ? 'bg-green-500' : 
            status === 'connecting' ? 'bg-yellow-500' : 
            'bg-red-500'
          }`} />
          <span className="text-sm text-gray-600">{status}</span>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Active Agents Panel */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Active Agents</h3>
          <div className="space-y-2">
            {agents.map(agent => (
              <div 
                key={agent.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <span>{agent.id}</span>
                <span className={`text-sm ${
                  agent.status === 'active' ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {agent.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages Panel */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Recent Messages</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {messages.map(message => (
              <div 
                key={message.id}
                className="p-2 bg-gray-50 rounded text-sm"
              >
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{message.from} → {message.to}</span>
                  <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="mt-1">{message.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* API Documentation */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Hub API</h3>
        <div className="space-y-2 text-sm">
          <p><code className="bg-gray-200 px-1 rounded">registerAgent(agentId, capabilities)</code> - Register a new agent</p>
          <p><code className="bg-gray-200 px-1 rounded">sendMessage(from, to, content)</code> - Send a message between agents</p>
          <p><code className="bg-gray-200 px-1 rounded">disconnectAgent(agentId)</code> - Disconnect an agent</p>
        </div>
      </div>
    </div>
  );
};

export default AgentCommunicationHub;