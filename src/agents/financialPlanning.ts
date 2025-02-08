import { Agent, ValidationContext } from './types';

interface FinancialProjection {
    revenue: number[];
    costs: number[];
    margins: number[];
    cashflow: number[];
    timeframe: string;
    assumptions: string[];
}

interface FundingRequirement {
    amount: number;
    timing: string;
    purpose: string;
    type: 'equity' | 'debt' | 'grant';
    terms?: any;
}

interface ValuationScenario {
    method: string;
    value: number;
    assumptions: string[];
    sensitivityFactors: any[];
}

export class FinancialPlanningAgent implements Agent {
    private revenueModeler: RevenueModeler;
    private costAnalyzer: CostAnalyzer;
    private valuationEngine: ValuationEngine;
    private fundingAdvisor: FundingAdvisor;

    constructor() {
        this.revenueModeler = new RevenueModeler();
        this.costAnalyzer = new CostAnalyzer();
        this.valuationEngine = new ValuationEngine();
        this.fundingAdvisor = new FundingAdvisor();
    }

    async analyze(input: any, context: ValidationContext) {
        const revenueModel = await this.analyzeRevenueModel(input, context);
        const costStructure = await this.analyzeCostStructure(input);
        const fundingNeeds = await this.analyzeFundingRequirements(revenueModel, costStructure);
        const valuation = await this.calculateValuation(input, context);

        return {
            financialProjections: await this.createFinancialProjections(revenueModel, costStructure),
            fundingStrategy: await this.developFundingStrategy(fundingNeeds, context),
            valuation: valuation,
            metrics: await this.calculateKeyMetrics(revenueModel, costStructure),
            risks: this.identifyFinancialRisks(revenueModel, costStructure)
        };
    }

    async provideSupportingAnalysis(primaryAnalysis: any) {
        return {
            sensitivityAnalysis: await this.performSensitivityAnalysis(primaryAnalysis),
            scenarioAnalysis: await this.performScenarioAnalysis(primaryAnalysis),
            benchmarkComparison: await this.compareToBenchmarks(primaryAnalysis),
            recommendations: await this.generateFinancialRecommendations(primaryAnalysis)
        };
    }

    private async analyzeRevenueModel(input: any, context: ValidationContext) {
        const revenueStreams = await this.revenueModeler.identifyStreams(input);
        const marketSize = this.extractMarketSize(context);
        const penetrationRate = this.calculatePenetrationRate(input, marketSize);

        return {
            streams: revenueStreams.map(stream => ({
                name: stream.name,
                model: stream.model,
                projections: this.projectStreamRevenue(stream, penetrationRate),
                drivers: this.identifyRevenueDrivers(stream),
                risks: this.assessRevenueRisks(stream)
            })),
            totalRevenue: this.aggregateRevenue(revenueStreams),
            growthRate: this.calculateGrowthRate(revenueStreams),
            assumptions: this.documentRevenueAssumptions(revenueStreams)
        };
    }

    private async analyzeCostStructure(input: any) {
        const fixedCosts = await this.costAnalyzer.analyzeFixedCosts(input);
        const variableCosts = await this.costAnalyzer.analyzeVariableCosts(input);
        const operationalCosts = await this.costAnalyzer.analyzeOperationalCosts(input);

        return {
            fixedCosts: this.categorizeCosts(fixedCosts),
            variableCosts: this.categorizeCosts(variableCosts),
            operationalCosts: this.categorizeCosts(operationalCosts),
            costOptimization: this.identifyCostOptimizations(fixedCosts, variableCosts),
            scalingFactors: this.analyzeCostScaling(input)
        };
    }

    private async analyzeFundingRequirements(
        revenueModel: any,
        costStructure: any
    ): Promise<FundingRequirement[]> {
        const burnRate = this.calculateBurnRate(costStructure);
        const breakeven = this.calculateBreakeven(revenueModel, costStructure);
        const runwayNeeded = this.calculateRunwayNeeded(burnRate, breakeven);

        return this.fundingAdvisor.recommendFunding({
            burnRate,
            breakeven,
            runwayNeeded,
            milestones: this.extractMilestones(revenueModel)
        });
    }

