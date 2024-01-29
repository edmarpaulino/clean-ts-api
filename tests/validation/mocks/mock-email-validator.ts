import type { EmailValidator } from '@/validation/protocols'

export class EmailValidatorSpy implements EmailValidator {
  private readonly defaultIsEmailValid: boolean = true

  public email: string
  public isEmailValid: boolean = this.defaultIsEmailValid

  isValid(email: string): boolean {
    this.email = email
    return this.isEmailValid
  }

  reset(): void {
    this.isEmailValid = this.defaultIsEmailValid
  }
}
