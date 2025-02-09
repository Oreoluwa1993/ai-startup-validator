import { Agent, ValidationContext } from './types';

interface BusinessModel {
  valueProposition: ValueProposition;
  customerSegments: CustomerSegment[];
  channels: Channel[];
  customerRelationships: CustomerRelationship[];
  revenueStreams: RevenueStream[];
  keyResources: KeyResource[];
  keyActivities: KeyActivity[];
  keyPartnerships: KeyPartnership[];
  costStructure: CostStructure;
}

interface BusinessModelValidation {
  score: number;
  validatedAssumptions: string[];
  invalidatedAssumptions: string[];
  risksIdentified: Risk[];
  opportunities: string[];
  recommendations: string[];
}

interface ValidationStep {
  component: string;
  assumptions: string[];
  validationMethod: string;
  evidence: any[];
  confidence: number;
}

export class BusinessModelValidator {
  async validateBusinessModel(businessModel: BusinessModel, context: ValidationContext): Promise<BusinessModelValidation> {
    // Use sequential thinking for validation process
    const validationSteps = await this.sequentialThinking.analyze({
      thought: 'Validating business model components and assumptions',
      nextThoughtNeeded: true,
      thoughtNumber: 1,
      totalThoughts: 5
    });

    // Validate each component
    const validationResults = await Promise.all([
      this.validateValueProposition(businessModel.valueProposition, context),
      this.validateCustomerSegments(businessModel.customerSegments, context),
      this.validateChannels(businessModel.channels, context),
      this.validateRevenueModel(businessModel.revenueStreams, context),
      this.validateCostStructure(businessModel.costStructure, context)
    ]);

    // Aggregate validation results
    return this.aggregateValidationResults(validationResults);
  }

  private async validateValueProposition(vp: ValueProposition, context: ValidationContext): Promise<ValidationStep> {
    const assumptions = [
      'Problem exists and is significant',
      'Solution effectively addresses the problem',
      'Value proposition is unique in the market',
      'Customers willing to pay for solution'
    ];

    const evidence = await this.gatherEvidence('value_proposition', assumptions, context);
    
    return {
      component: 'value_proposition',
      assumptions,
      validationMethod: 'customer_interviews',
      evidence,
      confidence: this.calculateConfidence(evidence)
    };
  }

  private async validateCustomerSegments(segments: CustomerSegment[], context: ValidationContext): Promise<ValidationStep> {
    const assumptions = [
      'Segment size is sufficient',
      'Segment is accessible',
      'Segment has urgent need',
      'Segment has buying power'
    ];

    const evidence = await this.gatherEvidence('customer_segments', assumptions, context);
    
    return {
      component: 'customer_segments',
      assumptions,
      validationMethod: 'market_research',
      evidence,
      confidence: this.calculateConfidence(evidence)
    };
  }

  private async validateChannels(channels: Channel[], context: ValidationContext): Promise<ValidationStep> {
    const assumptions = [
      'Channels reach target customers',
      'Channels are cost-effective',
      'Channels are scalable',
      'Channel operations are feasible'
    ];

    const evidence = await this.gatherEvidence('channels', assumptions, context);
    
    return {
      component: 'channels',
      assumptions,
      validationMethod: 'channel_testing',
      evidence,
      confidence: this.calculateConfidence(evidence)
    };
  }

  private async validateRevenueModel(streams: RevenueStream[], context: ValidationContext): Promise<ValidationStep> {
    const assumptions = [
      'Pricing model is acceptable to customers',
      'Revenue streams are sustainable',
      'Unit economics are viable',
      'Growth model is scalable'
    ];

    const evidence = await this.gatherEvidence('revenue_model', assumptions, context);
    
    return {
      component: 'revenue_model',
      assumptions,
      validationMethod: 'financial_analysis',
      evidence,
      confidence: this.calculateConfidence(evidence)
    };
  }

  private async validateCostStructure(costs: CostStructure, context: ValidationContext): Promise<ValidationStep> {
    const assumptions = [
      'Cost structure is realistic',
      'Margins are sustainable',
      'Fixed costs are manageable',
      'Variable costs are optimized'
    ];

    const evidence = await this.gatherEvidence('cost_structure', assumptions, context);
    
    return {
      component: 'cost_structure',
      assumptions,
      validationMethod: 'cost_analysis',
      evidence,
      confidence: this.calculateConfidence(evidence)
    };
  }

