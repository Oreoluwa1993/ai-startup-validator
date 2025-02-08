import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  ChevronRight
} from 'lucide-react';

interface StageAnalysisProps {
  analysis: any;
  stage: string;
}

export const StageAnalysis: React.FC<StageAnalysisProps> = ({ analysis, stage }) => {
  const renderAnalysisContent = () => {
    switch (stage) {
      case 'marketAnalysis':
        return <MarketAnalysis analysis={analysis} />;
      case 'competitiveAnalysis':
        return <CompetitiveAnalysis analysis={analysis} />;
      case 'productDevelopment':
        return <ProductAnalysis analysis={analysis} />;
      case 'financialPlanning':
        return <FinancialAnalysis analysis={analysis} />;
      case 'goToMarket':
        return <GTMAnalysis analysis={analysis} />;
      default:
        return <DefaultAnalysis analysis={analysis} />;
    }
  };

  return (
    <div className="space-y-6">
      <AnalysisScore score={analysis.score} />
      {renderAnalysisContent()}
      <KeyInsights insights={analysis.insights} />
      <NextSteps steps={analysis.nextSteps} />
    </div>
  );
};

const AnalysisScore: React.FC<{ score: number }> = ({ score }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Brain className="w-5 h-5" />
        Analysis Score
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">
          {Math.round(score * 100)}%
        </div>
        <div className={`text-sm ${
          score >= 0.7 ? 'text-green-500' :
          score >= 0.5 ? 'text-yellow-500' :
          'text-red-500'
        }`}>
          {score >= 0.7 ? 'Strong' :
           score >= 0.5 ? 'Moderate' :
           'Needs Improvement'}
        </div>
      </div>
      <div className="mt-4 h-2 bg-gray-100 rounded-full">
        <div
          className={`h-full rounded-full ${
            score >= 0.7 ? 'bg-green-500' :
            score >= 0.5 ? 'bg-yellow-500' :
            'bg-red-500'
          }`}
          style={{ width: `${score * 100}%` }}
        />
      </div>
    </CardContent>
  </Card>
);

const MarketAnalysis: React.FC<{ analysis: any }> = ({ analysis }) => (
  <Card>
    <CardHeader>
      <CardTitle>Market Analysis</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-600">Total Market Size</div>
            <div className="text-xl font-bold">${analysis.marketSize.tam}B</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Serviceable Market</div>
            <div className="text-xl font-bold">${analysis.marketSize.sam}B</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Target Market</div>
            <div className="text-xl font-bold">${analysis.marketSize.som}B</div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Market Trends</h3>
          <div className="space-y-2">
            {analysis.trends.map((trend: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span>{trend.name}</span>
                <div className="flex items-center gap-2">
                  <TrendingUp className={`w-4 h-4 ${
                    trend.impact > 0 ? 'text-green-500' : 'text-red-500'
                  }`} />
                  <span className={trend.impact > 0 ? 'text-green-500' : 'text-red-500'}>
                    {trend.impact > 0 ? '+' : ''}{trend.impact}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Market Opportunities</h3>
          <div className="space-y-2">
            {analysis.opportunities.map((opportunity: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{opportunity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const CompetitiveAnalysis: React.FC<{ analysis: any }> = ({ analysis }) => (
  <Card>
    <CardHeader>
      <CardTitle>Competitive Analysis</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Direct Competitors</h3>
          <div className="space-y-3">
            {analysis.competitors.direct.map((competitor: any, index: number) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">{competitor.name}</div>
                <div className="text-sm text-gray-600 mt-1">
                  Market Share: {competitor.marketShare}%
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {competitor.strengths.map((strength: string, i: number) => (
                    <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Competitive Advantages</h3>
          <div className="space-y-2">
            {analysis.advantages.map((advantage: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span>{advantage.name}</span>
                <div className="text-sm font-medium">
                  Strength: {advantage.strength}/10
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ProductAnalysis: React.FC<{ analysis: any }> = ({ analysis }) => (
  <Card>
    <CardHeader>
      <CardTitle>Product Development Analysis</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">MVP Features</h3>
          <div className="grid gap-3">
            {analysis.mvp.features.map((feature: any, index: number) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{feature.name}</div>
                  <div className="text-sm">
                    Priority: {feature.priority}/10
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {feature.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Technical Requirements</h3>
          <div className="space-y-2">
            {analysis.technical.requirements.map((req: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4" />
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const FinancialAnalysis: React.FC<{ analysis: any }> = ({ analysis }) => (
  <Card>
    <CardHeader>
      <CardTitle>Financial Analysis</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Initial Investment</div>
            <div className="text-xl font-bold">
              ${analysis.funding.initial.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Break-even Point</div>
            <div className="text-xl font-bold">
              {analysis.breakeven.months} months
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Revenue Projections</h3>
          <div className="space-y-2">
            {analysis.projections.map((year: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span>Year {index + 1}</span>
                <div className="font-medium">
                  ${year.revenue.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const GTMAnalysis: React.FC<{ analysis: any }> = ({ analysis }) => (
  <Card>
    <CardHeader>
      <CardTitle>Go-to-Market Analysis</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Channel Strategy</h3>
          <div className="space-y-3">
            {analysis.channels.map((channel: any, index: number) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{channel.name}</div>
                  <div className="text-sm">
                    ROI: {channel.roi}x
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  CAC: ${channel.cac} | LTV: ${channel.ltv}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Marketing Strategy</h3>
          <div className="space-y-2">
            {analysis.marketing.tactics.map((tactic: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span>{tactic.name}</span>
                <div className="text-sm font-medium">
                  Impact: {tactic.impact}/10
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const KeyInsights: React.FC<{ insights: any[] }> = ({ insights }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Brain className="w-5 h-5" />
        Key Insights
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              insight.type === 'positive' ? 'bg-green-100 text-green-600' :
              insight.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
              'bg-blue-100 text-blue-600'
            }`}>
              {insight.type === 'positive' ? '↑' :
               insight.type === 'warning' ? '!' :
               'i'}
            </div>
            <div>
              <div className="font-medium">{insight.title}</div>
              <p className="text-sm text-gray-600">{insight.description}</p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const NextSteps: React.FC<{ steps: any[] }> = ({ steps }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <ChevronRight className="w-5 h-5" />
        Next Steps
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
              {index + 1}
            </div>
            <div>
              <div className="font-medium">{step.title}</div>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default StageAnalysis;