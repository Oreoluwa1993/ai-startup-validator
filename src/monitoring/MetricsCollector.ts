import prometheus from 'prom-client';
import { Response, Request } from 'express';

export class MetricsCollector {
  private static instance: MetricsCollector;
  private registry: prometheus.Registry;
  private httpRequestDuration: prometheus.Histogram;
  private activeUsers: prometheus.Gauge;
  private totalRequests: prometheus.Counter;

  private constructor() {
    this.registry = new prometheus.Registry();
    
    // Add default metrics
    prometheus.collectDefaultMetrics({ register: this.registry });

    // Custom metrics
    this.httpRequestDuration = new prometheus.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.5, 1, 2, 5]
    });

    this.activeUsers = new prometheus.Gauge({
      name: 'active_users',
      help: 'Number of currently active users'
    });

    this.totalRequests = new prometheus.Counter({
      name: 'total_requests',
      help: 'Total number of requests made'
    });

    // Register metrics
    this.registry.registerMetric(this.httpRequestDuration);
    this.registry.registerMetric(this.activeUsers);
    this.registry.registerMetric(this.totalRequests);
  }

  public static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  public trackRequest(req: Request, res: Response, duration: number): void {
    this.httpRequestDuration.observe(
      {
        method: req.method,
        route: req.route?.path || 'unknown',
        status_code: res.statusCode
      },
      duration
    );
    this.totalRequests.inc();
  }

  public updateActiveUsers(count: number): void {
    this.activeUsers.set(count);
  }

  public getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}