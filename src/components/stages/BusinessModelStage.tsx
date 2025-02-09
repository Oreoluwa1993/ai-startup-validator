import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building, 
  DollarSign, 
  Users, 
  Truck, 
  Key,
  Activity,
  BarChart2,
  Settings
} from 'lucide-react';

interface BusinessModelComponent {
  id: string;
  type: BusinessModelComponentType;
  name: string;
  description: string;
  validation: ValidationStatus;
  metrics: { [key: string]: number };
  experiments: Experiment[];
}

type BusinessModelComponentType = 
  | 'value_proposition'
  | 'customer_segments'
  | 'channels'
  | 'revenue_streams'
  | 'cost_structure'
  | 'key_resources'
  | 'key_activities'
  | 'key_partnerships';

interface ValidationStatus {
  score: number;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  risks: string[];
}

interface Experiment {
  id: string;
  name: string;
  hypothesis: string;
  metrics: { [key: string]: number };
  status: 'not_started' | 'in_progress' | 'completed';
  results?: ExperimentResults;
}

interface ExperimentResults {
  success: boolean;
  metrics: { [key: string]: number };
  insights: string[];
  nextSteps: string[];
}

export const BusinessModelStage: React.FC = () => {
  const [components, setComponents] = useState<BusinessModelComponent[]>([]);
  const [currentComponent, setCurrentComponent] = useState<BusinessModelComponent | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const analysis = await analyzeBusinessModel(components);
      setAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing business model:', error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Business Model Canvas */}
      <div className="grid grid-cols-3 gap-6">
        {/* Key Partners */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Key Partners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BusinessModelSection
              type="key_partnerships"
              components={components}
              onEdit={setCurrentComponent}
            />
          </CardContent>
        </Card>

        {/* Key Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Key Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BusinessModelSection
              type="key_activities"
              components={components}
              onEdit={setCurrentComponent}
            />
          </CardContent>
        </Card>

        {/* Value Proposition */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Value Proposition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BusinessModelSection
              type="value_proposition"
              components={components}
              onEdit={setCurrentComponent}
            />
          </CardContent>
        </Card>

        {/* Customer Segments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Customer Segments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BusinessModelSection
              type="customer_segments"
              components={components}
              onEdit={setCurrentComponent}
            />
          </CardContent>
        </Card>

        {/* Channels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Channels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BusinessModelSection
              type="channels"
              components={components}
              onEdit={setCurrentComponent}
            />
          </CardContent>
        </Card>

        {/* Revenue Streams */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Revenue Streams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BusinessModelSection
              type="revenue_streams"
              components={components}
              onEdit={setCurrentComponent}
            />
          </CardContent>
        </Card>
      </div>

      {/* Current Component Detail */}
      {currentComponent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Edit {currentComponent.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ComponentForm
              component={currentComponent}
              onSave={(updated) => {
                setComponents(prev => 
                  prev.map(c => c.id === updated.id ? updated : c)
                );
                setCurrentComponent(null);
              }}
              onCancel={() => setCurrentComponent(null)}
            />
          </CardContent>
        </Card>
      )}

      {/* Business Model Analysis */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5" />
              Business Model Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Overall Score */}
              <div>
                <h3 className="font-medium mb-2">Overall Score</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        analysis.score >= 0.7 ? 'bg-green-500' :
                        analysis.score >= 0.5 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${analysis.score * 100}%` }}
                    />
                  </div>
                  <span className="font-medium">
                    {Math.round(analysis.score * 100)}%
                  </span>
                </div>
              </div>

              {/* Component Scores */}
              <div>
                <h3 className="font-medium mb-2">Component Analysis</h3>
                <div className="space-y-2">
                  {analysis.componentScores.map((score: any) => (
                    <div key={score.component} className="flex items-center gap-4">
                      <span className="text-sm text-gray-600 w-48">
                        {score.component}
                      </span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            score.score >= 0.7 ? 'bg-green-500' :
                            score.score >= 0.5 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${score.score * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12">
                        {Math.round(score.score * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Findings */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Strengths</h3>
                  <ul className="space-y-2">
                    {analysis.strengths.map((strength: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                        <span className="text-sm text-gray-600">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Improvement Areas</h3>
                  <ul className="space-y-2">
                    {analysis.improvements.map((improvement: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2" />
                        <span className="text-sm text-gray-600">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="font-medium mb-2">Recommendations</h3>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                      <span className="text-sm text-gray-600">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
          disabled={loading || components.length === 0}
        >
          {loading ? 'Analyzing...' : 'Analyze Business Model'}
        </button>
      </div>
    </div>
  );
};

const BusinessModelSection: React.FC<{
  type: BusinessModelComponentType;
  components: BusinessModelComponent[];
  onEdit: (component: BusinessModelComponent) => void;
}> = ({ type, components, onEdit }) => {
  const sectionComponents = components.filter(c => c.type === type);

  return (
    <div className="space-y-4">
      {sectionComponents.map(component => (
        <div
          key={component.id}
          className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
          onClick={() => onEdit(component)}
        >
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium">{component.name}</h4>
            <ValidationBadge score={component.validation.score} />
          </div>
          <p className="text-sm text-gray-600">{component.description}</p>
        </div>
      ))}
      <button
        className="w-full p-2 border border-dashed rounded-lg text-gray-500 hover:bg-gray-50"
        onClick={() => onEdit({
          id: `comp_${Date.now()}`,
          type,
          name: '',
          description: '',
          validation: {
            score: 0,
            strengths: [],
            weaknesses: [],
            opportunities: [],
            risks: []
          },
          metrics: {},
          experiments: []
        })}
      >
        + Add Component
      </button>
    </div>
  );
};

const ValidationBadge: React.FC<{
  score: number;
}> = ({ score }) => (
  <span className={`px-2 py-1 text-xs rounded-full ${
    score >= 0.7 ? 'bg-green-100 text-green-800' :
    score >= 0.5 ? 'bg-yellow-100 text-yellow-800' :
    'bg-red-100 text-red-800'
  }`}>
    {Math.round(score * 100)}%
  </span>
);

const ComponentForm: React.FC<{
  component: BusinessModelComponent;
  onSave: (component: BusinessModelComponent) => void;
  onCancel: () => void;
}> = ({ component, onSave, onCancel }) => {
  const [editedComponent, setEditedComponent] = useState(component);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          value={editedComponent.name}
          onChange={(e) => setEditedComponent(prev => ({
            ...prev,
            name: e.target.value
          }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          className="w-full p-2 border rounded-md"
          rows={3}
          value={editedComponent.description}
          onChange={(e) => setEditedComponent(prev => ({
            ...prev,
            description: e.target.value
          }))}
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          className="px-4 py-2 border rounded-md hover:bg-gray-50"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => onSave(editedComponent)}
        >
          Save Component
        </button>
      </div>
    </div>
  );
};

export default BusinessModelStage;