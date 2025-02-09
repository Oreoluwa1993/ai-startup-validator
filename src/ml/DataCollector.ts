import { ValidationContext } from '../agents/types';

interface CollectedData {
  id: string;
  type: 'startup' | 'market' | 'competitor' | 'funding';
  source: string;
  timestamp: Date;
  data: any;
  validity: number;
}

interface DataSource {
  name: string;
  type: string;
  endpoint?: string;
  credentials?: any;
  rateLimit?: number;
}

export class DataCollector {
  private collectedData: Map<string, CollectedData[]> = new Map();
  private dataSources: DataSource[] = [];
  private validityThreshold = 0.7;

  constructor() {
    this.initializeDataSources();
  }

  private initializeDataSources() {
    this.dataSources = [
      {
        name: 'startupDB',
        type: 'startup',
        endpoint: 'api/startup-data'
      },
      {
        name: 'marketIntel',
        type: 'market',
        endpoint: 'api/market-data'
      },
      {
        name: 'fundingDB',
        type: 'funding',
        endpoint: 'api/funding-data'
      },
      {
        name: 'competitorTracker',
        type: 'competitor',
        endpoint: 'api/competitor-data'
      }
    ];
  }

  async collectData(context: ValidationContext): Promise<void> {
    const tasks = this.dataSources.map(source => this.collectFromSource(source, context));
    const results = await Promise.allSettled(tasks);

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const source = this.dataSources[index];
        this.storeData(source.type, result.value);
      } else {
        console.error(`Failed to collect data from ${this.dataSources[index].name}:`, result.reason);
      }
    });
  }

  private async collectFromSource(source: DataSource, context: ValidationContext): Promise<any> {
    switch (source.type) {
      case 'startup':
        return await this.collectStartupData(context);
      case 'market':
        return await this.collectMarketData(context);
      case 'competitor':
        return await this.collectCompetitorData(context);
      case 'funding':
        return await this.collectFundingData(context);
      default:
        throw new Error(`Unknown data source type: ${source.type}`);
    }
  }

  private async collectStartupData(context: ValidationContext): Promise<CollectedData> {
    // Implement startup data collection logic
    const data = {
      industry: context.industry,
      stage: context.stage,
      metrics: {
        growth: Math.random(),
        retention: Math.random(),
        efficiency: Math.random()
      }
    };

    return {
      id: this.generateId(),
      type: 'startup',
      source: 'startupDB',
      timestamp: new Date(),
      data,
      validity: this.calculateValidity(data)
    };
  }

  private async collectMarketData(context: ValidationContext): Promise<CollectedData> {
    // Implement market data collection logic
    const data = {
      marketSize: Math.random() * 1000000000,
      growthRate: Math.random() * 0.5,
      trends: [
        { name: 'trend1', strength: Math.random() },
        { name: 'trend2', strength: Math.random() }
      ]
    };

    return {
      id: this.generateId(),
      type: 'market',
      source: 'marketIntel',
      timestamp: new Date(),
      data,
      validity: this.calculateValidity(data)
    };
  }

  private async collectCompetitorData(context: ValidationContext): Promise<CollectedData> {
    // Implement competitor data collection logic
    const data = {
      competitors: [
        { name: 'comp1', marketShare: Math.random() },
        { name: 'comp2', marketShare: Math.random() }
      ],
      marketDynamics: {
        concentration: Math.random(),
        barriers: Math.random()
      }
    };

    return {
      id: this.generateId(),
      type: 'competitor',
      source: 'competitorTracker',
      timestamp: new Date(),
      data,
      validity: this.calculateValidity(data)
    };
  }

  private async collectFundingData(context: ValidationContext): Promise<CollectedData> {
    // Implement funding data collection logic
    const data = {
      rounds: [
        { type: 'seed', amount: Math.random() * 1000000 },
        { type: 'series_a', amount: Math.random() * 5000000 }
      ],
      metrics: {
        burnRate: Math.random() * 100000,
        runway: Math.random() * 18
      }
    };

    return {
      id: this.generateId(),
      type: 'funding',
      source: 'fundingDB',
      timestamp: new Date(),
      data,
      validity: this.calculateValidity(data)
    };
  }

  private storeData(type: string, data: CollectedData): void {
    if (!this.collectedData.has(type)) {
      this.collectedData.set(type, []);
    }

    const typeData = this.collectedData.get(type);
    if (typeData && data.validity >= this.validityThreshold) {
      typeData.push(data);
      // Keep only last 1000 entries for memory efficiency
      if (typeData.length > 1000) {
        typeData.shift();
      }
    }
  }

  getCollectedData(type: string): CollectedData[] {
    return this.collectedData.get(type) || [];
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private calculateValidity(data: any): number {
    // Implement data validity calculation logic
    // This could include checks for:
    // - Data completeness
    // - Data freshness
    // - Source reliability
    // - Data consistency
    return 0.85;
  }
}
