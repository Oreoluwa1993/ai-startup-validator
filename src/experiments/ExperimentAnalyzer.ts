import { ValidationContext } from '../agents/types';

interface AnalysisResult {
  success: boolean;
  confidence: number;
  insights: string[];
  recommendations: string[];
  risks: Risk[];
  nextSteps: string[];
  evidenceStrength: number;
}

interface Risk {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  mitigation?: string;
}

export class ExperimentAnalyzer {
  private sequentialAnalyzer: any;
  private marketResearcher: any;
  private competitorAnalyzer: any;

  constructor() {
    this.initializeAnalyzers();
  }

  async analyzeExperiment(experiment: any, context: ValidationContext): Promise<AnalysisResult> {
    const analysisSteps = await this.performSequentialAnalysis(experiment, context);
    const metrics = await this.calculateMetrics(experiment);
    const insights = await this.generateInsights(experiment, metrics);
    
    return {
      success: this.determineSuccess(metrics, experiment.success_criteria),
      confidence: await this.calculateConfidence(experiment, metrics),
      insights: await this.enrichInsights(insights, context),
      recommendations: await this.generateRecommendations(experiment, metrics),
      risks: await this.identifyRisks(experiment, context),
      nextSteps: await this.determineNextSteps(experiment, metrics, context),
      evidenceStrength: await this.calculateEvidenceStrength(experiment)
    };
  }

  private async performSequentialAnalysis(experiment: any, context: ValidationContext) {
    return await this.sequentialAnalyzer.analyze({
      input: {
        experiment,
        context,
        thought: `Analyzing ${experiment.type} experiment results`,
        thoughtNumber: 1,
        totalThoughts: 5,
        nextThoughtNeeded: true
      }
    });
  }

  private async calculateSolutionInterviewMetrics(experiment: any, metrics: Map<string, number>): Promise<void> {
    metrics.set('solution_fit_score', this.calculateSolutionFitScore(experiment));
    metrics.set('intent_to_use', this.calculateIntentToUse(experiment));
    metrics.set('feature_relevance', this.calculateFeatureRelevance(experiment));
    metrics.set('price_sensitivity', this.calculatePriceSensitivity(experiment));
    metrics.set('early_adopter_enthusiasm', this.calculateEarlyAdopterEnthusiasm(experiment));
  }

  private calculateSolutionFitScore(experiment: any): number {
    const responses = experiment.responses || [];
    const fitScores = responses.map(response => {
      return this.evaluateResponseFit(response);
    });
    
    return fitScores.reduce((a, b) => a + b, 0) / (fitScores.length || 1);
  }

  private evaluateResponseFit(response: any): number {
    const factors = {
      problemValidation: 0.3,
      solutionAppeal: 0.3,
      implementationFeasibility: 0.2,
      willingness: 0.2
    };

    return (
      response.problemValidation * factors.problemValidation +
      response.solutionAppeal * factors.solutionAppeal +
      response.implementationFeasibility * factors.implementationFeasibility +
      response.willingness * factors.willingness
    );
  }

  private calculateIntentToUse(experiment: any): number {
    const responses = experiment.responses || [];
    const intents = responses.map(response => {
      return this.evaluateIntent(response);
    });
    
    return intents.reduce((a, b) => a + b, 0) / (intents.length || 1);
  }

  private evaluateIntent(response: any): number {
    const signals = {
      explicitIntent: response.intentScore || 0,
      impliedIntent: this.calculateImpliedIntent(response),
      behavioralIntent: this.calculateBehavioralIntent(response)
    };

    return (signals.explicitIntent * 0.4 + signals.impliedIntent * 0.3 + signals.behavioralIntent * 0.3);
  }

  private async generateInsights(experiment: any, metrics: Map<string, number>): Promise<string[]> {
    const insights: string[] = [];
    
    // Generate basic insights
    insights.push(...this.generateMetricInsights(metrics));
    insights.push(...this.generateResponseInsights(experiment));
    
    // Generate experiment-specific insights
    switch (experiment.type) {
      case 'problem_interview':
        insights.push(...await this.generateProblemInsights(experiment));
        break;
      case 'solution_interview':
        insights.push(...await this.generateSolutionInsights(experiment));
        break;
      case 'pricing_test':
        insights.push(...await this.generatePricingInsights(experiment));
        break;
    }

    return this.prioritizeInsights(insights);
  }

  private async generateSolutionInsights(experiment: any): Promise<string[]> {
    const insights: string[] = [];
    
    // Analyze feature feedback
    const featureFeedback = this.analyzeFeatureFeedback(experiment);
    insights.push(...this.generateFeatureInsights(featureFeedback));

    // Analyze usability feedback
    const usabilityFeedback = this.analyzeUsabilityFeedback(experiment);
    insights.push(...this.generateUsabilityInsights(usabilityFeedback));

    // Analyze pricing feedback
    const pricingFeedback = this.analyzePricingFeedback(experiment);
    insights.push(...this.generatePricingInsights(pricingFeedback));

    return insights;
  }

