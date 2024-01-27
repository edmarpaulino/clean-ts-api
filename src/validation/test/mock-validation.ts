import type { Validation } from '@/presentation/protocols'

export class ValidationSpy implements Validation {
  private readonly defaultError: null = null

  public input: any
  public error: null | Error = this.defaultError

  validate(input: any): null | Error {
    this.input = input
    return this.error
  }

  reset(): void {
    this.error = this.defaultError
  }
}
