import { ValidationContext } from '../agents/types';

interface ExperimentTemplate {
  id: string;
  name: string;
  stage: ValidationStage;
  type: ExperimentType;
  description: string;
  duration: number;
  hypothesis: string;
  successCriteria: SuccessCriteria[];
  setupInstructions: string[];
  metrics: MetricDefinition[];
  dataCollection: DataCollectionMethod[];
  analysis: AnalysisMethod[];
  references: Reference[];
}

interface SuccessCriteria {
  metric: string;
  target: number;
  minimum: number;
  unit: string;
}

interface MetricDefinition {
  name: string;
  description: string;
  type: 'quantitative' | 'qualitative';
  measurement: string;
  frequency: string;
}

interface DataCollectionMethod {
  type: string;
  source: string;
  tool: string;
  frequency: string;
}

interface AnalysisMethod {
  type: string;
  description: string;
  tool: string;
}

interface Reference {
  source: string;
  link: string;
  relevance: string;
}

type ValidationStage = 
  | 'problem_validation'
  | 'solution_validation'
  | 'market_validation'
  | 'business_model_validation'
  | 'growth_validation';

type ExperimentType =
  | 'customer_interview'
  | 'solution_interview'
  | 'landing_page'
  | 'wizard_of_oz'
  | 'concierge'
  | 'sales_pitch'
  | 'pricing_test'
  | 'channel_test';

export class ExperimentTemplateManager {
  private templates: Map<string, ExperimentTemplate>;

  constructor() {
    this.templates = new Map();
    this.initializeTemplates();
  }

  private initializeTemplates() {
    // Problem Validation Stage Templates
    this.addTemplate(this.createProblemInterviewTemplate());
    this.addTemplate(this.createValuePropositionTemplate());
    this.addTemplate(this.createEarlyAdopterTemplate());

    // Solution Validation Stage Templates
    this.addTemplate(this.createSolutionInterviewTemplate());
    this.addTemplate(this.createWizardOfOzTemplate());
    this.addTemplate(this.createConciergeTemplate());
    this.addTemplate(this.createMVPTemplate());

    // Market Validation Stage Templates
    this.addTemplate(this.createMarketSizeTemplate());
    this.addTemplate(this.createCompetitorAnalysisTemplate());
    this.addTemplate(this.createMarketPositioningTemplate());

    // Business Model Validation Stage Templates
    this.addTemplate(this.createPricingTemplate());
    this.addTemplate(this.createChannelTemplate());
    this.addTemplate(this.createRevenueModelTemplate());

    // Growth Validation Stage Templates
    this.addTemplate(this.createGrowthHackingTemplate());
    this.addTemplate(this.createChannelOptimizationTemplate());
    this.addTemplate(this.createReferralProgramTemplate());
  }

  private createProblemInterviewTemplate(): ExperimentTemplate {
    return {
      id: 'problem_interview_01',
      name: 'Problem Interview (MOM Test)',
      stage: 'problem_validation',
      type: 'customer_interview',
      description: 'Validate problem existence and significance through customer interviews',
      duration: 14, // days
      hypothesis: 'Target customers experience [problem] and are actively seeking solutions',
      successCriteria: [
        {
          metric: 'problem_confirmation_rate',
          target: 80,
          minimum: 60,
          unit: 'percentage'
        },
        {
          metric: 'active_solution_seeking',
          target: 60,
          minimum: 40,
          unit: 'percentage'
        }
      ],
      setupInstructions: [
        'Identify target customer segment',
        'Create interview script following MOM Test methodology',
        'Recruit 10-15 potential customers',
        'Prepare recording and note-taking system',
        'Set up feedback analysis framework'
      ],
      metrics: [
        {
          name: 'Problem Confirmation Rate',
          description: 'Percentage of interviewees who confirm problem exists',
          type: 'quantitative',
          measurement: 'Binary (Yes/No)',
          frequency: 'Per interview'
        },
        {
          name: 'Problem Severity',
          description: 'Rated severity of the problem',
          type: 'quantitative',
          measurement: '1-5 scale',
          frequency: 'Per interview'
        }
      ],
      dataCollection: [
        {
          type: 'Interview Notes',
          source: 'Customer Interviews',
          tool: 'Note-taking template',
          frequency: 'Per interview'
        },
        {
          type: 'Recording',
          source: 'Customer Interviews',
          tool: 'Recording software',
          frequency: 'Per interview'
        }
      ],
      analysis: [
        {
          type: 'Qualitative Analysis',
          description: 'Thematic analysis of interview responses',
          tool: 'Qualitative analysis framework'
        },
        {
          type: 'Quantitative Analysis',
          description: 'Statistical analysis of problem metrics',
          tool: 'Statistical analysis software'
        }
      ],
      references: [
        {
          source: 'The Mom Test',
          link: 'http://momtestbook.com/',
          relevance: 'Interview methodology'
        }
      ]
    };
  }

