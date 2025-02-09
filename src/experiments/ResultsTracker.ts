import { ValidationContext } from '../agents/types';

interface ExperimentResult {
  experimentId: string;
  experimentType: string;
  timestamp: Date;
  metrics: Map<string, number>;
  insights: string[];
  status: 'success' | 'failure' | 'inconclusive';
  evidence: Evidence[];
  confidence: number;
}

interface Evidence {
  type: 'qualitative' | 'quantitative';
  source: string;
  value: any;
  reliability: number;
}

interface ExperimentMetrics {
  success_rate: number;
  completion_rate: number;
  evidence_strength: number;
  confidence_level: number;
}

export class ResultsTracker {
  private results: Map<string, ExperimentResult[]>;
  private metrics: Map<string, ExperimentMetrics>;
  private evidenceCollector: EvidenceCollector;
  private metricsCalculator: MetricsCalculator;

  constructor() {
    this.results = new Map();
    this.metrics = new Map();
    this.evidenceCollector = new EvidenceCollector();
    this.metricsCalculator = new MetricsCalculator();
  }

  private determineStatus(metrics: Map<string, number>, successCriteria: any[]): 'success' | 'failure' | 'inconclusive' {
    const criteriaMet = successCriteria.filter(criterion => {
      const actualValue = metrics.get(criterion.metric);
      return actualValue !== undefined && actualValue >= criterion.target;
    }).length;

    const successRate = criteriaMet / successCriteria.length;

    if (successRate >= 0.8) return 'success';
    if (successRate <= 0.3) return 'failure';
    return 'inconclusive';
  }

  async analyzeEvidence(result: ExperimentResult): Promise<void> {
    const evidenceStrength = this.calculateEvidenceStrength(result.evidence);
    const reliability = this.calculateReliability(result);

    await this.updateExperimentConfidence(result.experimentId, evidenceStrength, reliability);
  }

  private calculateReliability(result: ExperimentResult): number {
    const metricReliability = this.calculateMetricReliability(result.metrics);
    const evidenceReliability = result.evidence.reduce((sum, e) => sum + e.reliability, 0) / result.evidence.length;

    return (metricReliability + evidenceReliability) / 2;
  }

  private async updateExperimentConfidence(
    experimentId: string,
    evidenceStrength: number,
    reliability: number
  ): Promise<void> {
    const result = this.findExperimentResult(experimentId);
    if (result) {
      result.confidence = (evidenceStrength + reliability) / 2;
      await this.updateMetrics(result.experimentType);
    }
  }

  async generateReport(experimentType: string): Promise<ExperimentReport> {
    const results = await this.getResults(experimentType);
    const metrics = await this.getMetrics(experimentType);

    return {
      experimentType,
      totalExperiments: results.length,
      successRate: metrics.success_rate,
      averageConfidence: metrics.confidence_level,
      insights: this.aggregateInsights(results),
      recommendations: this.generateRecommendations(results, metrics),
      evidenceStrength: metrics.evidence_strength,
      timeline: this.generateTimeline(results)
    };
  }

  private generateRecommendations(results: ExperimentResult[], metrics: ExperimentMetrics): string[] {
    const recommendations: string[] = [];

    // Add recommendations based on success rate
    if (metrics.success_rate < 0.5) {
      recommendations.push('Review experiment design and success criteria');
      recommendations.push('Consider increasing sample size or experiment duration');
    }

    // Add recommendations based on evidence strength
    if (metrics.evidence_strength < 0.7) {
      recommendations.push('Collect more quantitative data');
      recommendations.push('Increase diversity of evidence sources');
    }

    // Add recommendations based on confidence level
    if (metrics.confidence_level < 0.6) {
      recommendations.push('Strengthen validation methodology');
      recommendations.push('Consider additional validation techniques');
    }

    return recommendations;
  }

