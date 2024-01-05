import { InvalidParamError } from '../../errors'
import type { EmailValidator } from '../../protocols'
import type { Validation } from './validation'

export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: any): null | Error {
    const isValid = this.emailValidator.isValid(input[this.fieldName] as string)
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
    return null
  }
}