  private async gatherEvidence(component: string, assumptions: string[], context: ValidationContext): Promise<any[]> {
    // Use market research MCP
    const marketData = await this.marketResearch.analyze({
      component,
      assumptions,
      context
    });

    // Use competitor analysis MCP
    const competitorData = await this.competitorAnalysis.analyze({
      component,
      assumptions,
      context
    });

    // Use sequential thinking for evidence analysis
    const evidenceAnalysis = await this.sequentialThinking.analyze({
      thought: `Analyzing evidence for ${component}`,
      nextThoughtNeeded: true,
      thoughtNumber: 1,
      totalThoughts: 3
    });

    return this.processEvidence(marketData, competitorData, evidenceAnalysis);
  }

  private calculateConfidence(evidence: any[]): number {
    if (!evidence.length) return 0;

    const weights = {
      marketData: 0.3,
      competitorData: 0.3,
      customerFeedback: 0.4
    };

    return evidence.reduce((confidence, item) => {
      return confidence + (item.confidence * weights[item.type]);
    }, 0) / evidence.length;
  }

  private aggregateValidationResults(results: ValidationStep[]): BusinessModelValidation {
    const validatedAssumptions: string[] = [];
    const invalidatedAssumptions: string[] = [];
    const risks: Risk[] = [];
    const opportunities: string[] = [];

    results.forEach(result => {
      this.categorizeAssumptions(result, validatedAssumptions, invalidatedAssumptions);
      this.identifyRisks(result, risks);
      this.identifyOpportunities(result, opportunities);
    });

    return {
      score: this.calculateOverallScore(results),
      validatedAssumptions,
      invalidatedAssumptions,
      risksIdentified: risks,
      opportunities,
      recommendations: this.generateRecommendations(results)
    };
  }

  private categorizeAssumptions(
    result: ValidationStep,
    validated: string[],
    invalidated: string[]
  ): void {
    result.assumptions.forEach(assumption => {
      const evidence = result.evidence.filter(e => e.assumption === assumption);
      const confidenceThreshold = 0.7;

      const assumptionConfidence = evidence.reduce((sum, e) => sum + e.confidence, 0) / evidence.length;

      if (assumptionConfidence >= confidenceThreshold) {
        validated.push(assumption);
      } else {
        invalidated.push(assumption);
      }
    });
  }

  private identifyRisks(result: ValidationStep, risks: Risk[]): void {
    result.evidence
      .filter(e => e.confidence < 0.5)
      .forEach(evidence => {
        risks.push({
          component: result.component,
          description: `Low confidence in ${evidence.assumption}`,
          severity: this.calculateRiskSeverity(evidence),
          mitigation: this.suggestMitigation(evidence)
        });
      });
  }

  private identifyOpportunities(result: ValidationStep, opportunities: string[]): void {
    result.evidence
      .filter(e => e.confidence > 0.8)
      .forEach(evidence => {
        opportunities.push(
          `Strong validation of ${evidence.assumption} suggests opportunity for ${result.component}`
        );
      });
  }

  private calculateOverallScore(results: ValidationStep[]): number {
    const weights = {
      value_proposition: 0.25,
      customer_segments: 0.2,
      channels: 0.15,
      revenue_model: 0.2,
      cost_structure: 0.2
    };

    return results.reduce((score, result) => {
      return score + (result.confidence * weights[result.component]);
    }, 0);
  }

  private generateRecommendations(results: ValidationStep[]): string[] {
    return results
      .filter(result => result.confidence < 0.7)
      .map(result => `Further validate ${result.component} through ${result.validationMethod}`);
  }

  private calculateRiskSeverity(evidence: any): 'low' | 'medium' | 'high' {
    if (evidence.confidence < 0.3) return 'high';
    if (evidence.confidence < 0.5) return 'medium';
    return 'low';
  }

  private suggestMitigation(evidence: any): string {
    // Implementation
    return `Conduct additional ${evidence.validationMethod} to increase confidence`;
  }
}