  // Continue with other template definitions...
  private createSolutionInterviewTemplate(): ExperimentTemplate {
    return {
      id: 'solution_interview_01',
      name: 'Solution Interview',
      stage: 'solution_validation',
      type: 'solution_interview',
      description: 'Validate solution fit and value proposition',
      duration: 21,
      hypothesis: 'Our solution effectively addresses the validated problem',
      successCriteria: [
        {
          metric: 'solution_fit_score',
          target: 80,
          minimum: 60,
          unit: 'percentage'
        },
        {
          metric: 'would_use_score',
          target: 70,
          minimum: 50,
          unit: 'percentage'
        }
      ],
      setupInstructions: [
        'Prepare solution prototype or mockup',
        'Create demonstration script',
        'Recruit participants from problem interviews',
        'Set up feedback collection system',
        'Prepare pricing scenarios'
      ],
      metrics: [
        {
          name: 'Solution Fit Score',
          description: 'How well solution matches problem',
          type: 'quantitative',
          measurement: '1-5 scale',
          frequency: 'Per interview'
        },
        {
          name: 'Usage Intent',
          description: 'Likelihood to use solution',
          type: 'quantitative',
          measurement: '1-5 scale',
          frequency: 'Per interview'
        }
      ],
      dataCollection: [
        {
          type: 'Interview Notes',
          source: 'Solution Interviews',
          tool: 'Note-taking template',
          frequency: 'Per interview'
        },
        {
          type: 'Usage Observation',
          source: 'Solution Demo',
          tool: 'Observation template',
          frequency: 'Per demo'
        }
      ],
      analysis: [
        {
          type: 'Feature Analysis',
          description: 'Analysis of feature importance and usage',
          tool: 'Feature analysis framework'
        },
        {
          type: 'Value Proposition Analysis',
          description: 'Analysis of value proposition effectiveness',
          tool: 'Value proposition canvas'
        }
      ],
      references: [
        {
          source: 'Value Proposition Design',
          link: 'https://www.strategyzer.com/books/value-proposition-design',
          relevance: 'Solution validation methodology'
        }
      ]
    };
  }

  // Add methods to work with templates
  getTemplate(id: string): ExperimentTemplate | undefined {
    return this.templates.get(id);
  }

  getTemplatesForStage(stage: ValidationStage): ExperimentTemplate[] {
    return Array.from(this.templates.values())
      .filter(template => template.stage === stage);
  }

  customizeTemplate(
    templateId: string,
    customization: Partial<ExperimentTemplate>
  ): ExperimentTemplate {
    const baseTemplate = this.getTemplate(templateId);
    if (!baseTemplate) {
      throw new Error(`Template not found: ${templateId}`);
    }

    return {
      ...baseTemplate,
      ...customization,
      id: `${templateId}_custom_${Date.now()}`
    };
  }

  private addTemplate(template: ExperimentTemplate) {
    this.templates.set(template.id, template);
  }
}
