import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Brain,
  BarChart2,
  Users,
  Code,
  DollarSign,
  Target,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface ValidationStage {
  id: string;
  title: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  agent: string;
  experiments: any[];
}

export const Dashboard = () => {
  const [currentStage, setCurrentStage] = useState<string>('setup');
  const [validationData, setValidationData] = useState<any>({});
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const stages: ValidationStage[] = [
    {
      id: 'setup',
      title: 'Project Setup',
      description: 'Configure initial project settings and context',
      status: 'not_started',
      progress: 0,
      agent: 'ProjectManager',
      experiments: []
    },
    {
      id: 'problem_validation',
      title: 'Problem Validation',
      description: 'Validate problem using MOM Test methodology',
      status: 'not_started',
      progress: 0,
      agent: 'BusinessCoach',
      experiments: []
    },
    {
      id: 'market_analysis',
      title: 'Market Analysis',
      description: 'Analyze market size and opportunity',
      status: 'not_started',
      progress: 0,
      agent: 'MarketIntelligence',
      experiments: []
    },
    {
      id: 'customer_development',
      title: 'Customer Development',
      description: 'Develop and validate customer personas',
      status: 'not_started',
      progress: 0,
      agent: 'CustomerDevelopment',
      experiments: []
    },
    {
      id: 'solution_validation',
      title: 'Solution Validation',
      description: 'Validate solution fit and MVP',
      status: 'not_started',
      progress: 0,
      agent: 'ProductDevelopment',
      experiments: []
    },
    {
      id: 'business_model',
      title: 'Business Model',
      description: 'Validate business model and pricing',
      status: 'not_started',
      progress: 0,
      agent: 'BusinessModel',
      experiments: []
    },
    {
      id: 'growth_strategy',
      title: 'Growth Strategy',
      description: 'Develop and validate growth strategy',
      status: 'not_started',
      progress: 0,
      agent: 'GrowthStrategy',
      experiments: []
    }
  ];

  useEffect(() => {
    loadStageData(currentStage);
  }, [currentStage]);

  const loadStageData = async (stageId: string) => {
    setIsLoading(true);
    try {
      const data = await fetchStageData(stageId);
      setValidationData(data);
      const analysis = await analyzeStageData(stageId, data);
      setAnalysis(analysis);
    } catch (error) {
      console.error('Error loading stage data:', error);
    }
    setIsLoading(false);
  };

  const handleStageSelect = async (stageId: string) => {
    setCurrentStage(stageId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Startup Validation Dashboard</h1>
        <p className="text-gray-600">AI-powered validation and analysis</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Stage Navigation */}
        <div className="md:col-span-1">
          <StageNavigation
            stages={stages}
            currentStage={currentStage}
            onStageSelect={handleStageSelect}
          />
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3">
          <div className="space-y-6">
            {/* Current Stage Overview */}
            <StageOverview
              stage={stages.find(s => s.id === currentStage)!}
              data={validationData}
            />

            {/* Analysis Results */}
            {analysis && (
              <AnalysisResults analysis={analysis} />
            )}

            {/* Action Items */}
            <ActionItems
              stage={stages.find(s => s.id === currentStage)!}
              analysis={analysis}
            />

            {/* Experiments */}
            <ExperimentsList
              stage={stages.find(s => s.id === currentStage)!}
              experiments={validationData.experiments || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StageNavigation: React.FC<{
  stages: ValidationStage[];
  currentStage: string;
  onStageSelect: (stageId: string) => void;
}> = ({ stages, currentStage, onStageSelect }) => (
  <div className="space-y-4">
    {stages.map(stage => (
      <Card
        key={stage.id}
        className={`cursor-pointer transition-colors ${
          currentStage === stage.id ? 'border-blue-500 bg-blue-50' : ''
        }`}
        onClick={() => onStageSelect(stage.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{stage.title}</h3>
              <p className="text-sm text-gray-600">{stage.description}</p>
            </div>
            <div className="flex items-center">
              {stage.status === 'completed' && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {stage.status === 'failed' && (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              )}
              {stage.status === 'in_progress' && (
                <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              )}
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${stage.progress}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const StageOverview: React.FC<{
  stage: ValidationStage;
  data: any;
}> = ({ stage, data }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Brain className="w-6 h-6" />
        {stage.title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <h3 className="font-medium">Description</h3>
          <p className="text-gray-600">{stage.description}</p>
        </div>
        <div>
          <h3 className="font-medium">Progress</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${stage.progress}%` }}
              />
            </div>
            <span className="text-sm font-medium">{stage.progress}%</span>
          </div>
        </div>
        <div>
          <h3 className="font-medium">Agent</h3>
          <p className="text-gray-600">{stage.agent} Agent</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const AnalysisResults: React.FC<{
  analysis: any;
}> = ({ analysis }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <BarChart2 className="w-6 h-6" />
        Analysis Results
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {/* Insights */}
        <div>
          <h3 className="font-medium">Key Insights</h3>
          <ul className="mt-2 space-y-2">
            {analysis.insights?.map((insight: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                <span className="text-gray-600">{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="font-medium">Recommendations</h3>
          <ul className="mt-2 space-y-2">
            {analysis.recommendations?.map((rec: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                <span className="text-gray-600">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risks */}
        <div>
          <h3 className="font-medium">Risks</h3>
          <ul className="mt-2 space-y-2">
            {analysis.risks?.map((risk: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />
                <span className="text-gray-600">{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ActionItems: React.FC<{
  stage: ValidationStage;
  analysis: any;
}> = ({ stage, analysis }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <CheckCircle className="w-6 h-6" />
        Action Items
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {analysis?.nextSteps?.map((step: string, index: number) => (
          <div
            key={index}
            className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
              {index + 1}
            </div>
            <span className="text-gray-600">{step}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const ExperimentsList: React.FC<{
  stage: ValidationStage;
  experiments: any[];
}> = ({ stage, experiments }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Code className="w-6 h-6" />
        Experiments
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {experiments.map((experiment, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{experiment.name}</h4>
              <span className={`px-2 py-1 rounded-full text-sm ${
                experiment.status === 'completed' ? 'bg-green-100 text-green-800' :
                experiment.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {experiment.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{experiment.description}</p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                Duration: {experiment.duration} days
              </span>
              <span className="text-sm text-gray-500">
                Success Rate: {experiment.successRate}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default Dashboard;