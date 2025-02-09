import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart2, 
  Users, 
  TrendingUp, 
  Target,
  DollarSign,
  Globe 
} from 'lucide-react';

interface MarketData {
  marketSize: MarketSize;
  segments: MarketSegment[];
  trends: MarketTrend[];
  competitors: CompetitorBrief[];
}

interface MarketSize {
  tam: number;
  sam: number;
  som: number;
  growthRate: number;
}

interface MarketSegment {
  name: string;
  size: number;
  growthRate: number;
  characteristics: string[];
  needs: string[];
  willingness: number;
}

interface MarketTrend {
  name: string;
  impact: number;
  probability: number;
  timeframe: string;
  description: string;
}

interface CompetitorBrief {
  name: string;
  marketShare: number;
  strengths: string[];
  weaknesses: string[];
}

export const MarketAnalysisStage: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyzeMarket = async () => {
    setLoading(true);
    try {
      const analysis = await analyzeMarket();
      setAnalysis(analysis);
      setMarketData(analysis.marketData);
    } catch (error) {
      console.error('Error analyzing market:', error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Market Size Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Market Size Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {marketData ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MarketMetricCard
                  title="Total Addressable Market"
                  value={marketData.marketSize.tam}
                  format="currency"
                  icon={<DollarSign className="w-5 h-5" />}
                />
                <MarketMetricCard
                  title="Serviceable Addressable Market"
                  value={marketData.marketSize.sam}
                  format="currency"
                  icon={<Target className="w-5 h-5" />}
                />
                <MarketMetricCard
                  title="Serviceable Obtainable Market"
                  value={marketData.marketSize.som}
                  format="currency"
                  icon={<Users className="w-5 h-5" />}
                />
                <MarketMetricCard
                  title="Growth Rate"
                  value={marketData.marketSize.growthRate}
                  format="percentage"
                  icon={<TrendingUp className="w-5 h-5" />}
                />
              </div>

              <div>
                <h3 className="font-medium mb-2">Market Size Breakdown</h3>
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${(marketData.marketSize.som / marketData.marketSize.tam) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-sm text-gray-600">
                  <span>SOM</span>
                  <span>SAM</span>
                  <span>TAM</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Click "Analyze Market" to begin analysis
            </div>
          )}
        </CardContent>
      </Card>

      {/* Market Segments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Market Segments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {marketData?.segments ? (
            <div className="space-y-4">
              {marketData.segments.map((segment, index) => (
                <SegmentCard key={index} segment={segment} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No segment data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Market Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Market Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          {marketData?.trends ? (
            <div className="space-y-4">
              {marketData.trends.map((trend, index) => (
                <TrendCard key={index} trend={trend} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No trend data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Competitive Landscape */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Competitive Landscape
          </CardTitle>
        </CardHeader>
        <CardContent>
          {marketData?.competitors ? (
            <div className="space-y-4">
              {marketData.competitors.map((competitor, index) => (
                <CompetitorCard key={index} competitor={competitor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No competitor data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5" />
              Market Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Insights */}
              <div>
                <h3 className="font-medium mb-2">Key Insights</h3>
                <div className="space-y-2">
                  {analysis.insights.map((insight: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                      <span className="text-gray-600">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Opportunities */}
              <div>
                <h3 className="font-medium mb-2">Market Opportunities</h3>
                <div className="space-y-2">
                  {analysis.opportunities.map((opportunity: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                      <span className="text-gray-600">{opportunity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risks */}
              <div>
                <h3 className="font-medium mb-2">Market Risks</h3>
                <div className="space-y-2">
                  {analysis.risks.map((risk: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />
                      <span className="text-gray-600">{risk}</span>
                    </div>
                  ))}
                </div>
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
          onClick={handleAnalyzeMarket}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze Market'}
        </button>
      </div>
    </div>
  );
};

const MarketMetricCard: React.FC<{
  title: string;
  value: number;
  format: 'currency' | 'percentage';
  icon: React.ReactNode;
}> = ({ title, value, format, icon }) => (
  <div className="p-4 border rounded-lg">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="font-medium">{title}</span>
    </div>
    <div className="text-2xl font-bold">
      {format === 'currency' 
        ? `$${(value / 1_000_000).toFixed(1)}M`
        : `${(value * 100).toFixed(1)}%`
      }
    </div>
  </div>
);

const SegmentCard: React.FC<{
  segment: MarketSegment;
}> = ({ segment }) => (
  <div className="p-4 border rounded-lg">
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-medium">{segment.name}</h3>
      <span className="text-sm text-gray-500">
        {(segment.growthRate * 100).toFixed(1)}% growth
      </span>
    </div>
    <div className="space-y-2">
      <div className="text-sm text-gray-600">
        Size: ${(segment.size / 1_000_000).toFixed(1)}M
      </div>
      <div className="text-sm text-gray-600">
        Characteristics: {segment.characteristics.join(', ')}
      </div>
      <div className="text-sm text-gray-600">
        Key Needs: {segment.needs.join(', ')}
      </div>
    </div>
  </div>
);

const TrendCard: React.FC<{
  trend: MarketTrend;
}> = ({ trend }) => (
  <div className="p-4 border rounded-lg">
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-medium">{trend.name}</h3>
      <span className="text-sm text-gray-500">{trend.timeframe}</span>
    </div>
    <p className="text-sm text-gray-600 mb-2">{trend.description}</p>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <span className="text-sm text-gray-500">Impact</span>
        <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${trend.impact * 100}%` }}
          />
        </div>
      </div>
      <div>
        <span className="text-sm text-gray-500">Probability</span>
        <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
          <div
            className="h-full bg-green-500 rounded-full"
            style={{ width: `${trend.probability * 100}%` }}
          />
        </div>
      </div>
    </div>
  </div>
);

const CompetitorCard: React.FC<{
  competitor: CompetitorBrief;
}> = ({ competitor }) => (
  <div className="p-4 border rounded-lg">
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-medium">{competitor.name}</h3>
      <span className="text-sm text-gray-500">
        {(competitor.marketShare * 100).toFixed(1)}% share
      </span>
    </div>
    <div className="space-y-2">
      <div>
        <span className="text-sm text-gray-500">Strengths</span>
        <div className="flex flex-wrap gap-2 mt-1">
          {competitor.strengths.map((strength, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded"
            >
              {strength}
            </span>
          ))}
        </div>
      </div>
      <div>
        <span className="text-sm text-gray-500">Weaknesses</span>
        <div className="flex flex-wrap gap-2 mt-1">
          {competitor.weaknesses.map((weakness, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded"
            >
              {weakness}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default MarketAnalysisStage;