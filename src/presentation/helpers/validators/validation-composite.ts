import type { Validation } from '../../protocols'

export class ValidationComposite implements Validation {
  constructor (
    private readonly validations: Validation[]
  ) {}

  validate (input: any): null | Error {
    for (const validation of this.validations) {
      const error = validation.validate(input)
      if (error) {
        return error
      }
    }
    return null
  }
}