    private async calculateValuation(input: any, context: ValidationContext): Promise<ValuationScenario[]> {
        const methods = ['DCF', 'Comparable', 'Precedent', 'VC Method'];
        const scenarios = await Promise.all(
            methods.map(method => this.valuationEngine.calculateValuation(method, input, context))
        );

        return scenarios.map(scenario => ({
            ...scenario,
            sensitivityFactors: this.identifyValuationSensitivities(scenario),
            risks: this.assessValuationRisks(scenario)
        }));
    }

    private async createFinancialProjections(
        revenueModel: any,
        costStructure: any
    ): Promise<FinancialProjection> {
        const timeframes = ['monthly', 'quarterly', 'annual'];
        const projections = timeframes.map(timeframe => ({
            timeframe,
            revenue: this.projectRevenue(revenueModel, timeframe),
            costs: this.projectCosts(costStructure, timeframe),
            margins: this.calculateMargins(revenueModel, costStructure, timeframe),
            cashflow: this.projectCashflow(revenueModel, costStructure, timeframe)
        }));

        return {
            ...projections[0], // Default to monthly
            scenarios: {
                base: projections,
                optimistic: this.createOptimisticScenario(projections),
                conservative: this.createConservativeScenario(projections)
            }
        };
    }

    private async performSensitivityAnalysis(analysis: any) {
        const factors = [
            'customerAcquisitionCost',
            'churnRate',
            'pricingModel',
            'marketPenetration'
        ];

        return factors.map(factor => ({
            factor,
            impact: this.calculateFactorImpact(analysis, factor),
            threshold: this.determineBreakEvenPoint(analysis, factor),
            recommendations: this.generateFactorRecommendations(analysis, factor)
        }));
    }

    private async performScenarioAnalysis(analysis: any) {
        const scenarios = ['best', 'base', 'worst'];
        return scenarios.map(scenario => ({
            scenario,
            projections: this.generateScenarioProjections(analysis, scenario),
            probability: this.calculateScenarioProbability(analysis, scenario),
            triggers: this.identifyScenarioTriggers(analysis, scenario)
        }));
    }

    // Helper methods
    private calculateBurnRate(costStructure: any): number {
        const monthlyCosts = this.aggregateMonthlyCosts(costStructure);
        const monthlyRevenue = this.calculateMonthlyRevenue(costStructure);
        return monthlyCosts - monthlyRevenue;
    }

    private calculateBreakeven(revenueModel: any, costStructure: any): any {
        const fixedCosts = this.aggregateFixedCosts(costStructure);
        const variableCosts = this.calculateVariableCostsPerUnit(costStructure);
        const pricePerUnit = this.calculateAveragePricePerUnit(revenueModel);

        return {
            units: fixedCosts / (pricePerUnit - variableCosts),
            revenue: fixedCosts / (1 - variableCosts / pricePerUnit),
            timeline: this.estimateBreakevenTimeline(revenueModel, costStructure)
        };
    }

    private calculateRunwayNeeded(burnRate: number, breakeven: any): number {
        const monthsToBreakeven = breakeven.timeline;
        const buffer = 6; // 6 months buffer
        return burnRate * (monthsToBreakeven + buffer);
    }

    private aggregateMonthlyCosts(costStructure: any): number {
        // Implementation
        return 50000;
    }

    private calculateMonthlyRevenue(costStructure: any): number {
        // Implementation
        return 30000;
    }

    private aggregateFixedCosts(costStructure: any): number {
        // Implementation
        return 100000;
    }

    private calculateVariableCostsPerUnit(costStructure: any): number {
        // Implementation
        return 50;
    }

    private calculateAveragePricePerUnit(revenueModel: any): number {
        // Implementation
        return 100;
    }

    private estimateBreakevenTimeline(revenueModel: any, costStructure: any): number {
        // Implementation
        return 18;
    }
}