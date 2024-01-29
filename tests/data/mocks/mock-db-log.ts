import type { LogErrorRepository } from '@/data/protocols'

export class LogErrorRepositorySpy implements LogErrorRepository {
  public stack: string

  async logError(stack: string): Promise<void> {
    this.stack = stack
  }
}