  private analyzeFeatureFeedback(experiment: any) {
    const responses = experiment.responses || [];
    return responses.reduce((feedback, response) => {
      response.featureFeedback?.forEach(feature => {
        if (!feedback[feature.name]) {
          feedback[feature.name] = {
            relevanceScore: 0,
            usabilityScore: 0,
            comments: []
          };
        }
        feedback[feature.name].relevanceScore += feature.relevance || 0;
        feedback[feature.name].usabilityScore += feature.usability || 0;
        if (feature.comment) feedback[feature.name].comments.push(feature.comment);
      });
      return feedback;
    }, {});
  }

  private generateFeatureInsights(featureFeedback: any): string[] {
    const insights: string[] = [];
    
    // Analyze most relevant features
    const relevantFeatures = Object.entries(featureFeedback)
      .sort(([,a]: any, [,b]: any) => b.relevanceScore - a.relevanceScore);
    
    insights.push(`Most relevant features: ${relevantFeatures.slice(0, 3).map(([name]) => name).join(', ')}`);

    // Analyze usability issues
    const usabilityIssues = Object.entries(featureFeedback)
      .filter(([,data]: any) => data.usabilityScore < 0.7);
    
    if (usabilityIssues.length > 0) {
      insights.push(`Features needing usability improvement: ${usabilityIssues.map(([name]) => name).join(', ')}`);
    }

    return insights;
  }

  private async enrichInsights(insights: string[], context: ValidationContext): Promise<string[]> {
    // Enrich with market context
    const marketData = await this.marketResearcher.analyze(context);
    
    // Enrich with competitor context
    const competitorData = await this.competitorAnalyzer.analyze(context);
    
    return insights.map(insight => this.enrichInsight(insight, marketData, competitorData));
  }

  private enrichInsight(insight: string, marketData: any, competitorData: any): string {
    // Add market context if relevant
    if (insight.includes('market') || insight.includes('customer')) {
      return `${insight} (Market size: $${marketData.size}B, Growth: ${marketData.growth}%)`;
    }
    
    // Add competitor context if relevant
    if (insight.includes('competitor') || insight.includes('feature')) {
      const relevantCompetitors = competitorData.competitors
        .filter(comp => comp.relevance > 0.7)
        .map(comp => comp.name)
        .join(', ');
      return `${insight} (Key competitors: ${relevantCompetitors})`;
    }
    
    return insight;
  }

  private async determineNextSteps(
    experiment: any,
    metrics: Map<string, number>,
    context: ValidationContext
  ): Promise<string[]> {
    const nextSteps: string[] = [];
    
    // Determine validation gaps
    const validationGaps = this.identifyValidationGaps(metrics);
    nextSteps.push(...this.generateValidationSteps(validationGaps));
    
    // Add experiment-specific next steps
    switch (experiment.type) {
      case 'problem_interview':
        nextSteps.push(...this.determineProblemNextSteps(experiment, metrics));
        break;
      case 'solution_interview':
        nextSteps.push(...this.determineSolutionNextSteps(experiment, metrics));
        break;
      case 'pricing_test':
        nextSteps.push(...this.determinePricingNextSteps(experiment, metrics));
        break;
    }

    return this.prioritizeNextSteps(nextSteps);
  }

  private identifyValidationGaps(metrics: Map<string, number>): string[] {
    const gaps: string[] = [];
    const thresholds = {
      confidence: 0.8,
      evidence_strength: 0.7,
      completion_rate: 0.9
    };

    if ((metrics.get('confidence') || 0) < thresholds.confidence) {
      gaps.push('confidence');
    }
    if ((metrics.get('evidence_strength') || 0) < thresholds.evidence_strength) {
      gaps.push('evidence');
    }
    if ((metrics.get('completion_rate') || 0) < thresholds.completion_rate) {
      gaps.push('completion');
    }

    return gaps;
  }

  private generateValidationSteps(gaps: string[]): string[] {
    return gaps.map(gap => {
      switch (gap) {
        case 'confidence':
          return 'Conduct additional interviews to increase confidence';
        case 'evidence':
          return 'Gather more quantitative data to strengthen evidence';
        case 'completion':
          return 'Review and optimize experiment process to improve completion rate';
        default:
          return '';
      }
    }).filter(Boolean);
  }

  private prioritizeNextSteps(steps: string[]): string[] {
    // Sort steps by impact and urgency
    return steps.sort((a, b) => {
      const aScore = this.calculateStepPriority(a);
      const bScore = this.calculateStepPriority(b);
      return bScore - aScore;
    });
  }

  private calculateStepPriority(step: string): number {
    const weights = {
      validation: 0.4,
      improvement: 0.3,
      exploration: 0.2,
      optimization: 0.1
    };

    if (step.includes('validation') || step.includes('verify')) {
      return weights.validation;
    }
    if (step.includes('improve') || step.includes('optimize')) {
      return weights.improvement;
    }
    if (step.includes('explore') || step.includes('investigate')) {
      return weights.exploration;
    }
    return weights.optimization;
  }
}
