import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Code, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  FileText,
  Play,
  Settings,
  Eye
} from 'lucide-react';

interface SolutionTest {
  id: string;
  type: 'mvp' | 'usability' | 'technical' | 'market';
  name: string;
  hypothesis: string;
  successCriteria: SuccessCriterion[];
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  results?: TestResult;
}

interface SuccessCriterion {
  metric: string;
  target: number;
  actual?: number;
  unit: string;
}

interface TestResult {
  score: number;
  feedback: string[];
  metrics: { [key: string]: number };
  insights: string[];
  recommendations: string[];
}

interface Feature {
  id: string;
  name: string;
  description: string;
  priority: 'must_have' | 'should_have' | 'nice_to_have';
  status: 'planned' | 'in_progress' | 'completed';
  validation: {
    usability: number;
    technical: number;
    market: number;
  };
}

export const SolutionValidationStage: React.FC = () => {
  const [tests, setTests] = useState<SolutionTest[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [currentTest, setCurrentTest] = useState<SolutionTest | null>(null);
  const [currentFeature, setCurrentFeature] = useState<Feature | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleNewTest = () => {
    const newTest: SolutionTest = {
      id: `test_${Date.now()}`,
      type: 'mvp',
      name: '',
      hypothesis: '',
      successCriteria: [],
      status: 'not_started'
    };
    setCurrentTest(newTest);
  };

  const handleNewFeature = () => {
    const newFeature: Feature = {
      id: `feature_${Date.now()}`,
      name: '',
      description: '',
      priority: 'must_have',
      status: 'planned',
      validation: {
        usability: 0,
        technical: 0,
        market: 0
      }
    };
    setCurrentFeature(newFeature);
  };

  const handleSaveTest = () => {
    if (!currentTest) return;

    if (currentTest.id) {
      setTests(prev => prev.map(t => t.id === currentTest.id ? currentTest : t));
    } else {
      setTests(prev => [...prev, currentTest]);
    }
    setCurrentTest(null);
  };

  const handleSaveFeature = () => {
    if (!currentFeature) return;

    if (currentFeature.id) {
      setFeatures(prev => prev.map(f => f.id === currentFeature.id ? currentFeature : f));
    } else {
      setFeatures(prev => [...prev, currentFeature]);
    }
    setCurrentFeature(null);
  };

  const handleRunTest = async (testId: string) => {
    setLoading(true);
    try {
      const test = tests.find(t => t.id === testId);
      if (!test) return;

      const results = await runSolutionTest(test);
      setTests(prev => prev.map(t => 
        t.id === testId 
          ? { ...t, status: 'completed', results }
          : t
      ));
    } catch (error) {
      console.error('Error running test:', error);
    }
    setLoading(false);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const analysis = await analyzeSolutionValidation(tests, features);
      setAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing solution validation:', error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* MVP Features */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              MVP Features
            </CardTitle>
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded-md"
              onClick={handleNewFeature}
            >
              Add Feature
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {features.map(feature => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                onEdit={() => setCurrentFeature(feature)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Solution Tests */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Solution Tests
            </CardTitle>
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded-md"
              onClick={handleNewTest}
            >
              New Test
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tests.map(test => (
              <TestCard
                key={test.id}
                test={test}
                onEdit={() => setCurrentTest(test)}
                onRun={() => handleRunTest(test.id)}
                loading={loading}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Form Modal */}
      {currentTest && (
        <TestForm
          test={currentTest}
          onSave={handleSaveTest}
          onCancel={() => setCurrentTest(null)}
        />
      )}

      {/* Feature Form Modal */}
      {currentFeature && (
        <FeatureForm
          feature={currentFeature}
          onSave={handleSaveFeature}
          onCancel={() => setCurrentFeature(null)}
        />
      )}

      {/* Solution Validation Analysis */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Solution Validation Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ValidationAnalysis analysis={analysis} />
          </CardContent>
        </Card>
      )}

      {/* Action Button */}
      <div className="flex justify-end">
        <button
          className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleAnalyze}
          disabled={loading || tests.length === 0}
        >
          {loading ? 'Analyzing...' : 'Analyze Solution'}
        </button>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{
  feature: Feature;
  onEdit: () => void;
}> = ({ feature, onEdit }) => (
  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={onEdit}>
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-medium">{feature.name}</h3>
      <span className={`px-2 py-1 text-xs rounded-full ${
        feature.priority === 'must_have' 
          ? 'bg-red-100 text-red-800'
          : feature.priority === 'should_have'
          ? 'bg-yellow-100 text-yellow-800'
          : 'bg-gray-100 text-gray-800'
      }`}>
        {feature.priority.replace('_', ' ')}
      </span>
    </div>
    <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
    <div className="grid grid-cols-3 gap-4">
      <ValidationScore
        label="Usability"
        score={feature.validation.usability}
      />
      <ValidationScore
        label="Technical"
        score={feature.validation.technical}
      />
      <ValidationScore
        label="Market"
        score={feature.validation.market}
      />
    </div>
  </div>
);

const TestCard: React.FC<{
  test: SolutionTest;
  onEdit: () => void;
  onRun: () => void;
  loading: boolean;
}> = ({ test, onEdit, onRun, loading }) => (
  <div className="p-4 border rounded-lg">
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-medium">{test.name}</h3>
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 text-xs rounded-full ${
          test.status === 'completed'
            ? 'bg-green-100 text-green-800'
            : test.status === 'failed'
            ? 'bg-red-100 text-red-800'
            : test.status === 'in_progress'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {test.status.replace('_', ' ')}
        </span>
        {test.status === 'not_started' && (
          <button
            className={`px-2 py-1 text-xs bg-blue-500 text-white rounded-md ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={onRun}
            disabled={loading}
          >
            Run Test
          </button>
        )}
      </div>
    </div>
    <p className="text-sm text-gray-600 mb-2">{test.hypothesis}</p>
    {test.results && (
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Test Score</span>
          <span className={`text-sm font-medium ${
            test.results.score >= 0.7 ? 'text-green-600' :
            test.results.score >= 0.5 ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {Math.round(test.results.score * 100)}%
          </span>
        </div>
        <div>
          <span className="text-sm text-gray-500">Key Insights</span>
          <ul className="mt-1 space-y-1">
            {test.results.insights.map((insight, index) => (
              <li key={index} className="text-sm text-gray-600">• {insight}</li>
            ))}
          </ul>
        </div>
      </div>
    )}
    <button
      className="mt-2 text-sm text-blue-500 hover:text-blue-600"
      onClick={onEdit}
    >
      Edit Test
    </button>
  </div>
);

const ValidationScore: React.FC<{
  label: string;
  score: number;
}> = ({ label, score }) => (
  <div>
    <span className="text-xs text-gray-500">{label}</span>
    <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
      <div
        className={`h-full rounded-full ${
          score >= 0.7 ? 'bg-green-500' :
          score >= 0.5 ? 'bg-yellow-500' :
          'bg-red-500'
        }`}
        style={{ width: `${score * 100}%` }}
      />
    </div>
  </div>
);

const TestForm: React.FC<{
  test: SolutionTest;
  onSave: () => void;
  onCancel: () => void;
}> = ({ test, onSave, onCancel }) => {
  // Form implementation
  return <div>Test Form Component</div>;
};

const FeatureForm: React.FC<{
  feature: Feature;
  onSave: () => void;
  onCancel: () => void;
}> = ({ feature, onSave, onCancel }) => {
  // Form implementation
  return <div>Feature Form Component</div>;
};

const ValidationAnalysis: React.FC<{
  analysis: any;
}> = ({ analysis }) => {
  // Analysis display implementation
  return <div>Validation Analysis Component</div>;
};

export default SolutionValidationStage;