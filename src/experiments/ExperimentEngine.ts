import { ValidationContext } from '../agents/types';

interface Experiment {
  id: string;
  name: string;
  type: ExperimentType;
  hypothesis: string;
  success_criteria: SuccessCriteria[];
  duration: number;
  cost: number;
  risk_level: 'low' | 'medium' | 'high';
  required_resources: string[];
  status: ExperimentStatus;
  results?: ExperimentResults;
}

type ExperimentType = 
  | 'problem_interview'
  | 'solution_interview'
  | 'landing_page'
  | 'smoke_test'
  | 'pricing_test'
  | 'usability_test'
  | 'channel_test'
  | 'marketing_test'
  | 'prototype_test';

interface SuccessCriteria {
  metric: string;
  target: number;
  actual?: number;
  unit: string;
}

type ExperimentStatus = 
  | 'planned'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'cancelled';

interface ExperimentResults {
  metrics: Map<string, number>;
  insights: string[];
  learnings: string[];
  next_steps: string[];
  evidence_strength: number;
}

export class ExperimentEngine {
  private experiments: Map<string, Experiment>;
  private templates: Map<string, Experiment>;
  private resultsTracker: ResultsTracker;
  private experimentAnalyzer: ExperimentAnalyzer;

  constructor() {
    this.experiments = new Map();
    this.templates = new Map();
    this.resultsTracker = new ResultsTracker();
    this.experimentAnalyzer = new ExperimentAnalyzer();
    this.initializeTemplates();
  }

  private initializeTemplates() {
    // Problem Interview Template (MOM Test)
    this.templates.set('problem_interview', {
      id: 'template_problem_interview',
      name: 'Problem Interview',
      type: 'problem_interview',
      hypothesis: 'Target customers experience [problem] and are actively seeking solutions',
      success_criteria: [
        {
          metric: 'problem_confirmation_rate',
          target: 80,
          unit: 'percentage'
        },
        {
          metric: 'active_solution_seeking',
          target: 60,
          unit: 'percentage'
        }
      ],
      duration: 14, // days
      cost: 500,
      risk_level: 'low',
      required_resources: ['interviewer', 'interview_guide', 'recording_tool'],
      status: 'planned'
    });

    // Solution Interview Template
    this.templates.set('solution_interview', {
      id: 'template_solution_interview',
      name: 'Solution Interview',
      type: 'solution_interview',
      hypothesis: 'Our solution effectively addresses the validated problem',
      success_criteria: [
        {
          metric: 'solution_fit_score',
          target: 70,
          unit: 'percentage'
        },
        {
          metric: 'would_use_score',
          target: 60,
          unit: 'percentage'
        }
      ],
      duration: 21,
      cost: 1000,
      risk_level: 'medium',
      required_resources: ['prototype', 'interviewer', 'feedback_form'],
      status: 'planned'
    });

    // Add more templates...
  }

  async createExperiment(type: ExperimentType, context: ValidationContext): Promise<Experiment> {
    const template = this.templates.get(type);
    if (!template) {
      throw new Error(`No template found for experiment type: ${type}`);
    }

    const experiment: Experiment = {
      ...template,
      id: this.generateExperimentId(),
      hypothesis: this.customizeHypothesis(template.hypothesis, context),
      success_criteria: this.adjustSuccessCriteria(template.success_criteria, context),
      status: 'planned'
    };

    this.experiments.set(experiment.id, experiment);
    return experiment;
  }

  async runExperiment(experimentId: string): Promise<ExperimentResults> {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      throw new Error(`Experiment not found: ${experimentId}`);
    }

    experiment.status = 'in_progress';
    
    // Simulate experiment execution
    const results = await this.simulateExperimentExecution(experiment);
    
    experiment.results = results;
    experiment.status = this.determineExperimentStatus(results, experiment.success_criteria);

    await this.resultsTracker.trackResults(experiment);
    return results;
  }

  async analyzeResults(experimentId: string): Promise<any> {
    const experiment = this.experiments.get(experimentId);
    if (!experiment || !experiment.results) {
      throw new Error(`No results found for experiment: ${experimentId}`);
    }

    return {
      success: this.experimentAnalyzer.determineSuccess(experiment),
      insights: this.experimentAnalyzer.generateInsights(experiment),
      recommendations: this.experimentAnalyzer.generateRecommendations(experiment),
      confidence: this.experimentAnalyzer.calculateConfidence(experiment)
    };
  }

  getRecommendedExperiments(context: ValidationContext): ExperimentType[] {
    return Array.from(this.templates.keys())
      .filter(type => this.isExperimentRelevant(type as ExperimentType, context))
      .map(type => type as ExperimentType);
  }

  private generateExperimentId(): string {
    return `exp_${Math.random().toString(36).substr(2, 9)}`;
  }

  private customizeHypothesis(baseHypothesis: string, context: ValidationContext): string {
    // Implement hypothesis customization based on context
    return baseHypothesis.replace('[problem]', context.problem || 'the identified problem');
  }

  private adjustSuccessCriteria(
    criteria: SuccessCriteria[],
    context: ValidationContext
  ): SuccessCriteria[] {
    // Adjust success criteria based on context
    return criteria.map(criterion => ({
      ...criterion,
      target: this.adjustTarget(criterion.target, context)
    }));
  }

  private adjustTarget(baseTarget: number, context: ValidationContext): number {
    // Implement target adjustment logic based on context
    return baseTarget;
  }

  private async simulateExperimentExecution(experiment: Experiment): Promise<ExperimentResults> {
    // In real implementation, this would integrate with actual experiment data collection
    return {
      metrics: new Map([
        ['response_rate', 75],
        ['success_rate', 65]
      ]),
      insights: ['Key insight 1', 'Key insight 2'],
      learnings: ['Learning 1', 'Learning 2'],
      next_steps: ['Next step 1', 'Next step 2'],
      evidence_strength: 0.8
    };
  }

  private determineExperimentStatus(
    results: ExperimentResults,
    criteria: SuccessCriteria[]
  ): ExperimentStatus {
    const successThreshold = 0.8; // 80% of criteria must be met
    let metCriteria = 0;

    criteria.forEach(criterion => {
      const actualValue = results.metrics.get(criterion.metric);
      if (actualValue && actualValue >= criterion.target) {
        metCriteria++;
      }
    });

    const successRate = metCriteria / criteria.length;
    return successRate >= successThreshold ? 'completed' : 'failed';
  }

  private isExperimentRelevant(type: ExperimentType, context: ValidationContext): boolean {
    // Implement relevance checking logic based on context and stage
    return true;
  }
}