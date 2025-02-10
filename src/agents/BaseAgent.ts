export abstract class BaseAgent {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  async initialize(): Promise<void> {
    // Implement initialization logic
  }

  protected async validate(data: any): Promise<boolean> {
    return true;
  }
}