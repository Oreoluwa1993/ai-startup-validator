import { ValidationContext } from '../agents/types';

interface TrainingConfig {
  batchSize: number;
  epochs: number;
  learningRate: number;
  validationSplit: number;
}

interface ModelMetrics {
  accuracy: number;
  loss: number;
  validationAccuracy: number;
  validationLoss: number;
}

export class ModelTrainer {
  private config: TrainingConfig;
  private modelState: Map<string, any> = new Map();
  private trainingHistory: ModelMetrics[] = [];

  constructor(config?: Partial<TrainingConfig>) {
    this.config = {
      batchSize: config?.batchSize || 32,
      epochs: config?.epochs || 100,
      learningRate: config?.learningRate || 0.001,
      validationSplit: config?.validationSplit || 0.2
    };
  }

  async trainModel(trainingData: any[], context: ValidationContext): Promise<ModelMetrics> {
    const processedData = this.preprocessData(trainingData);
    const { trainSet, validationSet } = this.splitData(processedData);
    
    const metrics = await this.runTraining(trainSet, validationSet);
    this.updateTrainingHistory(metrics);

    return metrics;
  }

  private preprocessData(data: any[]) {
    return data.map(item => ({
      features: this.extractFeatures(item),
      labels: this.extractLabels(item)
    }));
  }

  private extractFeatures(item: any) {
    return {
      numericalFeatures: this.extractNumericalFeatures(item),
      categoricalFeatures: this.encodeCategoricalFeatures(item),
      textFeatures: this.processTextFeatures(item)
    };
  }

  private extractNumericalFeatures(item: any) {
    const features = [
      item.marketSize,
      item.revenue,
      item.growth,
      item.customerCount,
      item.engagementRate
    ].filter(val => typeof val === 'number');

    return this.normalizeNumericalFeatures(features);
  }

  private normalizeNumericalFeatures(features: number[]) {
    const mean = features.reduce((a, b) => a + b, 0) / features.length;
    const std = Math.sqrt(
      features.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / features.length
    );

    return features.map(f => (f - mean) / (std || 1));
  }

  private encodeCategoricalFeatures(item: any) {
    const categoricalFeatures = {
      industry: this.oneHotEncode(item.industry, this.getIndustryCategories()),
      stage: this.oneHotEncode(item.stage, this.getStageCategories()),
      location: this.oneHotEncode(item.location, this.getLocationCategories())
    };

    return Object.values(categoricalFeatures).flat();
  }

  private oneHotEncode(value: string, categories: string[]): number[] {
    return categories.map(cat => cat === value ? 1 : 0);
  }

  private processTextFeatures(item: any) {
    const textFeatures = [
      item.description,
      item.valueProposition,
      item.targetMarket
    ].filter(Boolean);

    return this.embedText(textFeatures.join(' '));
  }

  private embedText(text: string): number[] {
    // Implement text embedding logic here
    // For now, return a simple bag-of-words representation
    const words = text.toLowerCase().split(/\W+/);
    const vocabulary = this.getVocabulary();
    return vocabulary.map(word => words.filter(w => w === word).length);
  }

  private extractLabels(item: any) {
    return {
      success: item.success ? 1 : 0,
      revenue: this.normalizeValue(item.revenue),
      growth: this.normalizeValue(item.growth),
      retention: this.normalizeValue(item.retention)
    };
  }

  private normalizeValue(value: number): number {
    // Implement min-max normalization
    return (value - 0) / (1000000 - 0); // Example range
  }

  private splitData(data: any[]) {
    const validationSize = Math.floor(data.length * this.config.validationSplit);
    const validationSet = data.slice(0, validationSize);
    const trainSet = data.slice(validationSize);
    
    return { trainSet, validationSet };
  }

  private async runTraining(trainSet: any[], validationSet: any[]): Promise<ModelMetrics> {
    let currentMetrics: ModelMetrics = {
      accuracy: 0,
      loss: Infinity,
      validationAccuracy: 0,
      validationLoss: Infinity
    };

    for (let epoch = 0; epoch < this.config.epochs; epoch++) {
      const batchMetrics = await this.trainEpoch(trainSet);
      const validationMetrics = await this.validate(validationSet);

      currentMetrics = {
        accuracy: batchMetrics.accuracy,
        loss: batchMetrics.loss,
        validationAccuracy: validationMetrics.accuracy,
        validationLoss: validationMetrics.loss
      };

      if (this.shouldStopEarly(currentMetrics)) {
        break;
      }
    }

    return currentMetrics;
  }

  private async trainEpoch(trainSet: any[]): Promise<{ accuracy: number; loss: number }> {
    const batches = this.createBatches(trainSet, this.config.batchSize);
    let epochLoss = 0;
    let epochAccuracy = 0;

    for (const batch of batches) {
      const { loss, accuracy } = await this.trainBatch(batch);
      epochLoss += loss;
      epochAccuracy += accuracy;
    }

    return {
      accuracy: epochAccuracy / batches.length,
      loss: epochLoss / batches.length
    };
  }

  private createBatches(data: any[], batchSize: number) {
    const batches = [];
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }
    return batches;
  }

  private async trainBatch(batch: any[]): Promise<{ loss: number; accuracy: number }> {
    // Implement batch training logic
    return {
      loss: Math.random(),
      accuracy: Math.random()
    };
  }

  private async validate(validationSet: any[]): Promise<{ accuracy: number; loss: number }> {
    // Implement validation logic
    return {
      accuracy: Math.random(),
      loss: Math.random()
    };
  }

  private shouldStopEarly(metrics: ModelMetrics): boolean {
    const minHistory = 5;
    if (this.trainingHistory.length < minHistory) {
      return false;
    }

    const recentLosses = this.trainingHistory
      .slice(-minHistory)
      .map(m => m.validationLoss);
    
    const isIncreasing = recentLosses.every((loss, i) => 
      i === 0 || loss >= recentLosses[i - 1]
    );

    return isIncreasing;
  }

  private updateTrainingHistory(metrics: ModelMetrics) {
    this.trainingHistory.push(metrics);
    if (this.trainingHistory.length > 100) {
      this.trainingHistory.shift();
    }
  }

  private getIndustryCategories(): string[] {
    return [
      'software',
      'healthcare',
      'fintech',
      'ecommerce',
      'enterprise',
      'consumer'
    ];
  }

  private getStageCategories(): string[] {
    return [
      'seed',
      'early',
      'growth',
      'expansion',
      'late'
    ];
  }

  private getLocationCategories(): string[] {
    return [
      'northAmerica',
      'europe',
      'asia',
      'latinAmerica',
      'africa',
      'oceania'
    ];
  }

  private getVocabulary(): string[] {
    // Return common business/startup vocabulary
    return [
      'innovation',
      'growth',
      'market',
      'customer',
      'solution',
      'technology',
      'platform',
      'service',
      'product',
      'scale'
    ];
  }
}