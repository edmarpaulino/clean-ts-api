import { MissingParamError } from '../../errors'
import type { Validation } from '../../protocols'

export class RequiredFieldValidation implements Validation {
  constructor (
    private readonly fieldName: string
  ) {}

  validate (input: any): null | Error {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
    return null
  }
}
