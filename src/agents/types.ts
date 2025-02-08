export interface Agent {
    analyze(input: any, context: any): Promise<any>;
    provideSupportingAnalysis(primaryAnalysis: any): Promise<any>;
}

export interface ValidationContext {
    industry: string;
    location: string;
    investmentType: string;
    stage: string;
    metrics: ValidationMetrics;
}

export interface ValidationMetrics {
    ideaStrength: number;
    marketFit: number;
    executionCapability: number;
    competitiveAdvantage: number;
    financialViability: number;
}