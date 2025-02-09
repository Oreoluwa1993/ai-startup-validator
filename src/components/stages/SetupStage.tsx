import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Building, Globe, Target } from 'lucide-react';

interface SetupData {
  industry: string;
  location: string;
  investmentType: string;
  stage: string;
  problem: string;
  targetMarket: string;
  valueProposition: string;
}

export const SetupStage: React.FC = () => {
  const [setupData, setSetupData] = useState<SetupData>({
    industry: '',
    location: '',
    investmentType: '',
    stage: '',
    problem: '',
    targetMarket: '',
    valueProposition: ''
  });

  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const industries = [
    'SaaS',
    'E-commerce',
    'Fintech',
    'Healthcare',
    'AI/ML',
    'Enterprise Software',
    'Consumer Tech',
    'Clean Tech'
  ];

  const investmentTypes = [
    'Pre-seed',
    'Seed',
    'Series A',
    'Series B',
    'Bootstrap',
    'Venture Studio'
  ];

  const stages = [
    'Idea',
    'MVP',
    'Product-Market Fit',
    'Growth',
    'Scale'
  ];

  const handleInputChange = (field: keyof SetupData, value: string) => {
    setSetupData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const analysis = await analyzeSetup(setupData);
      setAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing setup:', error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Company & Market Context */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Company & Market Context
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Industry Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Industry</label>
              <select
                className="w-full p-2 border rounded-md"
                value={setupData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
              >
                <option value="">Select Industry</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={setupData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., San Francisco, London"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment & Stage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Investment & Stage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Investment Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Investment Type</label>
              <select
                className="w-full p-2 border rounded-md"
                value={setupData.investmentType}
                onChange={(e) => handleInputChange('investmentType', e.target.value)}
              >
                <option value="">Select Investment Type</option>
                {investmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Stage */}
            <div>
              <label className="block text-sm font-medium mb-2">Current Stage</label>
              <select
                className="w-full p-2 border rounded-md"
                value={setupData.stage}
                onChange={(e) => handleInputChange('stage', e.target.value)}
              >
                <option value="">Select Stage</option>
                {stages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Problem & Solution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Problem & Solution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Problem Statement */}
            <div>
              <label className="block text-sm font-medium mb-2">Problem Statement</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={4}
                value={setupData.problem}
                onChange={(e) => handleInputChange('problem', e.target.value)}
                placeholder="Describe the problem you're solving..."
              />
            </div>

            {/* Target Market */}
            <div>
              <label className="block text-sm font-medium mb-2">Target Market</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                value={setupData.targetMarket}
                onChange={(e) => handleInputChange('targetMarket', e.target.value)}
                placeholder="Describe your target market..."
              />
            </div>

            {/* Value Proposition */}
            <div>
              <label className="block text-sm font-medium mb-2">Value Proposition</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                value={setupData.valueProposition}
                onChange={(e) => handleInputChange('valueProposition', e.target.value)}
                placeholder="Describe your value proposition..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Market Insights */}
              <div>
                <h3 className="font-medium">Market Insights</h3>
                <ul className="mt-2 space-y-2">
                  {analysis.marketInsights.map((insight: string, index: number) => (
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
                  {analysis.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                      <span className="text-gray-600">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next Steps */}
              <div>
                <h3 className="font-medium">Next Steps</h3>
                <ul className="mt-2 space-y-2">
                  {analysis.nextSteps.map((step: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                      <span className="text-gray-600">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze Setup'}
        </button>
      </div>
    </div>
  );
};

export default SetupStage;