  private generateTimeline(results: ExperimentResult[]): TimelineEvent[] {
    return results
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .map(result => ({
        timestamp: result.timestamp,
        event: `Experiment ${result.experimentId} completed`,
        status: result.status,
        metrics: Object.fromEntries(result.metrics)
      }));
  }

  async trackMetric(experimentId: string, metric: string, value: number): Promise<void> {
    const result = this.findExperimentResult(experimentId);
    if (result) {
      result.metrics.set(metric, value);
      await this.updateMetrics(result.experimentType);
    }
  }

  async addEvidence(experimentId: string, evidence: Evidence): Promise<void> {
    const result = this.findExperimentResult(experimentId);
    if (result) {
      result.evidence.push(evidence);
      await this.analyzeEvidence(result);
    }
  }

  async addInsight(experimentId: string, insight: string): Promise<void> {
    const result = this.findExperimentResult(experimentId);
    if (result && !result.insights.includes(insight)) {
      result.insights.push(insight);
    }
  }

  async getExperimentTimeline(experimentId: string): Promise<TimelineEvent[]> {
    const result = this.findExperimentResult(experimentId);
    if (!result) return [];

    return [{
      timestamp: result.timestamp,
      event: `Experiment started`,
      status: 'in_progress',
      metrics: {}
    }, {
      timestamp: result.timestamp,
      event: `Experiment completed`,
      status: result.status,
      metrics: Object.fromEntries(result.metrics)
    }];
  }

  async getSuccessFactors(experimentType: string): Promise<SuccessFactor[]> {
    const results = await this.getResults(experimentType);
    const successfulResults = results.filter(r => r.status === 'success');
    
    return this.analyzeSuccessFactors(successfulResults);
  }

  private analyzeSuccessFactors(results: ExperimentResult[]): SuccessFactor[] {
    const factors: SuccessFactor[] = [];
    const metricThresholds = new Map<string, number[]>();

    // Collect metric thresholds from successful experiments
    results.forEach(result => {
      result.metrics.forEach((value, metric) => {
        if (!metricThresholds.has(metric)) {
          metricThresholds.set(metric, []);
        }
        metricThresholds.get(metric)?.push(value);
      });
    });

    // Calculate success thresholds for each metric
    metricThresholds.forEach((values, metric) => {
      const average = values.reduce((a, b) => a + b, 0) / values.length;
      factors.push({
        metric,
        threshold: average,
        confidence: this.calculateFactorConfidence(values),
        importance: this.calculateFactorImportance(metric, results)
      });
    });

    return factors.sort((a, b) => b.importance - a.importance);
  }

  private calculateFactorConfidence(values: number[]): number {
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - average, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Higher confidence for lower standard deviation relative to mean
    return 1 - (standardDeviation / average);
  }

  private calculateFactorImportance(metric: string, results: ExperimentResult[]): number {
    const successCorrelation = this.calculateCorrelation(
      results.map(r => r.metrics.get(metric) || 0),
      results.map(r => r.status === 'success' ? 1 : 0)
    );

    return Math.abs(successCorrelation);
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    const sum_x = x.reduce((a, b) => a + b, 0);
    const sum_y = y.reduce((a, b) => a + b, 0);
    const sum_xy = x.reduce((sum, _, i) => sum + x[i] * y[i], 0);
    const sum_xx = x.reduce((sum, val) => sum + val * val, 0);
    const sum_yy = y.reduce((sum, val) => sum + val * val, 0);

    const correlation = (n * sum_xy - sum_x * sum_y) /
      Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y));

    return correlation;
  }
}

interface ExperimentReport {
  experimentType: string;
  totalExperiments: number;
  successRate: number;
  averageConfidence: number;
  insights: string[];
  recommendations: string[];
  evidenceStrength: number;
  timeline: TimelineEvent[];
}

interface TimelineEvent {
  timestamp: Date;
  event: string;
  status: string;
  metrics: { [key: string]: number };
}

interface SuccessFactor {
  metric: string;
  threshold: number;
  confidence: number;
  importance: number;
}